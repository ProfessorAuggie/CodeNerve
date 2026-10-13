import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Hourglass, 
  RotateCcw, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';
import type { Problem, ProblemStatus } from '../../types';
import { useUserStore } from '../../store/userStore';
import { getDifficultyColor, getStatusBadge } from '../../lib/utils';
import { APP_CONFIG, type PlatformKey } from '../../lib/config';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../../data/visualizers';

interface ProblemTableProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({ problems, onSelectProblem }) => {
  const { problemProgress, updateProblemStatus, bookmarks, toggleBookmark } = useUserStore();

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
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
        <p className="text-slate-400 text-sm">No problems match your current filter criteria.</p>
        <p className="text-slate-600 text-xs mt-1">Try resetting the difficulty or topic tag filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <th className="py-3.5 pl-4 pr-2 w-12 text-center">Status</th>
            <th className="py-3.5 px-3">Problem Title</th>
            <th className="py-3.5 px-3 w-28">Platform</th>
            <th className="py-3.5 px-3 w-24">Difficulty</th>
            <th className="py-3.5 px-3 w-28 text-center">Visualizer</th>
            <th className="py-3.5 px-3 w-20 text-center">External</th>
            <th className="py-3.5 pr-4 pl-2 w-12 text-center">Save</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {problems.map((problem) => {
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
                <td className="py-3.5 pl-4 pr-2 text-center" onClick={(e) => handleToggleSolved(e, problem)}>
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
                <td className="py-3.5 px-3">
                  <div className="flex flex-col gap-1">
                    <span className={`font-medium transition ${isSolved ? 'text-slate-300 line-through' : 'text-white group-hover:text-brand-300'}`}>
                      {problem.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
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
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    <span>{platformInfo.icon}</span>
                    <span className="truncate max-w-[80px]">{platformInfo.name}</span>
                  </span>
                </td>

                {/* Difficulty */}
                <td className="py-3.5 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}>
                    {problem.difficulty}
                  </span>
                </td>

                {/* AlgoNerve Visualizer Link */}
                <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  {matchedVisualizer ? (
                    <a
                      href={getAlgoNerveUrl(matchedVisualizer.algorithmId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
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
                <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={problem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title={`Solve on ${platformInfo.name}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>

                {/* Bookmark Toggle */}
                <td className="py-3.5 pr-4 pl-2 text-center" onClick={(e) => handleToggleBookmark(e, problem.id)}>
                  <button
                    className={`p-1.5 rounded-lg transition ${
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
  );
};
