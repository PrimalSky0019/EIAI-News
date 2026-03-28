import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Button } from "@/components/ui/button";
import { resetInterests } from '@/app/actions/profile';
import { RefreshCcw, User, Mail, Calendar, Clock, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import type { Article } from '@/lib/types';
import { ArticleCard } from '@/components/news/ArticleCard';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch recently viewed articles
    const { data: historyData } = await supabase
        .from('user_activity')
        .select(`
            created_at,
            articles (
                id,
                title,
                content,
                category,
                created_at
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(9);

    const historyArticles = (historyData || [])
        .map(entry => entry.articles)
        .filter((a): a is any => a !== null) as Article[];

    const creationDate = new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    const hasVector = !!profile?.preference_embedding;

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-8">

                {/* Page Header */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest border-b-2 border-[#ED1C24] pb-0.5">
                            Subscriber Profile
                        </span>
                    </div>
                    <h2 className="text-4xl font-serif font-black tracking-tight text-black">My Identity Hub</h2>
                </div>

                {/* Profile Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Security & Account */}
                    <div className="bg-white border border-zinc-200 shadow-sm">
                        <div className="border-b border-zinc-200 p-4 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#ED1C24]" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Security Access</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <Mail className="text-zinc-400 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Registered Email</p>
                                    <p className="font-bold text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Calendar className="text-zinc-400 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Member Since</p>
                                    <p className="font-bold text-sm">{creationDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <User className="text-zinc-400 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Full Name</p>
                                    <p className="font-bold text-sm">{profile?.full_name || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Vector Status */}
                    <div className="bg-white border border-zinc-200 shadow-sm">
                        <div className="border-b border-zinc-200 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-[#ED1C24]" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Intelligence Calibration</h3>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 ${hasVector ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                {hasVector ? '● Vector Active' : '○ Not Calibrated'}
                            </span>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-zinc-600 leading-relaxed mb-6 font-serif">
                                Your newsroom relies on a 768-dimensional vector representation of your professional interests. 
                                If your priorities have shifted, recalibrate to retrain your AI model.
                            </p>
                            <form action={resetInterests}>
                                <Button 
                                    type="submit" 
                                    className="w-full rounded-none font-black uppercase tracking-widest text-[10px] bg-[#ED1C24] hover:bg-black text-white py-5 transition-colors"
                                >
                                    <RefreshCcw size={14} className="mr-2" /> Re-run AI Onboarding Flow
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Reading History */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] border-b-2 border-[#ED1C24] pb-1 shrink-0 flex items-center gap-2">
                            <Clock size={12} /> Recently Viewed Briefings
                        </h3>
                        <div className="h-px flex-1 bg-zinc-200" />
                    </div>

                    {historyArticles.length === 0 ? (
                        <div className="bg-white border border-dashed border-zinc-300 p-12 text-center flex flex-col items-center gap-3">
                            <BookOpen className="text-zinc-300 h-8 w-8" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No reading history recorded yet</p>
                            <p className="text-xs text-zinc-400">Articles you read will appear here for quick reference.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {historyArticles.map((article, idx) => (
                                <ArticleCard key={`history-${article.id}-${idx}`} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}