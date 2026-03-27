'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) alert(error.message);
        else router.push(isSignUp ? '/onboarding' : '/dashboard');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border-t-8 border-[#B31921] shadow-2xl p-10">

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-serif font-black tracking-tighter text-[#1A1A1A]">
                        {isSignUp ? 'JOIN THE NEWSROOM' : 'MEMBER ACCESS'}
                    </h2>
                    <div className="h-px bg-zinc-200 w-full my-4" />
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                        {isSignUp
                            ? 'Create your unique AI profile to vectorize your business feed'
                            : 'Sign in to access your personalized 2026 intelligence suite'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider">Business Email</Label>
                        <Input
                            type="email" placeholder="name@company.com" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-none border-zinc-300 focus:border-[#B31921] focus:ring-0" required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider">Security Key</Label>
                        <Input
                            type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-none border-zinc-300 focus:border-[#B31921] focus:ring-0" required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#B31921] hover:bg-black text-white rounded-none font-bold py-6 tracking-widest"
                        disabled={loading}
                    >
                        {loading ? 'PROCESSING...' : (isSignUp ? 'GENERATE PROFILE' : 'ENTER NEWSROOM')}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-[#B31921] uppercase tracking-widest border-b border-transparent hover:border-[#B31921] transition-all"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "New to the future? Create an account"}
                    </button>
                </div>
            </div>

            <p className="mt-12 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                The AI Times — Amaravati Edition — March 2026
            </p>
        </div>
    );
}