'use server'

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Use service_role key for internal ingests

export async function processRawArticle(rawArticle: { title: string, content: string, category: string }) {
    // 1. Generate the Vector for searching
    const { embedding } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: `${rawArticle.title} ${rawArticle.content}`,
    });

    // 2. Use Gemini to "Tag" the article for the Story Arc Tracker
    // (e.g., Sentiment: Bullish, Key Players: Tata, Reliance)

    // 3. Store in Supabase
    await supabaseAdmin.from('articles').insert({
        title: rawArticle.title,
        content: rawArticle.content,
        category: rawArticle.category,
        embedding: embedding,
        // metadata: { sentiment: 'bullish', arc_id: 'tata-semiconductor-move' }
    });
}