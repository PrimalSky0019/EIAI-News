import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewsFeed } from "@/components/news/NewsFeed";
import { HeroButtons } from "@/components/HeroButtons";
import {
    Newspaper,
    TrendingUp,
    Mic2,
    PlayCircle,
    Languages,
    BrainCircuit,
    Sparkles,
    Clock,
    ArrowRight
} from "lucide-react";

export default function ETLandingPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] selection:bg-[#B31921]/10">

            {/* 1. TOP TICKER */}
            <div className="w-full bg-[#1A1A1A] text-white py-1.5 px-8 text-[10px] font-bold tracking-widest flex justify-between uppercase">
                <div className="flex gap-4">
                    <span>SENSEX 73,583.22 <span className="text-red-500">▼ -1690.1</span></span>
                    <span className="hidden sm:inline text-zinc-500">|</span>
                    <span className="hidden sm:inline">NIFTY 22,123.45 <span className="text-green-500">▲ +142.3</span></span>
                </div>
                <span>27 MARCH 2026 | 11:50 PM IST</span>
                <span className="text-yellow-500 animate-pulse">● LIVE: AI NEWSROOM ENGINE ONLINE</span>
            </div>

            {/* 2. MASTHEAD */}
            <header className="border-b-4 border-black py-10 text-center bg-white">
                <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter text-[#B31921]">
                    THE AI TIMES
                </h1>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em] text-zinc-400">
                    The Personalized Business Newsroom of 2026
                </p>
            </header>

            {/* 3. HERO NAVIGATION */}
            <nav className="border-b border-zinc-200 sticky top-0 bg-white/90 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-10 py-4 text-[11px] font-black uppercase tracking-widest">
                    <a href="#feed" className="hover:text-[#B31921] transition-colors">Personalized Feed</a>
                    <a href="#features" className="hover:text-[#B31921] transition-colors">Intelligence Suite</a>
                    <Link href="/login" className="text-[#B31921] border-b-2 border-[#B31921]">★ Prime Exclusives</Link>
                    <a href="#features" className="hover:text-[#B31921] transition-colors text-zinc-400">Story Arc</a>
                </div>
            </nav>

            {/* 4. MAIN HERO SECTION */}
            <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 pt-16">
                <div className="lg:col-span-8 border-r border-zinc-200 pr-12">
                    <div className="inline-block bg-[#B31921] text-white px-3 py-1 text-[10px] font-bold mb-6 tracking-tighter">
                        EDITORIAL VISION 2026
                    </div>
                    <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] tracking-tighter mb-8">
                        Static homepages are a relic of 2005.
                        <span className="italic text-zinc-300"> We fixed it.</span>
                    </h2>
                    <p className="text-xl text-zinc-600 leading-relaxed mb-10 max-w-2xl font-medium">
                        Stop digging through noise. Our AI synthesizes real-time ET data into a
                        fundamentally unique newsroom built specifically for your portfolio, industry, and language.
                    </p>
                    <HeroButtons />
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <h3 className="border-b-2 border-black pb-2 font-black text-xs uppercase tracking-widest">
                        Intelligence Suite
                    </h3>
                    <FeatureItem icon={<Mic2 size={18}/>} title="Interactive Briefings" desc="Chat directly with Union Budget reports & live earnings." />
                    <FeatureItem icon={<PlayCircle size={18}/>} title="AI Video Studio" desc="Articles auto-rendered into 60s shorts with data visuals." />
                    <FeatureItem icon={<Languages size={18}/>} title="Vernacular Engine" desc="Culturally adapted news in Hindi, Tamil, and 10 others." />
                    <FeatureItem icon={<TrendingUp size={18}/>} title="Story Arc Tracker" desc="Visual narrative mapping of ongoing corporate moves." />
                </div>
            </section>

            {/* 5. THE FEATURE DEEP-DIVE (The "Why We Are Better" Section) */}
            <section id="features" className="bg-[#1A1A1A] text-white py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center gap-4 mb-16">
                        <h2 className="text-4xl font-serif font-bold italic text-[#B31921]">The Transformation</h2>
                        <div className="h-px flex-1 bg-zinc-800"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        <FeatureCard
                            icon={<Sparkles className="text-[#B31921]" />}
                            title="My ET: Personalized"
                            desc="Not just a filter. A mutual fund investor gets portfolio-relevant shifts; a startup founder gets funding news and competitor moves."
                        />
                        <FeatureCard
                            icon={<BrainCircuit className="text-[#B31921]" />}
                            title="News Navigator"
                            desc="Don't read 8 separate articles. Interact with a single AI-powered deep briefing that synthesizes all ET coverage into one explorable document."
                        />
                        <FeatureCard
                            icon={<Clock className="text-[#B31921]" />}
                            title="Story Arc Tracker"
                            desc="Pick any ongoing story and AI builds a visual narrative: interactive timelines, key players mapped, and sentiment shifts tracked."
                        />
                    </div>

                    <div className="mt-20 border-t border-zinc-800 pt-12 text-center">
                        <Link href="/login">
                            <Button className="bg-[#B31921] hover:bg-white hover:text-black rounded-none px-12 py-8 text-lg font-bold">
                                BUILD MY PERSONALIZED NEWSROOM <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. THE PREVIEW FEED */}
            <section id="feed" className="bg-[#F4F4F4] py-24 px-8 border-t border-zinc-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="font-serif text-4xl font-bold mb-4 italic">Latest in the Newsroom</h3>
                        <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Automated Vector Matching Engine</p>
                    </div>
                    <NewsFeed isPersonalized={false} />
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="py-12 border-t border-zinc-200 text-center bg-white">
                <p className="text-[10px] font-bold text-zinc-400 tracking-[0.3em] uppercase">
                    The AI Times © 2026 — Amaravati Edition — Powered by Gemini 1.5
                </p>
            </footer>

        </main>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-5 items-start group cursor-pointer border-b border-zinc-100 pb-4 last:border-0">
            <div className="mt-1 text-[#B31921] group-hover:scale-110 transition-transform">{icon}</div>
            <div>
                <h4 className="font-bold text-sm tracking-tight group-hover:text-[#B31921] transition-colors">{title}</h4>
                <p className="text-xs text-zinc-500 leading-tight mt-1">{desc}</p>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="space-y-4">
            <div className="mb-6">{icon}</div>
            <h4 className="text-2xl font-serif font-bold">{title}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}