import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Zap, BrainCircuit, PlayCircle,
    History, Languages, ArrowRight, ShieldCheck
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] selection:bg-primary selection:text-white">

            {/* --- TOP NAVIGATION --- */}
            <nav className="fixed top-0 w-full z-50 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-zinc-200 h-20 px-6 md:px-12 flex items-center justify-between">
                <h1 className="text-3xl font-serif font-black tracking-tighter text-primary">
                    ET<span className="text-black italic">AI</span>
                </h1>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hidden md:inline-flex">
                            Member Login
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button className="bg-primary hover:bg-black text-white rounded-none px-8 font-black text-[10px] uppercase tracking-widest transition-all">
                            Initialize Newsroom
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="border-t-8 border-black pt-12">
                    <p className="text-[12px] font-black uppercase tracking-[0.5em] text-primary mb-6">
                        The Newsroom Revolution — Amaravati 2026
                    </p>
                    <h2 className="text-6xl md:text-9xl font-serif font-black leading-[0.85] tracking-tighter mb-12">
                        News is no longer <br />
                        <span className="italic text-zinc-300">one-size-fits-all.</span>
                    </h2>
                    <p className="max-w-2xl text-xl font-medium text-zinc-500 leading-relaxed mb-12">
                        Static articles are a relic of 2005. Welcome to a fundamentally different
                        intelligence experience powered by Gemini 1.5 Pro and Vector Synthesis.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="bg-black text-white rounded-none h-16 px-10 font-bold tracking-widest uppercase text-xs">
                            Experience My ET →
                        </Button>
                        <div className="flex items-center gap-2 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200">
                            <ShieldCheck size={14} className="text-primary" /> Verified Business Intel
                        </div>
                    </div>
                </div>

                {/* --- THE 5 PILLARS OF 2026 NEWS --- */}
                <section className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-zinc-200 border border-zinc-200">

                    <FeatureCard
                        icon={<BrainCircuit className="w-8 h-8 text-primary" />}
                        tag="Feature 01"
                        title="My ET: Personalized Newsroom"
                        desc="A startup founder gets funding news; an investor gets portfolio moves. A fundamentally different experience for every user."
                    />

                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-primary" />}
                        tag="Feature 02"
                        title="News Navigator"
                        desc="Interactive briefings that synthesize 8+ articles into a single explorable document with real-time follow-up questions."
                    />

                    <FeatureCard
                        icon={<PlayCircle className="w-8 h-8 text-primary" />}
                        tag="Feature 03"
                        title="AI Video Studio"
                        desc="Instantly transform any breaking story into a broadcast-quality short video with narration and data visuals."
                    />

                    <FeatureCard
                        icon={<History className="w-8 h-8 text-primary" />}
                        tag="Feature 04"
                        title="Story Arc Tracker"
                        desc="Track the entire lifecycle of a business merger. Visual narratives, key player mapping, and contrarian sentiment."
                    />

                    <FeatureCard
                        icon={<Languages className="w-8 h-8 text-primary" />}
                        tag="Feature 05"
                        title="Vernacular Engine"
                        desc="Context-aware translation into Hindi, Tamil, and Telugu. Culturally adapted explanations, not just literal text."
                    />

                    <div className="bg-black p-12 flex flex-col justify-center text-white min-h-[400px]">
                        <h4 className="text-3xl font-serif font-bold italic mb-6">"I can't go back to reading news the old way."</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Chief Investment Officer, 2026</p>
                    </div>

                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="border-t border-zinc-200 py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <h3 className="text-2xl font-serif font-black tracking-tighter text-primary mb-4">ETAI</h3>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest max-w-xs">
                            Part of The Economic Times Digital Network. Powered by Google Gemini 1.5 Pro.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-20">
                        <FooterLinkGroup title="The Product" links={['My ET', 'Navigator', 'Video Studio']} />
                        <FooterLinkGroup title="Legal" links={['Terms', 'Privacy', 'AI Ethics']} />
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, tag, title, desc }: { 
    icon: React.ReactNode; 
    tag: string; 
    title: string; 
    desc: string;
}) {
    return (
        <div className="bg-white p-12 min-h-[400px] flex flex-col group cursor-default">
            <div className="mb-auto">
                <div className="mb-8">{icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">{tag}</p>
                <h3 className="text-3xl font-serif font-black mb-6 group-hover:underline decoration-primary transition-all underline-offset-8">
                    {title}
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{desc}</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mt-8 group-hover:gap-4 transition-all">
                Learn More <ArrowRight size={14} className="text-primary" />
            </button>
        </div>
    )
}

function FooterLinkGroup({ title, links }: { title: string, links: string[] }) {
    return (
        <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</p>
            <ul className="space-y-2">
                {links.map(link => (
                    <li key={link} className="text-xs font-bold hover:text-primary cursor-pointer">{link}</li>
                ))}
            </ul>
        </div>
    )
}