import DashboardShell from '@/components/dashboard/DashboardShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PlayCircle, Sparkles, Clock, Film } from 'lucide-react';

export default async function VideoStudioPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-8">

                {/* Page Header */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest border-b-2 border-[#ED1C24] pb-0.5">
                            Experimental
                        </span>
                    </div>
                    <h2 className="text-4xl font-serif font-black tracking-tight text-black">AI Video Studio</h2>
                    <p className="text-sm text-zinc-500 mt-2 max-w-2xl font-serif">
                        Transform any breaking story into a broadcast-quality short video with narration and data visuals — powered by Gemini.
                    </p>
                </div>

                {/* Feature Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-zinc-200 shadow-sm p-8 flex flex-col items-center text-center group hover:border-[#ED1C24] transition-colors">
                        <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center mb-4 group-hover:bg-[#ED1C24]/5 transition-colors">
                            <Film size={28} className="text-[#ED1C24]" />
                        </div>
                        <h3 className="font-serif font-bold text-lg mb-2">Auto-Narration</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed">AI generates a news anchor script from any article with proper tone and pacing.</p>
                    </div>
                    <div className="bg-white border border-zinc-200 shadow-sm p-8 flex flex-col items-center text-center group hover:border-[#ED1C24] transition-colors">
                        <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center mb-4 group-hover:bg-[#ED1C24]/5 transition-colors">
                            <Sparkles size={28} className="text-[#ED1C24]" />
                        </div>
                        <h3 className="font-serif font-bold text-lg mb-2">Data Overlays</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed">Automatic chart generation and key stat overlays from article content.</p>
                    </div>
                    <div className="bg-white border border-zinc-200 shadow-sm p-8 flex flex-col items-center text-center group hover:border-[#ED1C24] transition-colors">
                        <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center mb-4 group-hover:bg-[#ED1C24]/5 transition-colors">
                            <Clock size={28} className="text-[#ED1C24]" />
                        </div>
                        <h3 className="font-serif font-bold text-lg mb-2">60-Second Briefs</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed">Optimized for social sharing — perfect for LinkedIn, X, and Instagram Reels.</p>
                    </div>
                </div>

                {/* Coming Soon Banner */}
                <div className="border-y-4 border-black py-12 text-center">
                    <PlayCircle size={48} className="text-zinc-200 mx-auto mb-4" />
                    <h3 className="text-3xl font-serif font-black mb-2">Coming Q2 2026</h3>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                        The Video Studio is currently in closed beta. Select an article from your feed to generate a preview.
                    </p>
                    <button className="mt-6 bg-[#ED1C24] text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors">
                        Request Early Access
                    </button>
                </div>
            </div>
        </DashboardShell>
    );
}
