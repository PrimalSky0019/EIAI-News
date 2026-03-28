'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Send, BrainCircuit, X, Terminal,
    Globe, Database, Search, Sparkles, Layers, User, Zap, TrendingUp
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
    { text: "Summarize today's top stories", icon: TrendingUp },
    { text: "Fetch the latest AI news", icon: Globe },
    { text: "What are the market trends?", icon: Zap },
    { text: "Find articles about startups", icon: Search },
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

    if (pathname === '/dashboard/navigator') return null

    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (isExpanded) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isExpanded])

    const handleClear = () => {
        setMessages([])
    }

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
                    className="fixed inset-0 bg-black/20 backdrop-blur-[3px] z-[60] transition-opacity"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Floating Container */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-end ${
                isExpanded ? 'w-[750px] max-w-[95vw] h-[550px] max-h-[80vh]' : 'w-[550px] max-w-[90vw] h-[52px]'
            }`}>

                {/* Agent Output Window */}
                <div className={`bg-white border-x-2 border-t-2 border-zinc-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom rounded-t-lg ${
                    isExpanded ? 'h-full mb-0 opacity-100 scale-100' : 'h-0 mb-0 opacity-0 scale-95 pointer-events-none'
                }`}>

                    {/* Header */}
                    <div className="bg-zinc-900 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#ED1C24]/20 flex items-center justify-center">
                                <BrainCircuit size={14} className="text-[#ED1C24]" />
                            </div>
                            <div>
                                <span className="font-bold text-sm tracking-wide">Intelligence Agent</span>
                                <span className="text-[9px] text-zinc-500 ml-2 font-mono hidden sm:inline">Ctrl+K</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <button onClick={handleClear} className="text-[9px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest font-bold transition-colors px-2 py-1 hover:bg-zinc-800 rounded">
                                    Clear
                                </button>
                            )}
                            <button onClick={() => setIsExpanded(false)} className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#FAFAFA]">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center gap-6">
                                <div className="text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
                                        <BrainCircuit size={24} className="text-zinc-300" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-800">What can I help you find?</p>
                                        <p className="text-xs text-zinc-400 mt-1">Ask me anything about the news, markets, or AI trends.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
                                    {QUICK_PROMPTS.map((prompt) => {
                                        const Icon = prompt.icon
                                        return (
                                            <button
                                                key={prompt.text}
                                                onClick={() => handleSend(undefined, prompt.text)}
                                                className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold text-left border border-zinc-200 bg-white text-zinc-600 hover:border-[#ED1C24]/50 hover:text-[#ED1C24] hover:bg-red-50/30 rounded-lg transition-all duration-200 cursor-pointer group"
                                            >
                                                <Icon size={13} className="text-zinc-400 group-hover:text-[#ED1C24] transition-colors flex-shrink-0" />
                                                <span className="leading-tight">{prompt.text}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up-fade`}>
                                <div className={`flex flex-col gap-1.5 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>

                                    {/* Tool Badges */}
                                    {m.actions && m.actions.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {[...new Set(m.actions)].map((action) => {
                                                const badge = TOOL_BADGES[action]
                                                if (!badge) return null
                                                const Icon = badge.icon
                                                return (
                                                    <span key={action} className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${badge.color}`}>
                                                        <Icon size={9} /> {badge.label}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`px-4 py-3 text-sm leading-relaxed rounded-lg ${
                                        m.role === 'assistant'
                                            ? 'bg-white border border-zinc-200 text-zinc-800 shadow-sm'
                                            : 'bg-zinc-900 text-white'
                                    }`}>
                                        {m.role === 'assistant' ? (
                                            <div className="prose prose-sm prose-p:leading-relaxed prose-headings:font-bold prose-a:text-[#ED1C24] prose-strong:text-zinc-900 max-w-none">
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
                            <div className="flex justify-start animate-slide-up-fade">
                                <div className="w-full max-w-[350px] space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-[#ED1C24]/10 flex items-center justify-center">
                                            <BrainCircuit size={11} className="text-[#ED1C24] animate-pulse" />
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Scanning intelligence...</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ED1C24] to-transparent w-1/3 animate-shimmer-scan rounded-full" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* The Persistent Command Bar */}
                <form
                    onSubmit={handleSend}
                    className={`bg-white border-2 border-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex items-center flex-shrink-0 transition-all ${
                        isExpanded ? 'border-t-0 shadow-lg rounded-b-lg' : 'rounded-lg'
                    }`}
                >
                    <div className="flex-1 relative flex items-center">
                        <Terminal className="absolute left-4 text-zinc-400" size={15} />
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            placeholder="Ask the Intelligence Agent..."
                            className="w-full bg-transparent border-none text-black focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400 pl-11 h-12 rounded-none text-sm"
                            disabled={loading}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-[#ED1C24] hover:bg-zinc-900 rounded-none text-white transition-colors h-12 w-14 disabled:opacity-30 flex-shrink-0"
                    >
                        <Send size={16} />
                    </Button>
                </form>

            </div>
        </>
    )
}
