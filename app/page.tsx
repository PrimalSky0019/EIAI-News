import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Zap, BrainCircuit, PlayCircle,
    History, Languages, ArrowRight, ShieldCheck,
    Newspaper, TrendingUp, Globe, ChevronRight
} from "lucide-react";

export default function LandingPage() {
    const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] selection:bg-[#ED1C24] selection:text-white">

            {/* --- THIN RED TOP STRIPE (ET Signature) --- */}
            <div className="w-full h-1 bg-[#ED1C24]" />

            {/* --- UTILITY BAR --- */}
            <div className="w-full border-b border-zinc-200 bg-white hidden md:block">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-1.5">
                    <div className="flex gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>{formattedDate}</span>
                        <span className="text-[#ED1C24]">India Edition</span>
                    </div>
                    <div className="flex gap-6 items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <Link href="/login" className="hover:text-[#ED1C24] transition-colors">Sign In</Link>
                        <div className="h-3 w-px bg-zinc-300" />
                        <Link href="/login" className="bg-[#ED1C24] text-white px-4 py-1 hover:bg-black transition-colors">Subscribe</Link>
                    </div>
                </div>
            </div>

            {/* --- MASTHEAD --- */}
            <header className="w-full bg-white border-b-4 border-black">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center text-center">
                    <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tighter text-black leading-none flex items-start">
                        THE AI TIMES<span className="w-3 h-3 bg-[#ED1C24] mt-2 ml-1 shrink-0" />
                    </h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-3">
                        AI-Powered Business Intelligence · Est. 2026
                    </p>
                </div>
            </header>

            {/* --- LIVE TICKER BAR --- */}
            <div className="w-full bg-[#1A1A1A] text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[#ED1C24] px-3 py-1 shrink-0 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                    </span>
                    <div className="overflow-hidden whitespace-nowrap flex-1">
                        <p className="text-xs font-medium animate-marquee inline-block">
                            📈 Sensex surges 600pts on FII buying &nbsp;&nbsp;|&nbsp;&nbsp; 🤖 Google announces Gemini 2.0 Ultra &nbsp;&nbsp;|&nbsp;&nbsp; 🏦 RBI holds rates steady at 6.5% &nbsp;&nbsp;|&nbsp;&nbsp; 🌍 Global AI infrastructure spending to hit $500B by 2027 &nbsp;&nbsp;|&nbsp;&nbsp; ⚡ NVIDIA reports record Q4 earnings
                        </p>
                    </div>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <main className="max-w-7xl mx-auto px-6">

                {/* Hero */}
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-b border-zinc-200">
                    
                    {/* Main Hero Content (3/5) */}
                    <div className="lg:col-span-3 py-12 pr-0 lg:pr-12 lg:border-r border-zinc-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-4 border-b-2 border-[#ED1C24] inline-block pb-1">
                            The Newsroom Revolution
                        </p>
                        <h2 className="text-5xl md:text-7xl font-serif font-black leading-[0.9] tracking-tight mb-6">
                            News is no longer<br />
                            <span className="text-[#ED1C24] italic">one-size-fits-all.</span>
                        </h2>
                        <p className="max-w-xl text-lg text-zinc-600 leading-relaxed mb-8 font-serif">
                            Static articles are a relic of the past. The AI Times uses Gemini-powered
                            vector embeddings to build a newsroom that understands <em>you</em> — your sector, 
                            your interests, your edge.
                        </p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="/login">
                                <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-none px-8 py-6 font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#ED1C24]/20 flex items-center gap-2">
                                    Build My Newsroom <ArrowRight size={16} />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" className="rounded-none px-8 py-6 font-black text-[11px] uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all">
                                    Member Login
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Side Panel (2/5) */}
                    <div className="lg:col-span-2 py-12 pl-0 lg:pl-8 flex flex-col gap-6">
                        <div className="bg-zinc-50 border border-zinc-200 p-6 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] mb-3 flex items-center gap-2">
                                <TrendingUp size={12} /> Market Snapshot
                            </p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                                    <span className="text-sm font-bold">SENSEX</span>
                                    <span className="text-sm font-black text-green-600">78,245 ▲ 1.2%</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                                    <span className="text-sm font-bold">NIFTY 50</span>
                                    <span className="text-sm font-black text-green-600">23,678 ▲ 0.9%</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                                    <span className="text-sm font-bold">NASDAQ</span>
                                    <span className="text-sm font-black text-red-600">18,234 ▼ 0.3%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold">AI INDEX</span>
                                    <span className="text-sm font-black text-green-600">4,521 ▲ 2.8%</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#1A1A1A] text-white p-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] mb-2">
                                Intelligence Brief
                            </p>
                            <p className="text-sm font-serif italic text-zinc-300 leading-relaxed">
                                "142 articles matched to your profile today. Your AI newsroom adapts in real-time."
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- FEATURES SECTION (ET Editorial Grid) --- */}
                <section className="py-16">
                    <div className="flex items-center gap-4 mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] border-b-2 border-[#ED1C24] pb-1 shrink-0">
                            What Sets Us Apart
                        </h3>
                        <div className="h-px flex-1 bg-zinc-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">

                        <FeatureCard
                            icon={<BrainCircuit className="w-7 h-7 text-[#ED1C24]" />}
                            tag="01"
                            title="My ET: Personalized Newsroom"
                            desc="A startup founder gets funding news; an investor gets portfolio moves. A fundamentally different experience for every reader."
                        />

                        <FeatureCard
                            icon={<Zap className="w-7 h-7 text-[#ED1C24]" />}
                            tag="02"
                            title="News Navigator"
                            desc="Interactive briefings that synthesize 8+ articles into a single explorable document with real-time follow-up questions."
                        />

                        <FeatureCard
                            icon={<PlayCircle className="w-7 h-7 text-[#ED1C24]" />}
                            tag="03"
                            title="AI Video Studio"
                            desc="Instantly transform any breaking story into a broadcast-quality short video with narration and data visuals."
                        />

                        <FeatureCard
                            icon={<History className="w-7 h-7 text-[#ED1C24]" />}
                            tag="04"
                            title="Story Arc Tracker"
                            desc="Track the entire lifecycle of a business merger — visual narratives, key player mapping, and sentiment tracking."
                        />

                        <FeatureCard
                            icon={<Languages className="w-7 h-7 text-[#ED1C24]" />}
                            tag="05"
                            title="Vernacular Engine"
                            desc="Context-aware translation into Hindi, Tamil, and Telugu. Culturally adapted explanations, not just literal text."
                        />

                        {/* Testimonial Block */}
                        <div className="bg-black p-10 flex flex-col justify-center text-white min-h-[280px]">
                            <h4 className="text-2xl font-serif font-bold italic mb-4 leading-snug">"I can't go back to reading news the old way."</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Chief Investment Officer, 2026</p>
                        </div>
                    </div>
                </section>

                {/* --- CTA BANNER --- */}
                <section className="border-y-4 border-black py-16 mb-16 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-4">
                        Start Today
                    </p>
                    <h3 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4">
                        Your Intelligence Edge Awaits
                    </h3>
                    <p className="text-zinc-500 text-sm mb-8 max-w-xl mx-auto">
                        Join thousands of decision-makers who rely on AI-curated briefings every morning.
                    </p>
                    <Link href="/login">
                        <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-none px-12 py-6 font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#ED1C24]/20">
                            Initialize My Newsroom <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-[#1A1A1A] border-t-4 border-[#ED1C24]">
                <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-serif font-black tracking-tighter text-white mb-4 flex items-start">
                            THE AI TIMES<span className="w-2 h-2 bg-[#ED1C24] mt-1 ml-1" />
                        </h3>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-sm font-serif italic">
                            An AI-powered intelligence platform for the modern decision-maker. 
                            Powered by Google Gemini and advanced vector synthesis.
                        </p>
                    </div>
                    <FooterLinkGroup title="The Product" links={['My ET', 'Navigator', 'Video Studio', 'Story Arc Tracker']} />
                    <FooterLinkGroup title="Legal" links={['Terms of Service', 'Privacy Policy', 'AI Ethics Statement']} />
                </div>
                <div className="border-t border-zinc-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <p className="text-[10px] text-zinc-600">© 2026 The AI Times. All rights reserved.</p>
                        <p className="text-[10px] text-zinc-600">Part of The Economic Times Digital Network</p>
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
        <div className="bg-white p-10 min-h-[280px] flex flex-col group cursor-default hover:bg-zinc-50 transition-colors">
            <div className="mb-auto">
                <div className="flex items-center justify-between mb-6">
                    {icon}
                    <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">Feature {tag}</span>
                </div>
                <h3 className="text-xl font-serif font-black mb-3 group-hover:text-[#ED1C24] transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mt-6 text-zinc-400 group-hover:text-[#ED1C24] group-hover:gap-3 transition-all">
                Explore <ArrowRight size={12} />
            </button>
        </div>
    )
}

function FooterLinkGroup({ title, links }: { title: string, links: string[] }) {
    return (
        <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</p>
            <ul className="space-y-3">
                {links.map(link => (
                    <li key={link} className="text-sm text-zinc-500 hover:text-[#ED1C24] cursor-pointer transition-colors font-medium">{link}</li>
                ))}
            </ul>
        </div>
    )
}