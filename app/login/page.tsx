'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Newspaper, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Perform Auth Action
            const { data, error } = isSignUp
                ? await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: { full_name: email.split('@')[0] }
                    }
                })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            // 2. Success Logic
            if (data.user) {
                console.log("Auth Success:", data.user.email);

                if (isSignUp && data.session === null) {
                    // This handles the "Confirm Email" being ON in Supabase
                    toast.success("Verification email sent! Check your inbox.");
                } else {
                    toast.success(isSignUp ? "Account created!" : "Welcome back!");

                    // Use router.refresh() to ensure the server knows we are logged in
                    router.refresh();

                    // Delay slightly to allow cookies to settle
                    setTimeout(() => {
                        router.push(isSignUp ? '/onboarding' : '/dashboard');
                    }, 500);
                }
            }
        } catch (error: any) {
            console.error("AUTH ERROR:", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] flex flex-col items-center justify-center p-6">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-serif font-black tracking-tighter text-[#B31921]">
                    THE AI TIMES
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-2">
                    Member Access Portal
                </p>
            </div>

            <div className="w-full max-w-md bg-white border-t-8 border-[#B31921] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold tracking-tight">
                            {isSignUp ? 'Create Your Newsroom' : 'Welcome Back'}
                        </h2>
                        <div className="flex justify-center gap-4 mt-4">
                            <AuthFeature icon={<Zap size={12}/>} text="AI Personalization" />
                            <AuthFeature icon={<ShieldCheck size={12}/>} text="Verified Data" />
                        </div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Business Email</Label>
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-none border-zinc-200 focus:border-[#B31921] focus:ring-0 bg-zinc-50/50"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secure Password</Label>
                            <Input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-none border-zinc-200 focus:border-[#B31921] focus:ring-0 bg-zinc-50/50"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#B31921] hover:bg-black text-white rounded-none font-bold py-7 tracking-[0.2em] transition-all disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={18} /> SYNCING...
                                </span>
                            ) : (
                                isSignUp ? 'GENERATE MY PROFILE' : 'ENTER THE NEWSROOM'
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[10px] font-bold text-zinc-400 hover:text-[#B31921] uppercase tracking-widest transition-colors"
                        >
                            {isSignUp ? 'Already a member? Sign In' : "New to AI Times? Create an account"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                <Newspaper size={14} />
                <span>Secure Press Access — Amaravati 2026</span>
            </div>
        </div>
    );
}

function AuthFeature({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter text-zinc-400">
            <span className="text-[#B31921]">{icon}</span>
            {text}
        </div>
    );
}