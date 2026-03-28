'use client'

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { updatePersonalizedFeed } from "@/app/actions/user";
import { createClient } from '@/lib/supabase/client';
import { BrainCircuit, Check, Sparkles, Newspaper } from "lucide-react";

const INTEREST_TOPICS = [
    "Startups & VC", "Stock Markets", "Generative AI",
    "Crypto & Web3", "Real Estate", "Electric Vehicles",
    "Global Economy", "Green Energy", "Corporate Mergers",
    "Consumer Tech", "Banking & FinTech", "Retail Trends"
];

export default function OnboardingPage() {
    const [selected, setSelected] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState("Selecting Interests...");
    const router = useRouter();
    const supabase = createClient();

    // Ensure user is actually logged in before they can onboard
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
        };
        checkUser();
    }, [router]);

    const toggleTopic = (topic: string) => {
        if (selected.includes(topic)) {
            setSelected(selected.filter(t => t !== topic));
        } else {
            if (selected.length < 5) setSelected([...selected, topic]);
        }
    };

    const handleStartAI = () => {
        if (selected.length === 0) return;
        
        startTransition(async () => {
            setStatus("Processing your interests with Gemini AI...");

            try {
                // Call our Server Action to generate the AI Vector
                const result = await updatePersonalizedFeed(selected);

                if (result.success) {
                    setStatus("AI Profile Generated. Redirecting to your newsroom...");
                    setTimeout(() => router.push('/dashboard'), 1500);
                } else {
                    alert("Error creating profile: " + result.error);
                    setStatus("Selecting Interests...");
                }
            } catch (err) {
                console.error(err);
                setStatus("Selecting Interests...");
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] flex flex-col items-center justify-center p-6">

            {/* HEADER SECTION */}
            <div className="max-w-2xl w-full text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-primary/5 rounded-full border border-primary/20">
                        <BrainCircuit className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4">
                    Vectorize Your <span className="text-primary">ET</span> Feed
                </h1>
                <p className="text-zinc-500 font-medium text-sm max-w-lg mx-auto leading-relaxed">
                    Select up to 5 topics. Our AI will map these into a 768-dimension vector to ensure your 2026 newsroom is fundamentally unique to your professional goals.
                </p>
            </div>

            {/* TOPIC GRID */}
            <div className="max-w-3xl w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {INTEREST_TOPICS.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        disabled={isPending}
                        className={`group relative p-4 border-2 transition-all duration-300 text-left h-24 flex flex-col justify-between
              ${selected.includes(topic)
                            ? 'border-primary bg-primary/5'
                            : 'border-zinc-100 bg-white hover:border-zinc-300'} ${isPending ? 'opacity-50' : ''}`}
                    >
            <span className={`text-[10px] font-black uppercase tracking-widest 
              ${selected.includes(topic) ? 'text-primary' : 'text-zinc-400'}`}>
              Topic
            </span>
                        <span className="font-bold text-sm leading-tight">{topic}</span>
                        {selected.includes(topic) && (
                            <Check className="absolute top-3 right-3 w-4 h-4 text-primary" />
                        )}
                    </button>
                ))}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="max-w-2xl w-full text-center">
                <Button
                    size="lg"
                    onClick={handleStartAI}
                    disabled={selected.length === 0 || isPending}
                    className="w-full sm:w-80 h-16 bg-primary hover:bg-black text-white rounded-none font-bold text-lg tracking-widest shadow-xl shadow-primary/20"
                >
                    {isPending ? (
                        <span className="flex items-center gap-2 animate-pulse">
               <Sparkles size={20} /> {status}
            </span>
                    ) : (
                        'GENERATE MY NEWSROOM'
                    )}
                </Button>
                <p className="mt-6 text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                    Processing via Google Gemini 1.5 & Supabase Vector
                </p>
            </div>

            {/* FOOTER BADGE */}
            <div className="mt-16 flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-50">
                <Newspaper size={14} />
                <span>Press Credentials Pending Selection</span>
            </div>
        </div>
    );
}