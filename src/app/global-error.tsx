'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 px-4 text-center font-sans">
        <h2 className="text-3xl font-serif font-bold text-[#020618] mb-2">Application Error</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md">
          {error?.message || 'An unexpected runtime error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
