'use client';

import React, { useEffect } from 'react';
import { useNavigate } from '../../lib/router';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldAlert, 
  CheckCircle2, 
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const AuthPromptModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalAction, closeAuthModal } = useUserStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Explorer Mode &bull; Sign-in Required</span>
          </div>

          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to Save Your Progress
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            You can freely explore all roadmaps, code solutions, algorithm visualizers, and university syllabus in Explorer Mode. However, to <span className="font-semibold text-slate-900 dark:text-white underline decoration-amber-500/60">{authModalAction || 'perform interactive tasks'}</span>, you need an active student profile.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Track Solved DSA Problems</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Maintain your solved status, execution notes, and LeetCode / GFG submission URLs across devices.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Live Faculty Cohort Sync</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically verify your lab assignments and semester evaluations directly in the Admin portal.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Personal Revision Bookmarks</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Save complex algorithms, quizzes, and practical code snippets for rapid midterm revision.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                closeAuthModal();
                navigate('/login');
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Student Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeAuthModal();
                navigate('/login?mode=register');
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Free Account</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
            >
              Continue exploring without signing in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
