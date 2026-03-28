'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutGrid, Compass, BarChart2, BrainCircuit,
    Settings, Search, Bell, Plus, LogOut, Menu, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardShell({
    children,
    userEmail
}: {
    children: React.ReactNode,
    userEmail: string | undefined
}) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navItems = [
        { name: "Home", href: "/dashboard", icon: LayoutGrid },
        { name: "Navigator", href: "/dashboard/navigator", icon: Compass },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
        { name: "Intelligence", href: "/dashboard/intelligence", icon: BrainCircuit },
        { name: "Settings", href: "/dashboard/profile", icon: Settings },
    ]

    const userName = userEmail ? userEmail.split('@')[0] : "Member"
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    return (
        <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-[#B31921] selection:text-white">

            {/* Mobile Header (Visible only on small screens) */}
            <header className="md:hidden bg-[#09090B] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-serif font-black tracking-tighter flex items-center gap-2">
                    THE AI TIMES <div className="w-1.5 h-1.5 rounded-full bg-[#B31921]" />
                </h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-400 hover:text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Dark Sidebar */}
            <aside className={`
                fixed md:sticky top-0 left-0 h-screen w-full md:w-64 bg-[#09090B] border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-xl font-serif font-black tracking-tighter flex items-center gap-2">
                        THE AI TIMES <div className="w-1.5 h-1.5 rounded-full bg-[#B31921]" />
                    </h1>
                </div>

                <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={18} className={isActive ? "text-[#B31921]" : ""} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 mt-auto border-t border-white/5 md:border-t-0">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center font-bold text-sm uppercase border border-white/10">
                                {userName.charAt(0)}
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-bold text-white capitalize truncate">{userName}</p>
                                <p className="text-[10px] font-bold text-[#B31921] uppercase tracking-widest truncate">Pro Member</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-zinc-500 hover:text-white transition-colors p-2 shrink-0">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col relative overflow-hidden md:h-screen md:overflow-y-auto w-full">

                {/* Top Header (Desktop Only) */}
                <header className="hidden md:flex sticky top-0 z-20 bg-[#09090B]/80 backdrop-blur-md border-b border-white/10 px-8 py-5 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white capitalize">Morning, {userName}.</h2>
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">
                            Your AI-Matched Intelligence Briefing
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-zinc-400">{formattedDate}</span>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search intelligence..."
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all w-64"
                            />
                        </div>
                        <button className="relative text-zinc-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#B31921] rounded-full border-2 border-[#09090B]"></span>
                        </button>
                        <button className="bg-white text-black p-2 rounded-full hover:bg-zinc-200 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Content Injection */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}