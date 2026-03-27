'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, Send, Sparkles } from "lucide-react"

export default function NewsNavigator() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I've analyzed today's ET coverage. What business story can I help you deconstruct?" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        // Soon we will connect this to a Gemini Server Action!
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm analyzing the latest ET articles on that topic. According to recent reports, the impact on your portfolio could be significant due to shifting interest rates..."
            }])
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">News Navigator</h1>
                    <p className="text-zinc-400 text-sm">Interactive Intelligence Briefings</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'assistant' ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                                {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-zinc-900 border border-zinc-800 text-zinc-100' : 'bg-blue-600 text-white'}`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && <div className="text-zinc-500 text-xs animate-pulse">Gemini is synthesizing ET data...</div>}
            </div>

            {/* Input Area */}
            <Card className="bg-zinc-900 border-zinc-800 p-2 rounded-2xl shadow-2xl">
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask about a market trend, a startup, or a company..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="bg-transparent border-none text-zinc-100 focus-visible:ring-0 placeholder:text-zinc-600"
                    />
                    <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                        <Send size={18} />
                    </Button>
                </div>
            </Card>
        </div>
    )
}

import { BrainCircuit } from 'lucide-react'