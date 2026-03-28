'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Search, Sparkles, LayoutDashboard, Zap, Newspaper, Settings } from "lucide-react"

export default function Sidebar() {
    const [query, setQuery] = useState('')
    const [aiResponse, setAiResponse] = useState('')

    const handleAISearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setAiResponse("Gemini is analyzing the news database...")
        // This would call your /api/ai-search route
        const res = await fetch('/api/ai-search', {
            method: 'POST',
            body: JSON.stringify({ query })
        })
        const data = await res.json()
        setAiResponse(data.answer)
    }

    return (
        <div className="w-80 border-r-4 border-black h-screen sticky top-0 bg-[#FDFDFD] p-6 flex flex-col">
            <div className="mb-10">
                <h1 className="text-3xl font-serif font-black tracking-tighter text-primary">ET<span className="text-black italic">AI</span></h1>
            </div>

            <nav className="flex-1 space-y-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Navigation</p>
                    <NavItem icon={<LayoutDashboard size={16}/>} label="Intelligence Hub" active />
                    <NavItem icon={<Newspaper size={16}/>} label="Personalized Feed" />
                    <NavItem icon={<Zap size={16}/>} label="Market Signals" />
                </div>

                {/* AI SEARCH BOX */}
                <div className="pt-6 border-t border-zinc-200">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-3 flex items-center gap-1">
                        <Sparkles size={10} /> Ask Gemini Newsroom
                    </p>
                    <form onSubmit={handleAISearch} className="relative">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search news trends..."
                            className="rounded-none border-2 border-black focus:ring-0 text-xs py-5 pl-10"
                        />
                        <Search className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                    </form>

                    {aiResponse && (
                        <div className="mt-4 p-4 bg-zinc-100 border-l-4 border-black animate-in fade-in slide-in-from-top-2">
                            <p className="text-[11px] font-medium leading-relaxed italic text-zinc-700">"{aiResponse}"</p>
                        </div>
                    )}
                </div>
            </nav>

            <div className="pt-6 border-t border-zinc-200">
                <NavItem icon={<Settings size={16}/>} label="Account Settings" />
            </div>
        </div>
    )
}

function NavItem({ icon, label, active = false }: { 
    icon: React.ReactNode; 
    label: string; 
    active?: boolean;
}) {
    return (
        <div className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${active ? 'bg-black text-white' : 'hover:bg-zinc-100 font-bold'}`}>
            {icon}
            <span className="text-xs uppercase tracking-tight">{label}</span>
        </div>
    )
}