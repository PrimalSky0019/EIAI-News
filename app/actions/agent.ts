'use server'

import { generateText, embed, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { fetchLiveNews } from '@/lib/news-fetcher';

// Admin client for background ingestion (bypasses RLS)
function getSupabaseAdmin() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function executeAgentInstruction(userInstruction: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

        // 2. The Autonomous Agent Execution with Full Tool Suite
        const { text, steps } = await generateText({
            model: google('gemini-2.0-flash'),
            stopWhen: stepCountIs(5),
            system: `
            You are the Chief Intelligence Agent for The AI Times.
            Your job is to answer the user's request using your available tools.
            
            Current Local Database Context:
            ${contextString}
            
            INSTRUCTIONS:
            - If asked about a specific keyword, company, or person, use 'searchNews'.
            - If asked for news in a category (tech, markets, etc.), use 'getNewsByCategory'.
            - For conceptual or semantic queries, use 'semanticSearch' for AI-powered vector matches.
            - If asked about user preferences or interests, use 'getUserPreferences'.
            - If asked to "fetch", "find", or "ingest" NEW live information, use 'fetchLiveNews'.
            - Once you fetch new articles, use 'ingestToDatabase' to save them.
            - If the local context is sufficient to answer, respond directly without tools.
            - Format your final response in clean Markdown.
            `,
            prompt: userInstruction,
            tools: {
                // Tool 1: Keyword search on articles table
                searchNews: tool({
                    description: 'Search for news articles by keyword or topic in the database',
                    inputSchema: z.object({
                        query: z.string().describe('The search query or topic'),
                        limit: z.number().optional().default(5),
                    }),
                    execute: async ({ query, limit }: { query: string; limit?: number }) => {
                        const { data } = await supabase
                            .from('articles')
                            .select('id, title, content, category, created_at')
                            .ilike('title', `%${query}%`)
                            .limit(limit ?? 5);
                        return data ?? [];
                    },
                }),

                // Tool 2: Latest news by category
                getNewsByCategory: tool({
                    description: 'Get latest news articles for a specific category like Technology, Markets, Finance',
                    inputSchema: z.object({
                        category: z.string().describe('Category like Technology, Markets, Finance, etc.'),
                        limit: z.number().optional().default(5),
                    }),
                    execute: async ({ category, limit }: { category: string; limit?: number }) => {
                        const { data } = await supabase
                            .from('articles')
                            .select('id, title, content, category, created_at')
                            .ilike('category', `%${category}%`)
                            .order('created_at', { ascending: false })
                            .limit(limit ?? 5);
                        return data ?? [];
                    },
                }),

                // Tool 3: Semantic vector search using embeddings
                semanticSearch: tool({
                    description: 'Find articles semantically similar to a concept using AI vector embeddings',
                    inputSchema: z.object({
                        topic: z.string().describe('The topic or concept to search for'),
                    }),
                    execute: async ({ topic }: { topic: string }) => {
                        const { embedding } = await embed({
                            model: google.textEmbeddingModel('text-embedding-004'),
                            value: topic,
                        });
                        const { data } = await supabase.rpc('match_articles', {
                            query_embedding: embedding,
                            match_threshold: 0.7,
                            match_count: 5,
                        });
                        return data ?? [];
                    },
                }),

                // Tool 4: User preferences lookup
                getUserPreferences: tool({
                    description: "Get the current user's profile and preference information",
                    inputSchema: z.object({}),
                    execute: async () => {
                        if (!user) return { error: 'User not authenticated' };
                        const { data } = await supabase
                            .from('profiles')
                            .select('full_name, preference_embedding, onboarding_completed')
                            .eq('id', user.id)
                            .single();
                        return data ?? { error: 'Profile not found' };
                    },
                }),

                // Tool 5: Fetch live news from RSS feeds
                fetchLiveNews: tool({
                    description: 'Fetch real-time news articles from live web RSS feeds',
                    inputSchema: z.object({
                        query: z.string().describe('The topic to search for (e.g., "AI regulations", "Tesla stock")'),
                    }),
                    execute: async ({ query }: { query: string }) => {
                        console.log(`[AGENT TOOL] Fetching live news for: ${query}`);
                        const liveResults = await fetchLiveNews(5);
                        if (liveResults.length === 0) {
                            return [{
                                title: `No results found for: ${query}`,
                                content: 'The RSS feed may be temporarily unavailable.',
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

                // Tool 6: Vectorize and save to database
                ingestToDatabase: tool({
                    description: 'Vectorize and save an article to the secure intelligence database',
                    inputSchema: z.object({
                        title: z.string(),
                        content: z.string(),
                        category: z.string(),
                    }),
                    execute: async ({ title, content, category }: { title: string; content: string; category: string }) => {
                        console.log(`[AGENT TOOL] Ingesting: ${title}`);
                        const adminDb = getSupabaseAdmin();
                        const { embedding } = await embed({
                            model: google.textEmbeddingModel('text-embedding-004'),
                            value: content,
                        });
                        const { error } = await adminDb.from('articles').insert({
                            title, content, category, embedding
                        });
                        if (error) return { success: false, error: error.message };
                        return { success: true, message: `Successfully ingested '${title}' into the vector database.` };
                    },
                }),
            }
        });

        // Map tool executions for UI display
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