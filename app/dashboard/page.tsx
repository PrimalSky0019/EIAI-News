import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NewsFeed } from '@/components/news/NewsFeed';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Newspaper, BrainCircuit, Globe, Zap } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Fetch the user's AI metadata to show in the header
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, onboarding_completed')
        .eq('id', user.id)
        .single();

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-10 pb-20">

                {/* 1. THE AI INTELLIGENCE HEADER */}
                <section className="bg-white border-l-8 border-primary p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-4xl font-serif font-black tracking-tighter">
                                Welcome, {profile?.full_name || user.email?.split('@')[0]}
                            </h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                AI Engine: Active & Synchronized
                            </p>
                        </div>
                        <div className="bg-primary/5 border border-primary/20 p-4 max-w-xs">
                            <div className="flex items-center gap-2 mb-1">
                                <Zap size={14} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Current Persona</span>
                            </div>
                            <p className="text-xs font-medium italic text-zinc-600">
                                "Prioritizing high-impact Fintech moves and Indian Startup funding rounds."
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. KEY INSIGHT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Priority Matches" value="14" sub="Last 24 hours" icon={<Newspaper size={18}/>} />
                    <StatCard title="Sentiment Index" value="+8.2" sub="Bullish Trend" icon={<TrendingUp size={18} className="text-green-500"/>} />
                    <StatCard title="AI Precision" value="96%" sub="Vector Match" icon={<BrainCircuit size={18} className="text-primary"/>} />
                    <StatCard title="Market Scan" value="Global" sub="128 Sources" icon={<Globe size={18}/>} />
                </div>

                {/* 3. THE ANALYTICS HUB */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 rounded-none border-zinc-200 shadow-none">
                        <CardHeader className="border-b border-zinc-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-black uppercase tracking-widest">Article Volume by Interest</CardTitle>
                            <span className="text-[9px] font-bold text-zinc-400">LIVE FEED</span>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <AnalyticsChart />
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-zinc-200 shadow-none bg-zinc-50 border-dashed">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest">Top AI Keywords</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {['GenAI', 'IPO Watch', 'Funding', 'Regulatory', 'EV'].map((tag) => (
                                <div key={tag} className="flex justify-between items-center border-b border-zinc-200 pb-2">
                                    <span className="text-xs font-bold text-zinc-700">{tag}</span>
                                    <span className="text-[10px] font-black text-primary">MATCHED</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 4. THE PERSONALISED STREAM */}
                <div className="pt-10">
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-2xl font-serif font-bold">Your Intelligence Stream</h3>
                        <div className="h-px flex-1 bg-zinc-200" />
                    </div>
                    <NewsFeed isPersonalized={true} />
                </div>

            </div>
        </DashboardShell>
    );
}

function StatCard({ title, value, sub, icon }: { 
    title: string; 
    value: string; 
    sub: string; 
    icon: React.ReactNode;
}) {
    return (
        <Card className="rounded-none border-zinc-200 shadow-none bg-white hover:border-primary transition-colors">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</span>
                    {icon}
                </div>
                <div className="text-3xl font-black mb-1">{value}</div>
                <div className="text-[9px] font-bold text-zinc-400 uppercase italic">{sub}</div>
            </CardContent>
        </Card>
    );
}