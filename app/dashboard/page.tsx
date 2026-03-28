import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { TrendingUp, Activity, Zap, Clock, ChevronRight } from 'lucide-react'

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

// Basic time formatting
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

    return (
        <DashboardShell userEmail={user.email}>
            <div className="space-y-6 bg-newsprint min-h-screen p-1 md:p-4">
                
                {/* ET Style Ticker / KPI Row */}
                <div className="bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-200 text-black">
                    <div className="flex-1 p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-[#ED1C24]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Market Mood</span>
                        </div>
                        <div className="text-sm font-black flex items-center gap-2 text-green-600">
                            BULLISH <TrendingUp size={14} />
                        </div>
                    </div>
                    <div className="flex-1 p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-[#ED1C24]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">AI Vector Matches</span>
                        </div>
                        <div className="text-sm font-black text-black">
                            142 <span className="text-[10px] text-zinc-400 font-normal">TODAY</span>
                        </div>
                    </div>
                    <div className="flex-1 p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#ED1C24]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Processing Time</span>
                        </div>
                        <div className="text-sm font-black text-black">
                            42ms <span className="text-[10px] text-zinc-400 font-normal">AVG</span>
                        </div>
                    </div>
                </div>

                {/* Main Newspaper Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    
                    {/* Left Column (Priority & Secondary) */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* Top Story */}
                        <div className="bg-white border-2 border-zinc-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] p-6 relative hover:shadow-[8px_8px_0px_0px_rgba(237,28,36,0.1)] hover:border-[#ED1C24]/30 transition-all duration-300 group cursor-default">
                            {/* Decorative Corner Line */}
                            <div className="absolute top-0 left-0 w-8 h-1 bg-[#ED1C24]" />
                            
                            <h2 className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest mb-3 flex items-center gap-2 border-b-2 border-black inline-block pb-1">
                                Top Story
                                {profile?.preference_embedding && (
                                    <span className="bg-gradient-to-r from-amber-400 to-[#ED1C24] text-white px-2 py-0.5 ml-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">MY MATCH</span>
                                )}
                            </h2>
                            
                            {priorityArticle ? (
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <h1 className="text-4xl md:text-5xl font-serif font-black text-black leading-tight mb-4 hover:text-[#ED1C24] transition-colors cursor-pointer">
                                            {priorityArticle.title}
                                        </h1>
                                        <p className="text-zinc-600 text-sm leading-relaxed mb-4 font-serif">
                                            {priorityArticle.content?.substring(0, 300)}...
                                        </p>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase">
                                            <span>{formatTimeAgo(priorityArticle.created_at)}</span>
                                            <span className="text-[#ED1C24]">{priorityArticle.category || 'Focus'}</span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-[40%] aspect-[4/3] relative overflow-hidden bg-zinc-100 group cursor-pointer border border-zinc-200">
                                        <img 
                                            src={getCategoryImage(priorityArticle.category)} 
                                            alt={priorityArticle.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 font-bold">
                                            FILE PHOTO
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-zinc-500 italic">No news available at this time.</p>
                            )}
                        </div>

                        {/* Secondary Stories Row */}
                        {secondaryArticles.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {secondaryArticles.map((article: any, i: number) => (
                                    <div key={article.id} className={`bg-white p-5 border-2 border-zinc-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(237,28,36,0.1)] hover:border-[#ED1C24]/30 transition-all duration-300 group ${i === 0 ? 'border-t-4 border-t-[#ED1C24]' : ''}`}>
                                        <div>
                                            <div className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest mb-2">
                                                {article.category || 'Update'}
                                            </div>
                                            <h3 className="text-xl font-serif font-bold text-black leading-tight mb-3 hover:text-[#ED1C24] transition-colors cursor-pointer">
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
                    </div>

                    {/* Right Column (Latest Feed) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-zinc-200 shadow-sm">
                            <div className="bg-black text-white p-3 flex justify-between items-center">
                                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-pulse" /> Latest News
                                </h3>
                                <ChevronRight size={16} className="text-zinc-400" />
                            </div>
                            <div className="p-4 flex flex-col">
                                {feedArticles.length > 0 ? (
                                    feedArticles.map((article, index) => (
                                        <FeedItem 
                                            key={article.id}
                                            time={formatTimeAgo(article.created_at)} 
                                            category={article.category || 'Brief'} 
                                            title={article.title} 
                                            isLast={index === feedArticles.length - 1}
                                        />
                                    ))
                                ) : (
                                    <p className="text-xs text-zinc-500 p-4">Feed caught up.</p>
                                )}
                            </div>
                            <div className="bg-zinc-50 border-t border-zinc-200 p-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors">
                                <span className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest">Read All Updates</span>
                            </div>
                        </div>
                        
                        {/* Advertisement / Promo block mimicking ET */}
                        <div className="mt-6 bg-zinc-100 border border-zinc-300 p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest mb-2 font-bold">Advertisement</span>
                            <div className="w-full bg-zinc-200 border border-zinc-300 aspect-square flex items-center justify-center p-4">
                                <div className="text-center">
                                    <h4 className="font-serif font-black text-2xl mb-2">MyET Prime</h4>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-4">Ad-free insights.</p>
                                    <button className="bg-[#ED1C24] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-black transition-colors">Subscribe Now</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </DashboardShell>
    )
}

// Helper Components for the UI

function FeedItem({ time, category, title, isLast = false, onClick }: any) {
    return (
        <div onClick={onClick} className={`py-4 group cursor-pointer ${!isLast ? 'border-b border-zinc-200' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] text-zinc-500 font-bold">{time}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="text-[9px] font-black text-[#ED1C24] uppercase tracking-widest">{category}</span>
            </div>
            <h5 className="text-sm font-bold font-serif text-black leading-snug group-hover:text-[#ED1C24] transition-colors">
                {title}
            </h5>
        </div>
    );
}