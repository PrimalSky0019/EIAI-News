'use server'

import { fetchLiveNews } from '@/lib/news-fetcher';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { logger } from '@/lib/logger';

// Custom provider instance
const googleModel = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

function getSupabaseAdmin() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function syncLatestNews() {
    try {
        const adminDb = getSupabaseAdmin();
        logger.info('Starting background sync of latest news...');

        // 1. Fetch live news (3 items per source)
        const liveArticles = await fetchLiveNews(3);
        if (!liveArticles || liveArticles.length === 0) {
            return { added: 0, removed: 0 };
        }

        // 2. Fetch existing titles to prevent duplication
        const { data: existing } = await adminDb
            .from('articles')
            .select('title')
            .order('created_at', { ascending: false })
            .limit(100);
            
        const existingTitles = new Set(existing?.map(a => a.title.toLowerCase()) || []);

        const newArticles = liveArticles.filter(a => !existingTitles.has(a.title.toLowerCase()));

        // 3. Vectorize and insert new articles
        let added = 0;
        for (const a of newArticles) {
            try {
                const { embedding } = await embed({
                    model: googleModel.textEmbeddingModel('gemini-embedding-2-preview'),
                    value: `Title: ${a.title}\n\nContent: ${a.raw_text}`,
                });
                
                const { error } = await adminDb.from('articles').insert({
                    title: a.title,
                    content: a.raw_text,
                    category: a.category,
                    source_url: a.source_url,
                    embedding,
                });

                if (!error) {
                    added++;
                } else {
                    logger.error(`Failed to insert article ${a.title}`, error);
                }
            } catch (err) {
                logger.error(`Failed to embed article ${a.title}`, err);
            }
        }

        // 4. Cleanup old articles (keep only the 50 most recent to prevent DB bloat)
        // Or delete articles older than 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const { count: removedCount, error: deleteError } = await adminDb
            .from('articles')
            .delete({ count: 'exact' })
            .lte('created_at', twoDaysAgo.toISOString());
            
        if (deleteError) {
             logger.error('Failed to clean up old articles', deleteError);
        }

        logger.info(`Background sync completed. Added: ${added}, Removed old: ${removedCount || 0}`);
        return { added, removed: removedCount || 0 };
    } catch (error) {
        logger.error('Failed background sync', error);
        return { added: 0, removed: 0 };
    }
}
