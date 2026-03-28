import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NewsFeed } from '@/components/news/NewsFeed'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardPage() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <DashboardShell userEmail={user.email}>
            <div className="mb-12">
                <h2 className="text-4xl font-serif font-bold mb-2">Morning, {user.email?.split('@')[0]}</h2>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                    Your AI-Matched Intelligence Briefing
                </p>
            </div>

            {/* This is the magic part: We pass a Server Component (NewsFeed)
         into a Client Component (DashboardShell) as 'children'.
         Next.js allows this, and it fixes the Vercel Build Error!
      */}
            <NewsFeed isPersonalized={true} />
        </DashboardShell>
    )
}