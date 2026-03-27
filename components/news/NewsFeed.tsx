import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function NewsFeed() {
    // Fetch the latest articles from your database
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) {
        console.error("Error fetching articles:", error);
        return <div className="text-red-500">Failed to load news feed.</div>;
    }

    if (!articles || articles.length === 0) {
        return <div className="text-zinc-500 mt-8 text-center">No articles found. Add some!</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-4xl mx-auto text-left">
            {articles.map((article) => (
                <Card key={article.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                    <CardHeader>
                        <div className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-2">
                            {article.category}
                        </div>
                        <CardTitle className="text-zinc-100 leading-snug">
                            {article.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-400 line-clamp-3 text-sm">
                            {article.content}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}