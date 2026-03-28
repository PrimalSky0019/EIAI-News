'use client'

import { useState } from 'react'
import { Menu, LogOut, User, Newspaper, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DashboardShell({
                                           children,
                                           userEmail
                                       }: {
    children: React.ReactNode,
    userEmail: string | undefined
}) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r-4 border-black bg-white sticky top-0 h-screen z-40">
                <div className="p-6 h-20 border-b border-zinc-100 flex items-center">
                    <h1 className="text-2xl font-serif font-black tracking-tighter text-primary">
                        MY <span className="text-black text-3xl italic">ET</span>
                    </h1>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <NavItem href="/dashboard" icon={<Newspaper size={18} />} label="Daily Briefing" />
                    <NavItem href="/dashboard/navigator" icon={<Compass size={18} />} label="Market Navigator" />
                    <NavItem href="/dashboard/profile" icon={<User size={18} />} label="My Profile" />
                </nav>

                <div className="p-6 border-t border-zinc-100">
                    <div className="mb-4">
                        <p className="text-[10px] font-black uppercase text-zinc-400">Subscriber</p>
                        <p className="text-xs font-bold truncate text-zinc-700">{userEmail}</p>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start hover:text-primary font-bold text-xs uppercase px-0">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden border-b-4 border-black bg-white sticky top-0 z-50 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-serif font-black tracking-tighter text-primary">
                    MY <span className="text-black text-3xl italic">ET</span>
                </h1>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </header>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Link href={href} className={`flex items-center gap-3 p-3 rounded-none font-bold text-sm transition-all ${active ? 'bg-primary text-white shadow-md' : 'text-zinc-500 hover:text-black hover:bg-zinc-100'}`}>
            {icon} {label}
        </Link>
    );
}