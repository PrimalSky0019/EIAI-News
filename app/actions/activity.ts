'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function logArticleView(articleId: string) {
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

    if (!user) return { success: false, error: "Unauthorized" }

    // Insert the record
    const { error } = await supabase
        .from('user_activity')
        .insert({
            user_id: user.id,
            article_id: articleId,
            action_type: 'read'
        })

    if (error) {
        console.error("Failed to log activity:", error)
        return { success: false, error: error.message }
    }

    return { success: true }
}