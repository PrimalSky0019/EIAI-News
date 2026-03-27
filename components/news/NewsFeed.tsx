import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Card, CardContent } from "@/components/ui/card";

export async function NewsFeed({ isPersonalized = false }) {
    // 1. Await the cookies (Fix for Next.js 15/16)
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    let articles = [];

    if (isPersonalized) {
        // 2. Identify the logged-in user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // 3. Get the user's AI interest vector
            const { data: profile } = await supabase
                .from('profiles')
                .select('preference_embedding')
                .eq('id', user.id)
                .single();

            if (profile?.preference_embedding) {
                // 4. Run the Semantic Vector Search
                const { data: matchedNews, error: rpcError } = await supabase.rpc('match_articles', {
                    query_embedding: profile.preference_embedding,
                    match_threshold: 0.2, // Lowered slightly to ensure the feed isn't empty
                    match_count: 12,
                });

                if (!rpcError) articles = matchedNews || [];
            }
        }
    }

    // 5. Fallback: Show latest generic news if not logged in or no preferences set
    if (articles.length === 0) {
        const { data: latestNews } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);
        articles = latestNews || [];
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
                <Card
                    key={article.id}
                    className="rounded-none border-zinc-200 bg-white hover:border-[#B31921] transition-all cursor-pointer group shadow-none"
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-[10px] font-black text-[#B31921] uppercase tracking-[0.2em] border-b border-[#B31921]">
                                {article.category || 'MARKET UPDATE'}
                            </div>
                            {isPersonalized && (
                                <div className="text-[9px] font-bold text-zinc-400 uppercase italic">
                                    AI Matched
                                </div>
                            )}
                        </div>

                        <h4 className="font-serif text-xl font-bold leading-tight group-hover:text-[#B31921] transition-colors mb-3">
                            {article.title}
                        </h4>

                        <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed mb-4">
                            {article.content}
                        </p>

                        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                4 Min Read
                            </span>
                            <span className="text-[#B31921] text-[10px] font-black group-hover:translate-x-1 transition-transform">
                                READ FULL STORY →
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}