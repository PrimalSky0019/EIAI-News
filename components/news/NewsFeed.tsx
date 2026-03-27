import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Card, CardContent } from "@/components/ui/card";

export async function NewsFeed({ isPersonalized = false }) {
    // 1. CRITICAL: You MUST await cookies() in Next.js 15+
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    // Now that we've awaited cookieStore, .get() will work perfectly
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    let articles = [];

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
                articles = matchedNews || [];
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
        articles = latest || [];
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
                <Card key={article.id} className="rounded-none border-zinc-200 bg-white hover:border-[#B31921] transition-all cursor-pointer group shadow-none">
                    <CardContent className="p-6">
                        <div className="text-[10px] font-black text-[#B31921] uppercase mb-4 tracking-[0.2em] border-b border-[#B31921] inline-block">
                            {article.category || 'MARKET UPDATE'}
                        </div>
                        <h4 className="font-serif text-xl font-bold leading-tight group-hover:text-[#B31921] mb-3 transition-colors">
                            {article.title}
                        </h4>
                        <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed">
                            {article.content}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}