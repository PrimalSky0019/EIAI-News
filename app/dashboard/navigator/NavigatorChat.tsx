'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Send, BrainCircuit, Loader2, Database, Globe } from "lucide-react"
import { executeAgentInstruction } from "@/app/actions/agent"
import ReactMarkdown from "react-markdown"

export default function NavigatorChat() {
    const [messages, setMessages] = useState<any[]>([
        { 
            role: 'assistant', 
            content: "Good morning. I'm connected to the live intelligence grid. You can ask me to synthesize existing data, or command me to fetch and ingest new coverage on any topic." 
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const result = await executeAgentInstruction(input)
            
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
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto font-sans">
            
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest border-b-2 border-[#ED1C24] pb-0.5">
                        Autonomous Intelligence Agent
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-serif font-black tracking-tight text-black">News Navigator</h2>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 bg-white border border-zinc-200 shadow-sm p-6 lg:p-8">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            
                            <div className={`w-8 h-8 rounded-none flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                                m.role === 'assistant' ? 'bg-[#ED1C24]' : 'bg-black'
                            }`}>
                                {m.role === 'assistant' ? <BrainCircuit size={16} /> : <User size={16} />}
                            </div>
                            
                            <div className="space-y-2 w-full">
                                {/* Display Agent Tool Actions */}
                                {m.actions && m.actions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {m.actions.includes('fetchLiveNews') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-widest">
                                                <Globe size={10} /> Live Web Search Executed
                                            </span>
                                        )}
                                        {m.actions.includes('ingestToDatabase') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                                                <Database size={10} /> Vectorized & Saved to DB
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className={`p-5 text-sm leading-relaxed whitespace-pre-wrap rounded-none shadow-sm ${
                                    m.role === 'assistant' 
                                        ? 'bg-[#F9F3E9]/40 border border-[#E5E5E5] text-zinc-900 font-serif' 
                                        : 'bg-black text-white font-sans'
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
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="w-8 h-8 rounded-none bg-[#ED1C24] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                                <BrainCircuit size={16} />
                            </div>
                            <div className="p-5 bg-[#F9F3E9]/40 border border-[#E5E5E5] text-zinc-600 font-serif text-sm flex items-center gap-3 shadow-sm">
                                <Loader2 className="animate-spin text-[#ED1C24]" size={16} />
                                Agent is processing instructions...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="bg-white border border-zinc-200 shadow-sm p-2 flex gap-2 flex-shrink-0">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Command the agent: 'Fetch the latest news on AI regulations and summarize it...'"
                    className="flex-1 bg-transparent border-none text-base text-black focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400 font-serif disabled:opacity-50"
                    disabled={loading}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    disabled={loading || !input.trim()}
                    className="bg-[#ED1C24] hover:bg-black rounded-none text-white transition-colors h-12 w-12 disabled:opacity-50 flex-shrink-0"
                >
                    <Send size={18} />
                </Button>
            </form>
        </div>
    )
}
