'use client'

import { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardShell({
                                           children,
                                           userEmail
                                       }: {
    children: React.ReactNode,
    userEmail: string | undefined
}) {
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* Sidebar / Header logic goes here */}
            <header className="border-b-4 border-black bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <h1 className="text-2xl font-serif font-black tracking-tighter text-[#B31921]">
                        MY <span className="text-black text-3xl italic">ET</span>
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] font-black uppercase text-zinc-400">Subscriber</p>
                            <p className="text-xs font-bold">{userEmail}</p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="hover:text-[#B31921] font-bold text-xs uppercase"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                {children}
            </main>
        </div>
    )
}