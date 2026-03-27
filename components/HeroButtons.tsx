'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ingestArticle } from "@/app/actions/news";

export function HeroButtons() {
    const router = useRouter();

    const handleTestIngest = async () => {
        alert("Sending to Gemini & Supabase...");

        const result = await ingestArticle(
            "Sensex Hits Record High Amid Global Rally",
            "The Indian stock market surged today, driven by massive foreign institutional investments and strong quarterly earnings from the banking sector. Retail investors are optimistic.",
            "Markets"
        );

        if (result.success) {
            alert("Success! Refresh the page to see your new article.");
        } else {
            alert("Error saving article. Check your API keys.");
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-500/20" onClick={() => router.push('/login')}>
                Build My Feed
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-zinc-800 hover:bg-zinc-900" onClick={handleTestIngest}>
                Add Test Article
            </Button>
        </div>
    );
}