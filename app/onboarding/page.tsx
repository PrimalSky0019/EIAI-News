"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updatePersonalizedFeed } from "@/app/actions/user";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

const TOPICS = [
  "Artificial Intelligence", "Global Markets", "Venture Capital",
  "Cybersecurity", "Energy Transition", "Biotechnology",
  "Geopolitics", "Supply Chain", "Fintech"
];

export default function OnboardingPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleComplete = () => {
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one interest.");
      return;
    }

    startTransition(async () => {
      const result = await updatePersonalizedFeed(selectedTopics);

      if (result.success) {
        toast.success("AI Profile generated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-black tracking-tight mb-4">
            Calibrate Your Intelligence Feed
          </h1>
          <p className="text-zinc-500">
            Select the sectors that matter to your strategic goals. Our AI will vectorize these concepts to curate your daily briefing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                disabled={isPending}
                className={`px-6 py-3 rounded-none border text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${isSelected
                    ? "bg-[#B31921] border-[#B31921] text-white"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-black hover:text-black"
                  }`}
              >
                {topic} {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleComplete}
            disabled={isPending || selectedTopics.length === 0}
            className="bg-black hover:bg-[#B31921] text-white rounded-none font-bold py-7 px-16 tracking-[0.2em] transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> VECTORIZING PROFILE...
              </span>
            ) : (
              "INITIALIZE DASHBOARD"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}