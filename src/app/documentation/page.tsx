'use client';

import React, { useEffect } from 'react';

export default function DocumentationPage() {
  const targetUrl = 'https://algonerve.vercel.app';

  useEffect(() => {
    window.location.href = targetUrl;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      <h2 className="text-lg font-bold text-white">Opening Documentation...</h2>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition mt-2"
      >
        Open in New Tab Now ↗
      </a>
    </div>
  );
}
