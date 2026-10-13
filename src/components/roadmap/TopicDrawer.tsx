import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Star, 
  ExternalLink, 
  Sparkles, 
  Search, 
  ShieldAlert, 
  BookOpen, 
  FileText
} from 'lucide-react';
import type { Problem, ProblemStatus } from '../../types';
import { getAlgoNerveUrl } from '../../data/visualizers';

interface TopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  category?: string;
  examScope?: string;
  unitCode?: string;
  prerequisites?: string[];
  visualizerId?: string;
  problems: Problem[];
  problemProgress: Record<string, { status: ProblemStatus; notes?: string }>;
  bookmarks: string[];
  onToggleStatus: (problemId: string) => void;
  onToggleBookmark: (problemId: string) => void;
  onOpenProblemModal: (problem: Problem) => void;
}

export const TopicDrawer: React.FC<TopicDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  category,
  examScope,
  unitCode,
  prerequisites,
  visualizerId,
  problems,
  problemProgress,
  bookmarks,
  onToggleStatus,
  onToggleBookmark,
  onOpenProblemModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Stats calculation
  const totalCount = problems.length;
  const solvedCount = problems.filter((p) => problemProgress[p.id]?.status === 'SOLVED').length;
  const percent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.platform.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter;
      return matchesSearch && matchesDiff;
    });
  }, [problems, searchQuery, difficultyFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-Over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-xl bg-slate-950 border-l border-slate-800/90 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {unitCode && (
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {unitCode}
                    </span>
                  )}
                  {examScope && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {examScope}
                    </span>
                  )}
                  {category && (
                    <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                      {category}
                    </span>
                  )}
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {solvedCount}/{totalCount} Completed ({percent}%)
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {title}
                </h2>
                
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {description}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition shrink-0"
                title="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Action Bar: AlgoNerve Visualizer Button */}
            {visualizerId && (
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-brand-300 font-medium">
                  <Sparkles className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>AlgoNerve Interactive Visualization</span>
                </div>
                <a
                  href={getAlgoNerveUrl(visualizerId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition shrink-0"
                >
                  <span>Launch Visualizer ↗</span>
                </a>
              </div>
            )}
          </div>

          {/* Topic Prerequisites (if available) */}
          {prerequisites && prerequisites.length > 0 && (
            <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/60 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Prerequisites Required:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {prerequisites.map((req, idx) => (
                    <span 
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search topic problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition ${
                    difficultyFilter === diff
                      ? diff === 'easy'
                        ? 'bg-emerald-600 text-white'
                        : diff === 'medium'
                        ? 'bg-amber-600 text-white'
                        : diff === 'hard'
                        ? 'bg-rose-600 text-white'
                        : 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850/80 p-2 sm:p-4">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <BookOpen className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No problems found matching your filter.</p>
              </div>
            ) : (
              filteredProblems.map((problem) => {
                const status = problemProgress[problem.id]?.status || 'NOT_STARTED';
                const isSolved = status === 'SOLVED';
                const isBookmarked = bookmarks.includes(problem.id);

                return (
                  <div
                    key={problem.id}
                    className="p-3 rounded-xl hover:bg-slate-900/60 transition flex items-center justify-between gap-3 group"
                  >
                    {/* Checkbox & Status */}
                    <button
                      onClick={() => onToggleStatus(problem.id)}
                      className="shrink-0 p-1 rounded-lg hover:bg-slate-800 text-slate-500 transition"
                      title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>

                    {/* Problem Info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={problem.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-white hover:text-brand-300 transition flex items-center gap-1.5 break-words"
                          title="Open problem on external platform"
                        >
                          <span className={isSolved ? 'line-through text-slate-400' : ''}>
                            {problem.title}
                          </span>
                          <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-brand-400 shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500 uppercase font-mono font-medium">
                          {problem.platform}
                        </span>
                        <span className="text-slate-700">&bull;</span>
                        <span
                          className={`font-semibold capitalize ${
                            problem.difficulty === 'easy'
                              ? 'text-emerald-400'
                              : problem.difficulty === 'medium'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        {problem.estimatedTime && (
                          <>
                            <span className="text-slate-700">&bull;</span>
                            <span className="text-slate-500">{problem.estimatedTime}m</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions: Notes Modal & Star */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onToggleBookmark(problem.id)}
                        className={`p-1.5 rounded-lg transition ${
                          isBookmarked 
                            ? 'text-amber-400 bg-amber-400/10' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-850'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                      >
                        <Star className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => onOpenProblemModal(problem)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-850 transition"
                        title="View problem details & notes"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-slate-850 bg-slate-950 text-center text-[11px] text-slate-500">
            Progress is automatically saved and synced to your personal tracker.
          </div>
        </div>
      </div>
    </div>
  );
};
