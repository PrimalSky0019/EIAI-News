import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewsFeed } from "@/components/news/NewsFeed";
import { HeroButtons } from "@/components/HeroButtons";
import { SlidersHorizontal, BrainCircuit, Video, TrendingUp, Languages } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">

            {/* 1. TOP NAVIGATION BAR */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">ET</div>
                    AI NEWSROOM
                </div>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Sign In</Button>
                    </Link>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
                <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium border border-zinc-800 rounded-full bg-zinc-900/50 text-blue-400">
                    Redefining Business News for 2026
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                    I can't go back to <br /> the old way.
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Static text articles are dead. Experience a fundamentally different, AI-generated newsroom tailored exactly to your portfolio, industry, and language.
                </p>

                <HeroButtons />
            </section>

            {/* 3. THE 5 CORE FEATURES GRID */}
            <section className="px-6 py-24 bg-zinc-900/30 border-y border-zinc-900">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-zinc-100">The Next Generation of Media</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<SlidersHorizontal className="text-blue-500" />}
                            title="My ET: Personalized Newsroom"
                            desc="A fundamentally different experience. Founders get funding news; investors get portfolio updates. Not just a filter—a custom newsroom."
                        />
                        <FeatureCard
                            icon={<BrainCircuit className="text-blue-500" />}
                            title="News Navigator"
                            desc="Interact with a single AI-powered deep briefing that synthesizes all ET coverage into an explorable document with follow-up Q&A."
                        />
                        <FeatureCard
                            icon={<Video className="text-blue-500" />}
                            title="AI News Video Studio"
                            desc="Transform any breaking story into a broadcast-quality short video with AI-generated narration and animated data visuals."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-blue-500" />}
                            title="Story Arc Tracker"
                            desc="AI builds a complete visual narrative of ongoing stories: interactive timelines, key players mapped, and sentiment shifts tracked."
                        />
                        <FeatureCard
                            icon={<Languages className="text-blue-500" />}
                            title="Vernacular Engine"
                            desc="Real-time, context-aware translation into Hindi, Tamil, Telugu, and Bengali. Culturally adapted explanations, not literal translations."
                        />
                    </div>
                </div>
            </section>

            {/* 4. PREVIEW FEED */}
            <section className="px-6 py-24 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center text-zinc-300 italic">Live AI Vector Feed</h2>
                <NewsFeed />
            </section>

        </main>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="space-y-4 p-6 rounded-2xl border border-zinc-800/50 bg-zinc-950 hover:bg-zinc-900 hover:border-blue-500/50 transition-all shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}