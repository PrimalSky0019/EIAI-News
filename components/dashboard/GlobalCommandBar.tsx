'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Send, BrainCircuit, X, Loader2, Terminal,
    Globe, Database, Search, Sparkles, Layers, User
} from "lucide-react"
import { executeAgentInstruction } from "@/app/actions/agent"
import ReactMarkdown from "react-markdown"

// Badge config for each tool the agent can call
const TOOL_BADGES: Record<string, { label: string; icon: typeof Search; color: string }> = {
    searchNews: { label: 'Keyword Search', icon: Search, color: 'bg-violet-50 text-violet-700 border-violet-200' },
    getNewsByCategory: { label: 'Category Filter', icon: Layers, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    semanticSearch: { label: 'Semantic Search', icon: Sparkles, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    getUserPreferences: { label: 'User Profile', icon: User, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    fetchLiveNews: { label: 'Live Web Search', icon: Globe, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    ingestToDatabase: { label: 'Saved to Vector DB', icon: Database, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

const QUICK_PROMPTS = [
    "Summarize today's top stories",
    "Fetch the latest AI news",
    "What are the market trends?",
    "Find articles about startups",
]

interface AgentMessage {
    role: 'user' | 'assistant'
    content: string
    actions?: string[]
}

export default function GlobalCommandBar() {
    const pathname = usePathname()
    const [isExpanded, setIsExpanded] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<AgentMessage[]>([])
    const chatEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Hide on the dedicated Navigator page to avoid duplicate chat UIs
    if (pathname === '/dashboard/navigator') return null

    // Ctrl+K / Cmd+K to focus the command bar, Escape to minimize
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsExpanded(true)
                setTimeout(() => inputRef.current?.focus(), 100)
            }
            if (e.key === 'Escape' && isExpanded) {
                setIsExpanded(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isExpanded])

    // Auto-scroll to latest message
    useEffect(() => {
        if (isExpanded) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isExpanded])

    const handleSend = async (e?: React.FormEvent, promptOverride?: string) => {
        if (e) e.preventDefault()
        const message = promptOverride || input
        if (!message.trim() || loading) return

        if (!isExpanded) setIsExpanded(true)

        setMessages(prev => [...prev, { role: 'user', content: message }])
        setInput('')
        setLoading(true)

        try {
            const result = await executeAgentInstruction(message)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: result.briefing || result.error || 'No response from agent.',
                actions: result.actionsTaken || []
            }])
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection to intelligence service interrupted. Please try again.'
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Backdrop overlay when expanded */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[60] transition-opacity animate-in fade-in duration-300"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Floating Container */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-end ${
                isExpanded ? 'w-[800px] max-w-[95vw] h-[600px] max-h-[85vh]' : 'w-[600px] max-w-[90vw] h-[52px]'
            }`}>

                {/* Agent Output Window (Expands Upward) */}
                <div className={`bg-[#FDFDFD] border-x-4 border-t-4 border-black shadow-2xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom ${
                    isExpanded ? 'h-full mb-0 opacity-100 scale-100' : 'h-0 mb-0 opacity-0 scale-95 pointer-events-none'
                }`}>

                    {/* Header */}
                    <div className="bg-black text-white p-3 flex justify-between items-center flex-shrink-0 border-b-4 border-[#ED1C24]">
                        <div className="flex items-center gap-2">
                            <BrainCircuit size={16} className="text-[#ED1C24]" />
                            <span className="font-serif font-black text-sm tracking-widest uppercase">Intelligence Agent</span>
                            <span className="text-[9px] text-zinc-500 ml-2 font-mono hidden sm:inline">Ctrl+K</span>
                        </div>
                        <button onClick={() => setIsExpanded(false)} className="text-zinc-400 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                                <div className="text-center space-y-2">
                                    <BrainCircuit size={40} className="mx-auto text-zinc-200" />
                                    <p className="font-serif text-sm italic text-zinc-400">Awaiting your instruction...</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                                    {QUICK_PROMPTS.map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => handleSend(undefined, prompt)}
                                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-zinc-200 bg-white text-zinc-500 hover:border-[#ED1C24] hover:text-[#ED1C24] transition-colors cursor-pointer"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col gap-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>

                                    {/* Tool Badges */}
                                    {m.actions && m.actions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {[...new Set(m.actions)].map((action) => {
                                                const badge = TOOL_BADGES[action]
                                                if (!badge) return null
                                                const Icon = badge.icon
                                                return (
                                                    <span key={action} className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${badge.color}`}>
                                                        <Icon size={9} /> {badge.label}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`p-4 text-sm leading-relaxed border shadow-sm ${
                                        m.role === 'assistant'
                                            ? 'bg-[#F9F3E9]/40 border-[#E5E5E5] text-zinc-900 font-serif'
                                            : 'bg-black text-white font-sans border-black'
                                    }`}>
                                        {m.role === 'assistant' ? (
                                            <div className="prose prose-p:leading-relaxed prose-headings:font-serif prose-a:text-[#ED1C24] max-w-none text-sm">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            m.content
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="p-4 bg-[#F9F3E9]/40 border border-[#E5E5E5] text-zinc-600 font-serif text-sm flex items-center gap-3 shadow-sm">
                                    <Loader2 className="animate-spin text-[#ED1C24]" size={16} />
                                    Synthesizing intelligence...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* The Persistent Command Bar */}
                <form
                    onSubmit={handleSend}
                    className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-2 flex-shrink-0 transition-all ${
                        isExpanded ? 'border-t-0 shadow-2xl' : ''
                    }`}
                >
                    <div className="flex-1 relative flex items-center">
                        <Terminal className="absolute left-4 text-zinc-400" size={16} />
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            placeholder="Command the Agent..."
                            className="w-full bg-transparent border-none text-black focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-500 font-serif pl-12 h-12 rounded-none"
                            disabled={loading}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-[#ED1C24] hover:bg-black rounded-none text-white transition-colors h-12 w-16 disabled:opacity-50 flex-shrink-0"
                    >
                        <Send size={18} />
                    </Button>
                </form>

            </div>
        </>
    )
}
