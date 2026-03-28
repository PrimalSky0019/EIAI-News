import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from "@/components/ui/card";
import type { Article } from '@/lib/types';
import { ArticleCard } from './ArticleCard';

export async function NewsFeed({ isPersonalized = false }) {
    const supabase = await createClient();

    let articles: Article[] = [];

    if (isPersonalized) {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Get the user's AI vector
            const { data: profile } = await supabase
                .from('profiles')
                .select('preference_embedding')
                .eq('id', user.id)
                .single();

            if (profile?.preference_embedding) {
                // Use the vector search function
                const { data: matchedNews } = await supabase.rpc('match_articles', {
                    query_embedding: profile.preference_embedding,
                    match_threshold: 0.2,
                    match_count: 12,
                });
                articles = (matchedNews as Article[]) || [];
            }
        }
    }

    // Fallback if no personalization or no results
    if (articles.length === 0) {
        const { data: latest } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);
        articles = (latest as Article[]) || [];
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    );
}