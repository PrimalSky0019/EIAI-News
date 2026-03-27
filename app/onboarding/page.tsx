'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { savePreferences } from '@/app/actions/user';

const TOPICS = [
    "Startups & VC", "Stock Markets", "Artificial Intelligence",
    "Crypto & Web3", "Personal Finance", "Real Estate",
    "Global Economy", "Green Energy", "Corporate Mergers"
];

export default function OnboardingPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Get the logged-in user's ID when the page loads
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
            else setUserId(session.user.id);
        };
        getUser();
    }, [router]);

    const toggleTopic = (topic: string) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            if (selectedTopics.length < 5) setSelectedTopics([...selectedTopics, topic]);
        }
    };

    const handleSave = async () => {
        if (!userId || selectedTopics.length === 0) return;
        setLoading(true);

        // Call our Server Action to vectorize and save!
        const result = await savePreferences(userId, selectedTopics);

        if (result.success) {
            router.push('/dashboard'); // Teleport them to their new personalized feed!
        } else {
            alert("Error saving preferences. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-50">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Build Your AI Profile</h1>
                    <p className="text-zinc-400">Select up to 5 topics. Our AI will map your selections into a mathematical vector to find perfect news matches.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {TOPICS.map((topic) => (
                        <button
                            key={topic}
                            onClick={() => toggleTopic(topic)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border 
                ${selectedTopics.includes(topic)
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'}`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>

                <div className="pt-8 flex justify-center">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={selectedTopics.length === 0 || loading}
                        className="w-full sm:w-auto px-12 bg-white text-black hover:bg-zinc-200 rounded-full"
                    >
                        {loading ? 'Generating AI Vector...' : 'Generate My Newsroom'}
                    </Button>
                </div>
            </div>
        </div>
    );
}