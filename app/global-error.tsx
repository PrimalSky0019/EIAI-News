"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-12 h-1 bg-[#ED1C24] mx-auto mb-6" />
            <h1 className="text-4xl font-serif font-black mb-4">Something went wrong</h1>
            <p className="text-zinc-500 text-sm mb-8 font-serif">
              Our intelligence systems encountered an unexpected error. The incident has been reported.
            </p>
            <button
              onClick={reset}
              className="bg-[#ED1C24] text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
