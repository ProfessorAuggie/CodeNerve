import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

/**
 * Reusable React Error Boundary for CodeNerve.
 * 
 * Catches render-time errors, lifecycle errors, and constructor errors in descendant component trees.
 * Note: React Error Boundaries do NOT catch:
 * - Event handler errors (use standard try/catch inside handlers)
 * - Asynchronous callbacks (e.g. setTimeout, requestAnimationFrame, unhandled Promises)
 * - Server-side rendering errors
 * - Errors thrown within the Error Boundary itself
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('[CodeNerve ErrorBoundary] Caught render error:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;
      const section = this.props.sectionName || 'Application View';

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="min-h-[400px] flex items-center justify-center p-6 w-full"
        >
          <div className="max-w-xl w-full rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                Render Exception &bull; {section}
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                An unexpected component error occurred while rendering this interface. Your saved progress, bookmarks, and local data remain safe.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-lg shadow-brand-500/20 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Try Again</span>
              </button>

              <a
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </a>

              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
            </div>

            {/* Development Mode Diagnostics */}
            {isDev && this.state.error && (
              <div className="pt-4 border-t border-slate-800/80 text-left">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition py-1 font-mono"
                >
                  <span>Developer Diagnostics (Dev Mode Only)</span>
                  {this.state.showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-black/60 border border-rose-900/40 text-[11px] font-mono text-rose-300 overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                    {this.state.error.name}: {this.state.error.message}
                    {this.state.error.stack && (
                      <div className="mt-2 text-slate-500 text-[10px]">
                        {this.state.error.stack}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
