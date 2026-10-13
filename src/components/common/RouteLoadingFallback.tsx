import React from 'react';

export const RouteLoadingFallback: React.FC = () => {
  return (
    <div 
      role="status" 
      aria-label="Loading page content"
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-150"
    >
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
        <div className="absolute h-5 w-5 rounded-full bg-brand-500/10 blur-sm" />
      </div>
      <span className="text-xs font-mono text-slate-400 tracking-wider uppercase animate-pulse">
        Loading CodeNerve...
      </span>
    </div>
  );
};
