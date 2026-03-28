import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardShell from "@/components/dashboard/DashboardShell";
import NavigatorChat from "./NavigatorChat";

export default async function NavigatorPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <DashboardShell userEmail={user.email}>
            <NavigatorChat />
        </DashboardShell>
    );
}