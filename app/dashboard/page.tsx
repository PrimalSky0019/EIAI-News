'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NewsFeed } from '@/components/news/NewsFeed';
import { Menu, SlidersHorizontal, BrainCircuit, Video, TrendingUp, Languages, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardPage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUserEmail(session.user.email || null);
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading your newsroom...</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">

            {/* Dashboard Header with Hamburger Menu */}
            <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        {/* THE HAMBURGER MENU */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-zinc-800 text-zinc-100">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-zinc-950 border-r border-zinc-800 text-zinc-100 p-0 w-72">
                                <SheetHeader className="p-6 border-b border-zinc-800 text-left">
                                    <SheetTitle className="text-2xl font-black text-white flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs">ET</div>
                                        Menu
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Navigation Links inside the Hamburger */}
                                <nav className="flex flex-col p-4 gap-2">
                                    <MenuLink icon={<SlidersHorizontal size={20}/>} title="My ET Newsroom" active />
                                    <MenuLink icon={<BrainCircuit size={20}/>} title="News Navigator" />
                                    <MenuLink icon={<Video size={20}/>} title="AI Video Studio" />
                                    <MenuLink icon={<TrendingUp size={20}/>} title="Story Arc Tracker" />
                                    <MenuLink icon={<Languages size={20}/>} title="Vernacular Engine" />
                                </nav>

                                <div className="absolute bottom-0 w-full p-4 border-t border-zinc-800">
                                    <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900" onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-5 w-5" />
                                        Sign Out
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div>
                            <h1 className="text-xl font-bold text-white hidden sm:block">My ET Newsroom</h1>
                        </div>
                    </div>

                    <div className="text-sm text-zinc-400 hidden md:block">
                        Logged in as <span className="text-blue-400">{userEmail}</span>
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto p-6 mt-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">For You</h2>
                        <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                            Update AI Profile
                        </Button>
                    </div>

                    <p className="text-zinc-500 italic text-sm">
                        Based on your vector profile, here is your personalized briefing.
                    </p>

                    <NewsFeed />
                </div>
            </main>

        </div>
    );
}

// Reusable component for the Hamburger Menu links
function MenuLink({ icon, title, active = false }: { icon: React.ReactNode, title: string, active?: boolean }) {
    return (
        <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600/10 text-blue-500' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
            {icon}
            {title}
        </button>
    );
}