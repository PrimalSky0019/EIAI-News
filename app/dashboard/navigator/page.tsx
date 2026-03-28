'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { User, Send, BrainCircuit, AlertCircle } from "lucide-react"
import { chatWithNavigator } from "@/app/actions/chat"

export default function NewsNavigator() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Good morning. I've analyzed today's coverage across our intelligence database. What business story, market trend, or policy shift can I help you deconstruct?" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const result = await chatWithNavigator(input, messages)
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: result.reply
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
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
            
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest border-b-2 border-[#ED1C24] pb-0.5">
                        Interactive Briefings · Powered by Gemini
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-serif font-black tracking-tight text-black">News Navigator</h2>
                    <span className="text-[9px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 uppercase tracking-widest">
                        ● Live
                    </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Ask questions about any market trend, company, or global event. Gemini analyzes your article database in real-time.</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 bg-white border border-zinc-200 shadow-sm p-6">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-none flex items-center justify-center flex-shrink-0 text-white ${m.role === 'assistant' ? 'bg-[#ED1C24]' : 'bg-black'}`}>
                                {m.role === 'assistant' ? <BrainCircuit size={14} /> : <User size={14} />}
                            </div>
                            <div className={`p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                                m.role === 'assistant' 
                                    ? 'bg-zinc-50 border border-zinc-200 text-zinc-800 font-serif' 
                                    : 'bg-black text-white'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-3 text-zinc-400 text-xs py-2">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse [animation-delay:150ms]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse [animation-delay:300ms]" />
                        </div>
                        Gemini is synthesizing intelligence...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border border-zinc-200 shadow-sm p-3 flex gap-2">
                <input
                    placeholder="Ask about a market trend, a startup, or a company..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={loading}
                    className="flex-1 bg-transparent border-none text-sm text-black focus:outline-none placeholder:text-zinc-400 font-serif disabled:opacity-50"
                />
                <Button 
                    onClick={handleSend} 
                    size="icon" 
                    disabled={loading || !input.trim()}
                    className="bg-[#ED1C24] hover:bg-black rounded-none text-white transition-colors h-10 w-10 disabled:opacity-50"
                >
                    <Send size={16} />
                </Button>
            </div>
        </div>
    )
}