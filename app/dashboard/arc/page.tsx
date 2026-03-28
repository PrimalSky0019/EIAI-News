import DashboardShell from '@/components/dashboard/DashboardShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GitBranch, Users, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

export default async function StoryArcPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Sample story arcs for the UI
    const sampleArcs = [
        {
            title: "India's AI Regulation Framework",
            status: "Active",
            events: 14,
            lastUpdate: "2 hours ago",
            sentiment: "Neutral",
        },
        {
            title: "Adani-Hindenburg Saga",
            status: "Monitoring",
            events: 87,
            lastUpdate: "1 day ago",
            sentiment: "Volatile",
        },
        {
            title: "EV Battery Supply Chain Wars",
            status: "Active",
            events: 32,
            lastUpdate: "4 hours ago",
            sentiment: "Bullish",
        },
    ];

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-8">

                {/* Page Header */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest border-b-2 border-[#ED1C24] pb-0.5">
                            Narrative Intelligence
                        </span>
                    </div>
                    <h2 className="text-4xl font-serif font-black tracking-tight text-black">Story Arc Tracker</h2>
                    <p className="text-sm text-zinc-500 mt-2 max-w-2xl font-serif">
                        Track the full lifecycle of a business story — from breaking news to resolution. 
                        AI maps key players, timelines, and sentiment shifts.
                    </p>
                </div>

                {/* Story Arcs List */}
                <div className="bg-white border border-zinc-200 shadow-sm">
                    <div className="bg-black text-white p-4 flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <GitBranch size={14} /> Tracked Story Arcs
                        </h3>
                        <span className="text-[10px] text-zinc-400 font-bold">{sampleArcs.length} STORIES</span>
                    </div>

                    {sampleArcs.map((arc, i) => (
                        <div 
                            key={i} 
                            className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 transition-colors group ${i !== sampleArcs.length - 1 ? 'border-b border-zinc-200' : ''}`}
                        >
                            <div className="flex-1">
                                <h4 className="text-xl font-serif font-bold text-black group-hover:text-[#ED1C24] transition-colors mb-1">
                                    {arc.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Calendar size={10} /> {arc.lastUpdate}</span>
                                    <span className="flex items-center gap-1"><Users size={10} /> {arc.events} Events</span>
                                    <span className={`px-2 py-0.5 ${
                                        arc.sentiment === 'Bullish' ? 'bg-green-50 text-green-600 border border-green-200' :
                                        arc.sentiment === 'Volatile' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                        'bg-zinc-100 text-zinc-500 border border-zinc-200'
                                    }`}>
                                        {arc.sentiment}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${
                                    arc.status === 'Active' ? 'bg-[#ED1C24]/10 text-[#ED1C24]' : 'bg-zinc-100 text-zinc-500'
                                }`}>
                                    {arc.status}
                                </span>
                                <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#ED1C24] transition-colors" />
                            </div>
                        </div>
                    ))}

                    <div className="bg-zinc-50 border-t border-zinc-200 p-4 text-center">
                        <button className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest hover:text-black transition-colors">
                            + Create New Story Arc
                        </button>
                    </div>
                </div>

                {/* Visual Timeline Preview */}
                <div className="bg-white border border-zinc-200 shadow-sm p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] border-b-2 border-[#ED1C24] pb-1 shrink-0 flex items-center gap-2">
                            <TrendingUp size={12} /> Timeline Preview
                        </h3>
                        <div className="h-px flex-1 bg-zinc-200" />
                    </div>
                    
                    {/* Timeline visualization placeholder */}
                    <div className="flex items-center justify-between py-8">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                            <div key={month} className="flex flex-col items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${i <= 2 ? 'bg-[#ED1C24]' : 'bg-zinc-200'}`} />
                                <div className={`h-16 w-px ${i <= 2 ? 'bg-[#ED1C24]' : 'bg-zinc-200'}`} />
                                <span className={`text-[10px] font-bold ${i <= 2 ? 'text-black' : 'text-zinc-300'}`}>{month}</span>
                                {i <= 2 && (
                                    <span className="text-[8px] text-zinc-400 font-bold">{[14, 8, 5][i]} events</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
