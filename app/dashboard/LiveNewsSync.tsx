'use client'

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { syncLatestNews } from '@/app/actions/sync';

export default function LiveNewsSync() {
    const hasSynced = useRef(false);
    const router = useRouter();

    useEffect(() => {
        console.log('[LiveNewsSync] useEffect triggered. hasSynced:', hasSynced.current);
        // Prevent double-firing in React strict mode
        if (hasSynced.current) return;
        hasSynced.current = true;

        async function performSync() {
            console.log('[LiveNewsSync] Calling performSync()');
            try {
                // Call the server action to sync live news and cleanup old ones
                const result = await syncLatestNews();
                console.log(`[News Sync] Run completed. Added: ${result.added}, Cleaned: ${result.removed}`);
                if (result.added > 0 || result.removed > 0) {
                    console.log('[News Sync] Triggering page refresh for new data.');
                    router.refresh();
                }
            } catch (err) {
                console.error('[News Sync] Failed to sync latest news', err);
            }
        }

        performSync();
    }, []);

    // This is a headless component
    return null;
}
