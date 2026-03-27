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
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            // Create a brand new user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) alert(error.message);
            else {
                alert("Success! Please check your email to verify your account (if email confirmation is turned on in Supabase), or just sign in!");
                setIsSignUp(false);
            }
        } else {
            // Log in an existing user
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) alert(error.message);
            else router.push('/dashboard'); // Send them to the personalized screen!
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
            <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl">

                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
                        {isSignUp ? 'Create your Newsroom' : 'Welcome back'}
                    </h2>
                    <p className="text-sm text-zinc-400 mt-2">
                        {isSignUp ? 'Sign up to personalize your ET feed' : 'Sign in to your personalized ET Newsroom'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6 mt-8">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300">Email address</Label>
                        <Input
                            id="email" type="email" placeholder="founder@startup.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600" required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-zinc-300">Password</Label>
                        <Input
                            id="password" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-zinc-100" required
                        />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={loading}>
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </Button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>

            </div>
        </div>
    );
}