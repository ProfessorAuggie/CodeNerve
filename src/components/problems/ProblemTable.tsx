import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Hourglass, 
  RotateCcw, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Problem, ProblemStatus } from '../../types';
import { useUserStore } from '../../store/userStore';
import { getDifficultyColor } from '../../lib/utils';
import { APP_CONFIG, type PlatformKey } from '../../lib/config';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../../data/visualizers';

interface ProblemTableProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  pageSize?: number | 'all';
  fitScreen?: boolean;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({ 
  problems, 
  onSelectProblem,
  pageSize = 25,
  fitScreen = true
}) => {
  const { problemProgress, updateProblemStatus, bookmarks, toggleBookmark } = useUserStore();
  const [perPage, setPerPage] = useState<number | 'all'>(pageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to page 1 whenever filter results change
  useEffect(() => {
    setCurrentPage(1);
  }, [problems.length]);

  const totalPages = perPage === 'all' ? 1 : Math.max(1, Math.ceil(problems.length / (perPage as number)));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProblems = perPage === 'all'
    ? problems
    : problems.slice((safeCurrentPage - 1) * (perPage as number), safeCurrentPage * (perPage as number));

  const startIdx = perPage === 'all' || problems.length === 0 ? 1 : (safeCurrentPage - 1) * (perPage as number) + 1;
  const endIdx = perPage === 'all' ? problems.length : Math.min(problems.length, safeCurrentPage * (perPage as number));

  const handleToggleSolved = (e: React.MouseEvent, problem: Problem) => {
    e.stopPropagation();
    const current = problemProgress[problem.id]?.status;
    const newStatus: ProblemStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    updateProblemStatus(problem.id, newStatus);
  };

  const handleToggleBookmark = (e: React.MouseEvent, problemId: string) => {
    e.stopPropagation();
    toggleBookmark(problemId);
  };

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
        <p className="text-slate-400 text-sm">No problems match your current filter criteria.</p>
        <p className="text-slate-600 text-xs mt-1">Try resetting the difficulty or topic tag filters.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${fitScreen ? 'flex-1 min-h-0' : 'space-y-3'}`}>
      {/* Scrollable Table Container */}
      <div className={`overflow-x-auto ${fitScreen ? 'flex-1 min-h-0 overflow-y-auto' : ''} rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm`}>
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 bg-slate-950 z-10 shadow-sm">
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-2.5 pl-4 pr-2 w-12 text-center bg-slate-950">Status</th>
              <th className="py-2.5 px-3 bg-slate-950">Problem Title</th>
              <th className="py-2.5 px-3 w-28 bg-slate-950">Platform</th>
              <th className="py-2.5 px-3 w-24 bg-slate-950">Difficulty</th>
              <th className="py-2.5 px-3 w-24 text-center bg-slate-950">Visualizer</th>
              <th className="py-2.5 px-3 w-16 text-center bg-slate-950">Solve</th>
              <th className="py-2.5 pr-4 pl-2 w-12 text-center bg-slate-950">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedProblems.map((problem) => {
              const progress = problemProgress[problem.id];
              const status: ProblemStatus = progress?.status || 'NOT_STARTED';
              const isSolved = status === 'SOLVED';
              const isAttempted = status === 'ATTEMPTED';
              const isRevision = status === 'REVISION_NEEDED';
              const isBookmarked = bookmarks.includes(problem.id);

              const diffColors = getDifficultyColor(problem.difficulty);
              const platformInfo = APP_CONFIG.platforms[problem.platform as PlatformKey] || {
                name: problem.platform,
                icon: '🌐',
                color: '#6366f1',
              };

              const matchedVisualizer = VISUALIZER_MAPPINGS.find((v) =>
                problem.topicTags.some((tag) => v.algorithmId.includes(tag) || v.id.includes(tag))
              );

              return (
                <tr
                  key={problem.id}
                  onClick={() => onSelectProblem(problem)}
                  className={`group cursor-pointer transition-colors ${
                    isSolved 
                      ? 'bg-emerald-950/10 hover:bg-emerald-950/20' 
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Status Toggle Button */}
                  <td className="py-2.5 pl-4 pr-2 text-center" onClick={(e) => handleToggleSolved(e, problem)}>
                    <button
                      className={`h-6 w-6 rounded-lg flex items-center justify-center transition border ${
                        isSolved
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : isAttempted
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : isRevision
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                      }`}
                      title={`Click to mark as ${isSolved ? 'Not Started' : 'Solved'}`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isAttempted ? (
                        <Hourglass className="h-3.5 w-3.5" />
                      ) : isRevision ? (
                        <RotateCcw className="h-3.5 w-3.5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-600 group-hover:bg-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Problem Title & Tags */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className={`font-medium transition ${isSolved ? 'text-slate-300 line-through' : 'text-white group-hover:text-brand-300'}`}>
                        {problem.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {problem.topicTags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                            {tag}
                          </span>
                        ))}
                        {problem.topicTags.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{problem.topicTags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      <span>{platformInfo.icon}</span>
                      <span className="truncate max-w-[80px]">{platformInfo.name}</span>
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}>
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* AlgoNerve Visualizer Link */}
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    {matchedVisualizer ? (
                      <a
                        href={getAlgoNerveUrl(matchedVisualizer.algorithmId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
                        title={`Open ${matchedVisualizer.label} in AlgoNerve (new tab)`}
                      >
                        <Sparkles className="h-3 w-3 text-brand-400" />
                        <span>Visual</span>
                      </a>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Direct External URL Button */}
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={problem.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title={`Solve on ${platformInfo.name}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>

                  {/* Bookmark Toggle */}
                  <td className="py-2.5 pr-4 pl-2 text-center" onClick={(e) => handleToggleBookmark(e, problem.id)}>
                    <button
                      className={`p-1 rounded-lg transition ${
                        isBookmarked
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination & Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1.5 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-white">{startIdx}-{endIdx}</strong> of <strong className="text-white">{problems.length}</strong></span>
          <div className="h-3 w-px bg-slate-800 mx-1 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-500">Per page:</span>
            {[25, 50, 100].map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  setPerPage(sz);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  perPage === sz
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sz}
              </button>
            ))}
            <button
              onClick={() => {
                setPerPage('all');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                perPage === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Page Nav */}
        {perPage !== 'all' && totalPages > 1 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 text-xs text-slate-300">
              Page <strong className="text-white">{safeCurrentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
