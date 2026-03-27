'use server' // This tells Next.js to NEVER send this code to the browser (keeps API keys safe)

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { supabase } from '@/lib/supabase';

// This function takes a raw news article and turns it into AI-searchable data
export async function ingestArticle(title: string, content: string, category: string) {
    try {
        // 1. The Magic: Ask Gemini to turn the article text into a mathematical vector
        // We use the text-embedding-004 model which outputs a 768-dimensional vector
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: `Title: ${title}\n\nContent: ${content}`,
        });

        // 2. Save everything to Supabase (Title, Content, Category, AND the Vector)
        const { data, error } = await supabase
            .from('articles')
            .insert({
                title: title,
                content: content,
                category: category,
                embedding: embedding, // This is the array of 768 numbers!
            });

        if (error) {
            console.error("Supabase Error:", error);
            throw new Error("Failed to save to database");
        }

        return { success: true, message: 'Article ingested and vectorized successfully!' };

    } catch (error) {
        console.error('Error ingesting article:', error);
        return { success: false, error: 'Failed to process the article' };
    }
}