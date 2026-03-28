'use server'

import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';
import { logger, formatErrorMessage } from '@/lib/logger';
import type { ServerActionResponse } from '@/lib/types';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'edge';

/**
 * Updates user's personalized feed preferences with AI-generated embeddings
 * @param topics - Array of interest topics selected by the user
 * @returns Server action response with success/error status
 */
export async function updatePersonalizedFeed(
  topics: string[]
): ServerActionResponse<void> {
  const supabase = await createClient();

  // Validate input
  if (!topics || topics.length === 0) {
    return { success: false, error: 'Please select at least one interest topic' };
  }

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.error('Authentication failed in updatePersonalizedFeed', authError);
    if (authError) Sentry.captureException(authError);
    return { success: false, error: 'Authentication failed. Please log in again.' };
  }

  try {
    // Generate context description for embedding
    const interestDescription = 
      `A business professional interested in: ${topics.join(', ')}. ` +
      'Focus on market impacts and strategic moves.';

    // Generate 768-dimensional vector embedding
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: interestDescription,
    });

    // Update user profile with new preferences
    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        preference_embedding: embedding,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (dbError) {
      logger.error('Database error in updatePersonalizedFeed', dbError);
      Sentry.captureException(dbError);
      return { success: false, error: 'Failed to save preferences' };
    }

    logger.info('Successfully updated user preferences', { 
      userId: user.id, 
      topicsCount: topics.length 
    });
    
    return { success: true, message: 'Preferences updated successfully' };

  } catch (error) {
    logger.error('AI Embedding error in updatePersonalizedFeed', error);
    Sentry.captureException(error);
    return { success: false, error: formatErrorMessage(error) };
  }
}