'use server'

import { generateText, embed, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { fetchLiveNews } from '@/lib/news-fetcher';

// Initialize Supabase Admin for background ingestion
function getSupabaseAdmin() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { get() { return null; }, set() {}, remove() {} } }
    );
}

export async function executeAgentInstruction(userInstruction: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    try {
        // 1. Context Retrieval (Standard RAG)
        const { embedding: queryVector } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: userInstruction,
        });

        const { data: localContext } = await supabase.rpc('match_articles', {
            query_embedding: queryVector,
            match_threshold: 0.1,
            match_count: 3,
        });

        const contextString = localContext?.map((a: any) => `Title: ${a.title}\nContent: ${a.content}`).join('\n\n') || "No local data found.";

        // 2. The Autonomous Agent Execution
        const { text, steps } = await generateText({
            model: google('gemini-2.0-flash'),
            stopWhen: stepCountIs(5), // Allow up to 5 tool-calling steps
            system: `
            You are the Chief Intelligence Agent for The AI Times.
            Your job is to answer the user's request. 
            
            Current Local Database Context:
            ${contextString}
            
            INSTRUCTIONS:
            - If the user asks to "fetch", "find", or "ingest" NEW information, you MUST use the 'fetchLiveNews' tool.
            - Once you fetch new articles, you MUST use the 'ingestToDatabase' tool to save them.
            - If the local context is sufficient to answer a general question, do not use tools.
            - Format your final response in clean Markdown.
            `,
            prompt: userInstruction,
            tools: {
                // TOOL 1: Fetch live news from ET RSS feeds
                fetchLiveNews: tool({
                    description: 'Fetch real-time news articles from the web based on a query.',
                    inputSchema: z.object({
                        query: z.string().describe('The topic to search for (e.g., "AI regulations", "Tesla stock")'),
                    }),
                    execute: async ({ query }: { query: string }) => {
                        console.log(`[AGENT TOOL] Fetching live news for: ${query}`);
                        
                        const liveResults = await fetchLiveNews(5);
                        
                        if (liveResults.length === 0) {
                            return [{ 
                                title: `No results found for: ${query}`,
                                content: `Unable to fetch live articles. The RSS feed may be temporarily unavailable.`,
                                category: "Live Feed"
                            }];
                        }
                        
                        return liveResults.map(a => ({
                            title: a.title,
                            content: a.raw_text,
                            category: a.category,
                        }));
                    },
                }),

                // TOOL 2: Process and save the news to Supabase
                ingestToDatabase: tool({
                    description: 'Vectorize and save an article to the secure intelligence database.',
                    inputSchema: z.object({
                        title: z.string(),
                        content: z.string(),
                        category: z.string(),
                    }),
                    execute: async ({ title, content, category }: { title: string; content: string; category: string }) => {
                        console.log(`[AGENT TOOL] Ingesting: ${title}`);
                        const adminDb = getSupabaseAdmin();

                        // Generate the 768D Vector DNA
                        const { embedding } = await embed({
                            model: google.textEmbeddingModel('text-embedding-004'),
                            value: content,
                        });

                        // Inject into Supabase
                        const { error } = await adminDb.from('articles').insert({
                            title,
                            content,
                            category,
                            embedding
                        });

                        if (error) return { success: false, error: error.message };
                        return { success: true, message: `Successfully injected '${title}' into the vector database.` };
                    },
                })
            }
        });

        // Map the steps so the UI can show the user what the agent did
        const toolExecutions = steps
            .filter(step => step.toolCalls && step.toolCalls.length > 0)
            .flatMap(step => step.toolCalls.map(tc => tc.toolName));

        return { 
            success: true, 
            briefing: text, 
            actionsTaken: toolExecutions 
        };

    } catch (error: any) {
        console.error("Agent Error:", error);
        return { success: false, error: error.message || "The Agent failed to process the request." };
    }
}