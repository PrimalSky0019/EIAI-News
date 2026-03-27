'use server'

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function updatePersonalizedFeed(topics: string[]) {
    // 1. Await cookies (Required in modern Next.js)
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                // Added set/remove so the client can handle sessions correctly
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name, options) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    // 2. Get User
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Authentication failed. Please log in again." };
    }

    try {
        // 3. Generate a "Context Sentence" for Gemini
        const interestDescription = `A business professional interested in: ${topics.join(', ')}. Focus on market impacts and strategic moves.`;

        // 4. Generate the Vector Embedding (768 dimensions)
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: interestDescription,
        });

        // 5. Save to Supabase 'profiles' table
        const { error: dbError } = await supabase
            .from('profiles')
            .update({
                preference_embedding: embedding,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (dbError) {
            console.error("Database Error:", dbError);
            return { success: false, error: dbError.message };
        }

        return { success: true };

    } catch (error) {
        console.error("AI Embedding Error:", error);
        return { success: false, error: "Failed to analyze interests with AI." };
    }
}