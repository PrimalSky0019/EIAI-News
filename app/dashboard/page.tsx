import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { TrendingUp, Activity, Zap, Clock, ChevronRight, Newspaper, BrainCircuit } from 'lucide-react'
import LiveNewsSync from './LiveNewsSync'

// Dynamic category-based images from Unsplash
const CATEGORY_IMAGES: Record<string, string> = {
    'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    'tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    'markets': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    'startups': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop',
    'policy': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop',
    'regulation': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop',
    'global economy': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
    'economy': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
    'macro': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
    'automotive': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?q=80&w=2070&auto=format&fit=crop',
    'finance': 'https://images.unsplash.com/photo-1554260570-e9689a3418b8?q=80&w=2070&auto=format&fit=crop',
    'healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    'energy': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?q=80&w=2070&auto=format&fit=crop',
};

function getCategoryImage(category?: string): string {
    if (!category) return CATEGORY_IMAGES['default'];
    return CATEGORY_IMAGES[category.toLowerCase()] || CATEGORY_IMAGES['default'];
}

function formatTimeAgo(dateString?: string) {
    if (!dateString) return 'RECENT';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'JUST NOW';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} MINS AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} HRS AGO`;
    return `${Math.floor(diffHours / 24)} DAYS AGO`;
}

export default async function DashboardPage() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch AI profile
    let articles: any[] = [];
    const { data: profile } = await supabase
        .from('profiles')
        .select('preference_embedding')
        .eq('id', user.id)
        .single();

    if (profile?.preference_embedding) {
        const { data: matchedNews } = await supabase.rpc('match_articles', {
            query_embedding: profile.preference_embedding,
            match_threshold: 0.1,
            match_count: 8,
        });
        articles = matchedNews || [];
    }

    if (articles.length === 0) {
        const { data: latest } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8);
        articles = latest || [];
    }

    const priorityArticle = articles.length > 0 ? articles[0] : null;
    const secondaryArticles = articles.length > 1 ? articles.slice(1, 4) : [];
    const feedArticles = articles.length > 4 ? articles.slice(4) : [];
    const hasLimitedContent = articles.length <= 1;

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-6">
                
                {/* KPI Row */}
                <div className="bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-200 text-black rounded-sm">
                    <div className="flex-1 p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors cursor-default">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-[#ED1C24]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Market Mood</span>
                        </div>
                        <div className="text-sm font-black flex items-center gap-1.5 text-green-600">
                            BULLISH <TrendingUp size={14} />
                        </div>
                    </div>
                    <div className="flex-1 p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors cursor-default">
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-[#ED1C24]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Articles</span>
                        </div>
                        <div className="text-sm font-black text-black">
                            {articles.length} <span className="text-[10px] text-zinc-400 font-normal">IN DATABASE</span>
                        </div>
                    </div>
                    <div className="flex-1 p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors cursor-default">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#ED1C24]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Agent</span>
                        </div>
                        <div className="text-sm font-black text-black">
                            <span className="text-green-600">●</span> Online
                        </div>
                    </div>
                </div>

                {/* Main Newspaper Layout */}
                <div className={`grid grid-cols-1 ${hasLimitedContent ? '' : 'lg:grid-cols-4'} gap-6 items-start`}>
                    
                    {/* Left Column (Priority & Secondary) */}
                    <div className={`${hasLimitedContent ? '' : 'lg:col-span-3'} space-y-6`}>
                        
                        {/* Top Story */}
                        {priorityArticle ? (
                            <div className="bg-white border border-zinc-200 shadow-sm p-6 relative hover:shadow-md transition-shadow duration-300 rounded-sm">
                                <div className="absolute top-0 left-0 w-10 h-1 bg-[#ED1C24] rounded-br" />
                                
                                <h2 className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="border-b-2 border-black pb-1">Top Story</span>
                                    {profile?.preference_embedding && (
                                        <span className="bg-gradient-to-r from-amber-500 to-[#ED1C24] text-white text-[8px] px-2 py-0.5 rounded-sm font-bold">AI MATCH</span>
                                    )}
                                </h2>
                                
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl md:text-4xl font-serif font-black text-black leading-tight mb-4 hover:text-[#ED1C24] transition-colors cursor-pointer">
                                            {priorityArticle.title}
                                        </h1>
                                        <p className="text-zinc-600 text-sm leading-relaxed mb-4 font-serif line-clamp-4">
                                            {priorityArticle.content?.substring(0, 300)}...
                                        </p>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase">
                                            <span>{formatTimeAgo(priorityArticle.created_at)}</span>
                                            <span className="text-[#ED1C24]">{priorityArticle.category || 'Focus'}</span>
                                            {priorityArticle.source_url && (
                                                <a href={priorityArticle.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Source →</a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-[40%] aspect-[4/3] relative overflow-hidden bg-zinc-100 group cursor-pointer border border-zinc-200 rounded-sm">
                                        <img 
                                            src={getCategoryImage(priorityArticle.category)} 
                                            alt={priorityArticle.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 font-bold rounded-sm">
                                            FILE PHOTO
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-zinc-200 shadow-sm p-10 text-center rounded-sm">
                                <Newspaper size={40} className="mx-auto text-zinc-200 mb-4" />
                                <h2 className="text-xl font-serif font-bold text-zinc-800 mb-2">No stories yet</h2>
                                <p className="text-sm text-zinc-500 max-w-md mx-auto">Use the Intelligence Agent below to fetch and ingest the latest AI news into your personalized feed.</p>
                            </div>
                        )}

                        {/* Secondary Stories Row */}
                        {secondaryArticles.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {secondaryArticles.map((article: any, i: number) => (
                                    <div key={article.id} className={`bg-white p-5 border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 rounded-sm ${i === 0 ? 'border-t-2 border-t-[#ED1C24]' : ''}`}>
                                        <div>
                                            <div className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest mb-2">
                                                {article.category || 'Update'}
                                            </div>
                                            <h3 className="text-lg font-serif font-bold text-black leading-snug mb-3 hover:text-[#ED1C24] transition-colors cursor-pointer">
                                                {article.title}
                                            </h3>
                                            <p className="text-zinc-600 text-xs line-clamp-3 mb-4 font-serif">
                                                {article.content}
                                            </p>
                                        </div>
                                        <div className="text-[9px] font-bold text-zinc-400 uppercase">
                                            {formatTimeAgo(article.created_at)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA: When limited content, show a helpful prompt */}
                        {hasLimitedContent && (
                            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 flex flex-col md:flex-row items-center gap-6 bg-white/50">
                                <div className="w-14 h-14 rounded-full bg-[#ED1C24]/5 flex items-center justify-center flex-shrink-0">
                                    <BrainCircuit size={28} className="text-[#ED1C24]" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="font-bold text-zinc-800 text-base mb-1">Build your intelligence feed</h3>
                                    <p className="text-sm text-zinc-500 max-w-lg">
                                        Press <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-[10px] font-mono font-bold">Ctrl+K</kbd> to open the Intelligence Agent. 
                                        Try: <em>&quot;Fetch the latest AI news&quot;</em> to populate your dashboard with live articles.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Latest Feed) - only show when we have enough content */}
                    {!hasLimitedContent && (
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-zinc-200 shadow-sm rounded-sm">
                                <div className="bg-zinc-900 text-white p-3 flex justify-between items-center rounded-t-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-pulse" /> Latest News
                                    </h3>
                                    <ChevronRight size={16} className="text-zinc-400" />
                                </div>
                                <div className="p-4 flex flex-col">
                                    {feedArticles.length > 0 ? (
                                        feedArticles.map((article: any, index: number) => (
                                            <FeedItem 
                                                key={article.id}
                                                time={formatTimeAgo(article.created_at)} 
                                                category={article.category || 'Brief'} 
                                                title={article.title} 
                                                isLast={index === feedArticles.length - 1}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-xs text-zinc-500 py-4 text-center">Feed caught up.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                
                {/* Background synchronization driver for the live AI feed */}
                <LiveNewsSync />
            </div>
        </DashboardShell>
    )
}

function FeedItem({ time, category, title, isLast = false, onClick }: any) {
    return (
        <div onClick={onClick} className={`py-3.5 group cursor-pointer ${!isLast ? 'border-b border-zinc-100' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] text-zinc-400 font-bold">{time}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="text-[9px] font-black text-[#ED1C24] uppercase tracking-widest">{category}</span>
            </div>
            <h5 className="text-sm font-bold font-serif text-black leading-snug group-hover:text-[#ED1C24] transition-colors">
                {title}
            </h5>
        </div>
    );
}