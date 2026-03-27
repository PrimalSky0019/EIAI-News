import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function NewsFeed({ isPersonalized = false }) {
    let articles = [];

    if (isPersonalized) {
        // 1. Get the logged-in user
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Fetch their AI preference vector from the profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('preference_embedding')
            .eq('id', user?.id)
            .single();

        if (profile?.preference_embedding) {
            // 3. Call the "match_articles" function we wrote in Supabase SQL!
            const { data: matchedNews } = await supabase.rpc('match_articles', {
                query_embedding: profile.preference_embedding,
                match_threshold: 0.5,
                match_count: 10,
            });
            articles = matchedNews;
        }
    } else {
        // Standard landing page feed (unauthenticated)
        const { data } = await supabase.from('articles').select('*').limit(5);
        articles = data || [];
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-4xl mx-auto">
            {articles.map((article: any) => (
                <Card key={article.id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-400 line-clamp-2">{article.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}