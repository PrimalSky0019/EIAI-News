'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search, Bell, User, LogOut, Menu, X
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
        { name: "Top News", href: "/dashboard" },
        { name: "Market Navigator", href: "/dashboard/navigator" },
        { name: "Analytics", href: "/dashboard/analytics" },
        { name: "My Profile", href: "/dashboard/profile" },
    ]

    const userName = userEmail ? userEmail.split('@')[0] : "Subscriber"
    const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    const etRed = "#ED1C24"; // The signature red color

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-[#ED1C24] selection:text-white">

            {/* Top Red Bar */}
            <div className="w-full h-1 bg-[#ED1C24]" />

            {/* Utility Header (Date, Login) */}
            <div className="w-full border-b border-zinc-200 bg-white hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-1">
                    <div className="flex gap-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>{formattedDate}</span>
                        <span className="text-[#ED1C24]">Edition: GLOBAL</span>
                    </div>
                    <div className="flex gap-4 items-center text-[11px] font-bold text-zinc-500 uppercase">
                        <span className="tracking-widest capitalize">Welcome, {userName}</span>
                        <div className="h-3 w-px bg-zinc-300" />
                        <button onClick={handleLogout} className="hover:text-[#ED1C24] transition-colors flex items-center gap-1">
                            LOGOUT <LogOut size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-zinc-200 p-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h1 className="text-2xl font-serif font-black tracking-tighter text-black flex items-center gap-1">
                    THE AI TIMES <div className="w-2 h-2 bg-[#ED1C24] mt-1" />
                </h1>
                <User size={20} className="text-zinc-600" />
            </header>

            {/* Main Desktop Masthead */}
            <header className="hidden md:flex flex-col bg-white border-b-4 border-black sticky top-0 z-40 shadow-sm">
                
                {/* Logo Row */}
                <div className="max-w-7xl mx-auto w-full px-4 py-6 flex justify-between items-end">
                    <h1 className="text-5xl font-serif font-black tracking-tighter text-black flex items-start leading-[0.8]">
                        THE AI TIMES <div className="w-3 h-3 bg-[#ED1C24]" />
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-zinc-50 border border-zinc-300 px-3 py-1.5 focus-within:border-black transition-colors">
                            <input 
                                type="text" 
                                placeholder="Search news, quotes, topics..." 
                                className="bg-transparent border-none outline-none text-xs w-64 placeholder:text-zinc-400 font-serif italic"
                            />
                            <Search size={14} className="text-zinc-400" />
                        </div>
                    </div>
                </div>

                {/* Navigation Row */}
                <nav className="w-full bg-[#FAFAFA] border-t border-zinc-200">
                    <div className="max-w-7xl mx-auto px-4 flex">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`py-2.5 px-5 text-xs font-black uppercase tracking-widest transition-colors flex items-center
                                        ${index !== 0 ? 'border-l border-zinc-300' : ''} 
                                        ${isActive 
                                            ? "text-[#ED1C24] bg-white border-t-2 border-t-[#ED1C24]" 
                                            : "text-black hover:text-[#ED1C24] hover:bg-white border-t-2 border-t-transparent"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </header>

            {/* Mobile Nav Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-[60px] bg-white z-40 border-t border-zinc-200 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center bg-zinc-50 border border-zinc-300 px-3 py-2 w-full">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-transparent outline-none text-sm w-full"
                            />
                            <Search size={16} className="text-zinc-400" />
                        </div>
                        <nav className="flex flex-col border-t border-zinc-200">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-4 border-b border-zinc-100 text-sm font-bold uppercase tracking-widest"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="py-4 text-sm font-bold uppercase tracking-widest text-zinc-500 text-left">
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="w-full bg-[#f8f9fa] pt-6 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    {children}
                </div>
            </main>

            {/* ET Style Footer */}
            <footer className="w-full bg-zinc-900 border-t-4 border-[#ED1C24] text-white py-12">
                 <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div>
                         <h2 className="text-2xl font-serif font-black tracking-tighter flex items-start leading-none mb-4 text-white">
                            THE AI TIMES <div className="w-2 h-2 bg-[#ED1C24]" />
                         </h2>
                         <p className="text-zinc-400 text-xs leading-relaxed font-serif italic">
                             An AI-powered intelligence feed inspired by premier financial journalism.
                         </p>
                     </div>
                 </div>
            </footer>
        </div>
    )
}