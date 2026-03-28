'use server'

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Chat with Gemini about current news topics.
 * Fetches recent articles from DB to give Gemini context.
 */
export async function chatWithNavigator(
    userMessage: string,
    conversationHistory: { role: string; content: string }[]
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, reply: 'Authentication required.' };
    }

    try {
        // Fetch recent articles to give Gemini real context
        const { data: recentArticles } = await supabase
            .from('articles')
            .select('title, content, category, created_at')
            .order('created_at', { ascending: false })
            .limit(10);

        const articleContext = (recentArticles || [])
            .map((a, i) => `[${i + 1}] "${a.title}" (${a.category}) — ${a.content?.substring(0, 200)}...`)
            .join('\n');

        // Build the conversation for Gemini
        const systemPrompt = `You are the News Navigator, an elite AI analyst for "The AI Times" — a premium financial intelligence platform. 
        
Your personality: Authoritative but approachable. You speak like a senior financial journalist from the Economic Times. Use concrete data points when possible.

CURRENT ARTICLES IN DATABASE:
${articleContext || 'No articles currently in the database.'}

RULES:
- Reference specific articles from the database when relevant
- Give concise, actionable insights (3-5 paragraphs max)
- Use bullet points for key data
- If asked about something not in the articles, use your general knowledge but note that it's general analysis
- End responses with a follow-up question to deepen the conversation
- Never use markdown headers (no # symbols), just use bold text and bullet points`;

        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...conversationHistory
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                })),
            { role: 'user' as const, content: userMessage }
        ];

        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            messages,
            temperature: 0.7,
        });

        return { success: true, reply: text };

    } catch (error) {
        logger.error('Navigator chat error', error);
        return { 
            success: false, 
            reply: 'Intelligence synthesis temporarily unavailable. Please try again.' 
        };
    }
}
