import { Button } from "@/components/ui/button";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 p-6">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            My ET <span className="text-blue-500">AI Newsroom</span>
          </h1>
          <p className="text-lg text-zinc-400">
            The future of business news. Personalized, interactive, and powered by AI.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-zinc-900">
              Sign In
            </Button>
          </div>
        </div>
      </main>
  );
}