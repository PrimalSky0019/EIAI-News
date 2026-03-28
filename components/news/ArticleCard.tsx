"use client";

import { Card, CardContent } from "@/components/ui/card";
import { logArticleView } from "@/app/actions/activity";

export function ArticleCard({ article, matchScore }: { article: any, matchScore?: number }) {

    const handleClick = async () => {
        // Log the view in the background
        await logArticleView(article.id);

        // Optional: Open the actual article link or open a modal here
        // window.open(article.url, '_blank');
        console.log("Logged view for:", article.title);
    };

    return (
        <Card
            onClick={handleClick}
            className="rounded-none border-zinc-200 bg-white hover:border-[#B31921] transition-all cursor-pointer group shadow-none relative"
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4 border-b border-[#B31921] pb-2">
                    <div className="text-[10px] font-black text-[#B31921] uppercase tracking-[0.2em]">
                        {article.category || 'MARKET UPDATE'}
                    </div>
                    {/* Display AI Match Indicator if personalized */}
                    {matchScore && (
                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1">
                            AI Match
                        </div>
                    )}
                </div>

                <h4 className="font-serif text-xl font-bold leading-tight group-hover:text-[#B31921] mb-3 transition-colors">
                    {article.title}
                </h4>
                <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed">
                    {article.content}
                </p>
            </CardContent>
        </Card>
    );
}