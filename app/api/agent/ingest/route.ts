import { NextResponse } from 'next/server';
import { generateText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';
import { fetchLiveNews } from '@/lib/news-fetcher';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    // Basic security check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.AGENT_SECRET_KEY}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const processedArticles: string[] = [];

    try {
        console.log("Agent Initialized: Fetching Live News...");
        
        // 1. Fetch REAL news from ET RSS feeds
        const liveNews = await fetchLiveNews(2);

        for (const article of liveNews) {
            console.log(`\nProcessing: ${article.title}`);

            // Skip if there's no real text to process
            if (!article.raw_text || article.raw_text.length < 20) {
                console.log("   - Skipping: Not enough text content.");
                continue;
            }

            // 2. Synthesize Agent (Gemini)
            console.log("   - Synthesizing raw text...");
            const { text: synthesizedContent } = await generateText({
                model: google('gemini-2.0-flash'),
                system: "You are a senior financial analyst. Rewrite the provided news summary into a highly professional, 2-sentence market intelligence briefing. Do not invent information.",
                prompt: `Title: ${article.title}\nSummary: ${article.raw_text}`,
            });

            // 3. Vectorize Agent
            console.log("   - Generating vector embeddings...");
            const { embedding } = await embed({
                model: google.textEmbeddingModel('gemini-embedding-2-preview'),
                value: synthesizedContent,
            });

            // 4. Inject into Supabase
            console.log("   - Injecting into Vector Database...");
            const { error: dbError } = await supabaseAdmin
                .from('articles')
                .insert({
                    title: article.title,
                    content: synthesizedContent,
                    category: article.category,
                    embedding: embedding
                });

            if (dbError) throw dbError;

            processedArticles.push(article.title);
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully ingested ${processedArticles.length} live articles.`,
            articles: processedArticles
        });

    } catch (error: any) {
        console.error("Agent Failure:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}