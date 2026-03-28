'use server'

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { redirect } from 'next/navigation';

/**
 * Completely wipes user's personalized vector and onboarding status to allow reskilling.
 */
export async function resetInterests(): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Not authenticated');
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            preference_embedding: null,
            onboarding_completed: false
        })
        .eq('id', user.id);

    if (error) {
        logger.error('Failed to reset profile', error);
        throw new Error('Failed to reset profile');
    }

    redirect('/onboarding');
}

/**
 * Trace article consumption analytics.
 */
export async function logArticleView(articleId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !articleId) return { success: false };

    try {
        const { error } = await supabase.from('user_activity').insert({
            user_id: user.id,
            article_id: articleId
        });
        
        if (error) throw error;
        
        return { success: true };
    } catch (e) {
        logger.error('Failed to log article view', e);
        return { success: false };
    }
}
