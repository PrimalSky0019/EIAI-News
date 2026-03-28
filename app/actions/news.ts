'use server'

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';
import { logger, formatErrorMessage } from '@/lib/logger';
import type { ServerActionResponse } from '@/lib/types';

/**
 * Ingests a news article and generates AI vector embeddings
 * @param title - Article title
 * @param content - Article content
 * @param category - Article category (e.g., "Markets", "Technology")
 * @returns Server action response with success/error status
 */
export async function ingestArticle(
  title: string, 
  content: string, 
  category: string
): ServerActionResponse<void> {
  const supabase = await createClient();

  // Validate input
  if (!title || !content || !category) {
    return { success: false, error: 'Title, content, and category are required' };
  }
  
  try {
    // Generate 768-dimensional vector embedding using Gemini
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: `Title: ${title}\n\nContent: ${content}`,
    });

    // Save article with vector embedding to Supabase
    const { error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        category,
        embedding,
      });

    if (error) {
      logger.error('Supabase insert error in ingestArticle', error);
      return { success: false, error: 'Failed to save article to database' };
    }

    logger.info('Successfully ingested article', { title, category });
    return { 
      success: true, 
      message: 'Article ingested and vectorized successfully!' 
    };

  } catch (error) {
    logger.error('Error ingesting article', error);
    return { success: false, error: formatErrorMessage(error) };
  }
}