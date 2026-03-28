// components/dashboard/BriefingNavigator.tsx
export function BriefingNavigator({ topic }: { topic: string }) {
    return (
        <div className="border-4 border-black p-8 bg-white mt-8">
            <h3 className="text-2xl font-serif font-black mb-4 uppercase">News Navigator: {topic}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="prose prose-sm font-medium text-zinc-600">
                    <p className="font-bold text-black mb-2 italic">AI Synthesis of 14 ET Reports:</p>
                    {/* Gemini-generated content goes here */}
                    The geopolitical shift has caused a 4% spike in Brent Crude...
                </div>
                <div className="bg-zinc-50 p-6 border-2 border-zinc-100">
                    <p className="text-[10px] font-black uppercase text-primary mb-4 tracking-widest">Follow-up Questions</p>
                    <ul className="space-y-3 text-xs font-bold underline decoration-zinc-300">
                        <li>How does this affect Indian IT stocks?</li>
                        <li>What is the impact on Gold prices in 2026?</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}