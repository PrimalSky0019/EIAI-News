import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { BarChart2, TrendingUp, Eye, Clock, Zap } from 'lucide-react';

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch basic analytics
    const { count: totalViews } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    const { count: totalArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-8">

                {/* Page Header */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest border-b-2 border-[#ED1C24] pb-0.5">
                            Dashboard
                        </span>
                    </div>
                    <h2 className="text-4xl font-serif font-black tracking-tight text-black">Analytics</h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Articles Read" value={String(totalViews || 0)} icon={Eye} />
                    <StatCard title="Articles Available" value={String(totalArticles || 0)} icon={BarChart2} />
                    <StatCard title="AI Precision" value="96%" icon={Zap} />
                    <StatCard title="Avg Read Time" value="4.2m" icon={Clock} />
                </div>

                {/* Placeholder Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-zinc-200 shadow-sm">
                        <div className="border-b border-zinc-200 p-4 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                <TrendingUp size={14} className="text-[#ED1C24]" /> Reading Activity
                            </h3>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Last 30 Days</span>
                        </div>
                        <div className="p-8 flex items-center justify-center h-64 text-center">
                            <div>
                                <BarChart2 size={48} className="text-zinc-200 mx-auto mb-4" />
                                <p className="text-sm text-zinc-400 font-serif italic">Chart visualization coming soon.</p>
                                <p className="text-[10px] text-zinc-300 uppercase tracking-widest mt-1">Recharts integration pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 shadow-sm">
                        <div className="border-b border-zinc-200 p-4 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                <Zap size={14} className="text-[#ED1C24]" /> Top Categories
                            </h3>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">By Interest</span>
                        </div>
                        <div className="p-6 space-y-4">
                            {['Technology', 'Markets', 'Startups', 'Policy', 'Global Economy'].map((cat, i) => (
                                <div key={cat} className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-zinc-700 w-28">{cat}</span>
                                    <div className="flex-1 bg-zinc-100 h-3 relative">
                                        <div 
                                            className="absolute inset-y-0 left-0 bg-[#ED1C24]" 
                                            style={{ width: `${90 - i * 15}%`, opacity: 1 - i * 0.15 }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-400 w-10 text-right">{90 - i * 15}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
    return (
        <div className="bg-white border border-zinc-200 shadow-sm p-6 flex items-start justify-between hover:border-[#ED1C24] transition-colors cursor-pointer group">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{title}</p>
                <h4 className="text-3xl font-serif font-black text-black">{value}</h4>
            </div>
            <div className="p-2 bg-zinc-50 text-zinc-400 group-hover:text-[#ED1C24] transition-colors">
                <Icon size={20} />
            </div>
        </div>
    );
}
