import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, setTheme, toggleTheme } = useUserStore();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {showLabel ? (
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-full">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition ${
              theme === 'light'
                ? 'bg-white text-amber-600 shadow-sm border border-slate-200 dark:border-transparent'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            aria-label="Set light theme"
          >
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition ${
              theme === 'dark'
                ? 'bg-slate-800 text-brand-300 shadow-sm border border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            aria-label="Set dark theme"
          >
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition ${
              theme === 'system'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            aria-label="Set system theme"
          >
            <Monitor className="h-3.5 w-3.5 text-slate-400" />
            <span>Auto</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
          title={`Currently ${theme} mode. Click to toggle ${isDark ? 'light' : 'dark'} mode.`}
          aria-label={`Toggle theme (currently ${theme})`}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </button>
      )}
    </div>
  );
};
