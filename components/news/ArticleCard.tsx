'use client'

import { Card, CardContent } from "@/components/ui/card";
import type { Article } from '@/lib/types';
import { logArticleView } from '@/app/actions/profile';
import { toast } from 'sonner';

export function ArticleCard({ article }: { article: Article }) {
    const handleClick = async () => {
        // Log view to the database
        const result = await logArticleView(article.id);
        if (result.success) {
            toast.success("Read logged to user profile history!");
        }
    };

    return (
        <Card onClick={handleClick} className="rounded-none border-zinc-200 bg-white hover:border-primary transition-all cursor-pointer group shadow-none">
            <CardContent className="p-6">
                <div className="text-[10px] font-black text-primary uppercase mb-4 tracking-[0.2em] border-b border-primary inline-block">
                    {article.category || 'MARKET UPDATE'}
                </div>
                <h4 className="font-serif text-xl font-bold leading-tight group-hover:text-primary mb-3 transition-colors">
                    {article.title}
                </h4>
                <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed">
                    {article.content}
                </p>
            </CardContent>
        </Card>
    );
}
