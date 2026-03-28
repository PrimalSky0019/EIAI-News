import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetInterests } from '@/app/actions/profile';
import { RefreshCcw, User, Mail, Calendar, Clock, BookOpen } from 'lucide-react';
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

    // Fetch recently viewed articles natively connecting user_id -> user_activity -> articles
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

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-10 pb-20">
                <div className="flex items-center gap-4 mb-4">
                    <User className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-serif font-black tracking-tighter">My Identity Hub</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Security & Account Card */}
                    <Card className="rounded-none border-zinc-200 shadow-none">
                        <CardHeader className="border-b border-zinc-100 flex flex-row items-center gap-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Security Access</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <Mail className="text-zinc-400 h-5 w-5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400">Registered Email</p>
                                    <p className="font-bold">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-zinc-400 h-5 w-5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400">Clearance Date</p>
                                    <p className="font-bold">{creationDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Embedding Setup */}
                    <Card className="rounded-none border-primary bg-primary/5 shadow-none">
                        <CardHeader className="border-b border-primary/20">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <RefreshCcw size={14} /> Intelligence Calibration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm font-medium text-zinc-700 leading-relaxed mb-6">
                                Your newsroom relies on a mathematical vector representation of your professional interests. If your priorities have shifted, you can erase your current 768-dimensional model and recalibrate.
                            </p>
                            <form action={resetInterests}>
                                <Button type="submit" variant="destructive" className="rounded-none font-bold uppercase tracking-widest text-[10px] w-full bg-primary hover:bg-black">
                                    Re-run AI Onboarding Flow
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Recently Viewed History */}
                <div className="pt-10">
                    <div className="flex items-center gap-4 mb-8">
                        <Clock className="text-zinc-400" />
                        <h3 className="text-2xl font-serif font-bold tracking-tight">Recently Viewed Briefings</h3>
                        <div className="h-px flex-1 bg-zinc-200" />
                    </div>

                    {historyArticles.length === 0 ? (
                        <div className="p-10 border border-dashed border-zinc-200 text-center flex flex-col items-center gap-2">
                            <BookOpen className="text-zinc-300 h-8 w-8" />
                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No history recorded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
