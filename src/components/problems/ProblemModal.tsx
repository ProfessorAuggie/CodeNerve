import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Hourglass, 
  RotateCcw, 
  FileText, 
  ShieldAlert
} from 'lucide-react';
import type { Problem, ProblemStatus } from '../../types';
import { useUserStore } from '../../store/userStore';
import { getDifficultyColor } from '../../lib/utils';
import { APP_CONFIG, type PlatformKey } from '../../lib/config';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../../data/visualizers';

interface ProblemModalProps {
  problem: Problem | null;
  onClose: () => void;
}

interface ProblemModalInnerProps {
  problem: Problem;
  onClose: () => void;
}

const ProblemModalInner: React.FC<ProblemModalInnerProps> = ({ problem, onClose }) => {
  const { problemProgress, updateProblemStatus, bookmarks, toggleBookmark, updateStudentActivity } = useUserStore();
  const currentProgress = problemProgress[problem.id];
  const currentStatus: ProblemStatus = currentProgress?.status || 'NOT_STARTED';
  const isBookmarked = bookmarks.includes(problem.id);

  useEffect(() => {
    updateStudentActivity(`Practicing: ${problem.title}`);
  }, [problem.id, problem.title, updateStudentActivity]);

  const [notes, setNotes] = useState(currentProgress?.notes || '');
  const [submissionUrl, setSubmissionUrl] = useState(currentProgress?.submissionUrl || '');
  const [savedToast, setSavedToast] = useState(false);

  const platformInfo = APP_CONFIG.platforms[problem.platform as PlatformKey] || {
    name: problem.platform,
    color: '#6366f1',
    icon: '🌐',
  };

  const diffColors = getDifficultyColor(problem.difficulty);

  // Find if there is an AlgoNerve visualizer for this problem's topic tags
  const matchedVisualizer = VISUALIZER_MAPPINGS.find((v) =>
    problem.topicTags.some((tag) => v.algorithmId.includes(tag) || v.id.includes(tag))
  );

  const handleStatusChange = (status: ProblemStatus) => {
    updateProblemStatus(problem.id, status, notes, submissionUrl);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleSaveNotes = () => {
    updateProblemStatus(problem.id, currentStatus, notes, submissionUrl);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}>
                {problem.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span>{platformInfo.icon}</span>
                <span>{platformInfo.name}</span>
              </span>
              {problem.estimatedTime && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>~{problem.estimatedTime} mins</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {problem.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleBookmark(problem.id)}
              className={`p-2 rounded-xl border transition min-h-[38px] min-w-[38px] flex items-center justify-center ${
                isBookmarked 
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-500' 
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
              aria-label="Bookmark"
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2-Column Responsive Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Column: Pedagogical Details & Visualizer */}
            <div className="md:col-span-7 space-y-4">
              {/* Description / Learning Purpose */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Learning Objective</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  {problem.description}
                </p>
              </div>

              {/* Topic Tags */}
              {problem.topicTags.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Topics & Concepts</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.topicTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Visualizer CTA (AlgoNerve) */}
              {matchedVisualizer && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-50 via-indigo-50/50 to-slate-50 dark:from-brand-950/60 dark:via-indigo-950/40 dark:to-slate-900 border border-brand-200 dark:border-brand-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-300 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{matchedVisualizer.label}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{matchedVisualizer.description}</p>
                    </div>
                  </div>
                  <a
                    href={getAlgoNerveUrl(matchedVisualizer.algorithmId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition shrink-0"
                  >
                    <span>Visualize</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: Practice Action, Status & Notes */}
            <div className="md:col-span-5 space-y-4">
              {/* External Solve CTA */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <ShieldAlert className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    Solve on <strong className="text-slate-900 dark:text-white">{platformInfo.name}</strong>, then record status below:
                  </div>
                </div>
                <a
                  href={problem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition group min-h-[44px]"
                >
                  <span>Solve on {platformInfo.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Progress Tracker Selector */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">My Progress Status</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleStatusChange('NOT_STARTED')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition min-h-[40px] ${
                      currentStatus === 'NOT_STARTED'
                        ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm font-semibold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span>Not Started</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('ATTEMPTED')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition min-h-[40px] ${
                      currentStatus === 'ATTEMPTED'
                        ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 shadow-sm font-semibold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Hourglass className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span>Attempted</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('SOLVED')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition min-h-[40px] ${
                      currentStatus === 'SOLVED'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 shadow-sm font-semibold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Solved</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('REVISION_NEEDED')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition min-h-[40px] ${
                      currentStatus === 'REVISION_NEEDED'
                        ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/50 text-purple-800 dark:text-purple-300 shadow-sm font-semibold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <RotateCcw className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    <span>Revise</span>
                  </button>
                </div>
              </div>

              {/* Personal Solution Notes & Submission Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <FileText className="h-3 w-3 text-slate-400" />
                    <span>Solution Notes</span>
                  </h4>
                  {savedToast && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">Saved!</span>
                  )}
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record intuition, edge cases, time/space complexity..."
                  rows={2}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                />

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="Solution Link (GitHub / Submission URL)"
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                  />

                  <button
                    onClick={handleSaveNotes}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProblemModal: React.FC<ProblemModalProps> = ({ problem, onClose }) => {
  if (!problem) return null;
  return <ProblemModalInner key={problem.id} problem={problem} onClose={onClose} />;
};
