'use server'

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase for the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function savePreferences(userId: string, topics: string[]) {
    try {
        // 1. Turn their topics into a natural language sentence
        const preferenceText = `This user is a professional interested in business news specifically regarding: ${topics.join(', ')}.`;

        // 2. Ask Gemini to turn that sentence into a 768-dimension vector
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: preferenceText,
        });

        // 3. Save this vector to their profile in the database
        const { error } = await supabase
            .from('profiles')
            .update({ preference_embedding: embedding })
            .eq('id', userId);

        if (error) {
            console.error("Supabase Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("AI Error:", error);
        return { success: false, error: 'Failed to generate AI profile.' };
    }
}