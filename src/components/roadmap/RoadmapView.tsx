import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Hourglass, 
  RotateCcw, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  Lock,
  Compass,
  Layers
} from 'lucide-react';
import type { LearningPath, LearningPathGroup, Problem } from '../../types';
import { useUserStore } from '../../store/userStore';
import { PROBLEMS } from '../../data/problems';
import { VISUALIZER_MAPPINGS } from '../../data/visualizers';
import { getDifficultyColor } from '../../lib/utils';
import { ProblemModal } from '../problems/ProblemModal';

interface RoadmapViewProps {
  roadmap: LearningPath;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap }) => {
  const { problemProgress, updateProblemStatus } = useUserStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // Expand first 3 groups by default
    const initial: Record<string, boolean> = {};
    roadmap.groups.slice(0, 3).forEach((g) => {
      initial[g.id] = true;
    });
    return initial;
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    roadmap.groups.forEach((g) => (all[g.id] = true));
    setExpandedGroups(all);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  // Calculate overall roadmap stats
  const allProblemIdsInPath = roadmap.groups.flatMap((g) =>
    g.items.filter((it) => it.type === 'problem').map((it) => it.referenceId)
  );
  const totalInPath = allProblemIdsInPath.length;
  const solvedInPath = allProblemIdsInPath.filter(
    (id) => problemProgress[id]?.status === 'SOLVED'
  ).length;
  const roadmapPercent = totalInPath > 0 ? Math.round((solvedInPath / totalInPath) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner & Overall Progress */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 shadow-xl backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20 mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Learning Path</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {roadmap.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {roadmap.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {solvedInPath} <span className="text-slate-500 text-sm">/ {totalInPath}</span>
              </div>
              <div className="text-xs text-slate-400">Problems Solved</div>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold text-sm text-brand-400 bg-slate-950">
              {roadmapPercent}%
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={expandAll}
              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Flow Graph / Cards */}
      <div className="space-y-4">
        {roadmap.groups.map((group, index) => {
          const isExpanded = !!expandedGroups[group.id];
          const problemItems = group.items.filter((it) => it.type === 'problem');
          const groupProblemIds = problemItems.map((it) => it.referenceId);
          const groupProblems = groupProblemIds
            .map((id) => PROBLEMS.find((p) => p.id === id))
            .filter((p): p is Problem => !!p);

          const groupSolved = groupProblemIds.filter(
            (id) => problemProgress[id]?.status === 'SOLVED'
          ).length;
          const groupPercent =
            groupProblemIds.length > 0
              ? Math.round((groupSolved / groupProblemIds.length) * 100)
              : 0;

          // Check if prerequisites are satisfied
          const prereqGroups = group.prerequisites
            .map((prereqId) => roadmap.groups.find((g) => g.id === prereqId))
            .filter((g): g is LearningPathGroup => !!g);

          return (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg transition hover:border-slate-700/80 overflow-hidden"
            >
              {/* Group Header Card */}
              <div
                onClick={() => toggleGroup(group.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-slate-900/90 hover:bg-slate-850 transition"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl shadow-inner border border-slate-700/60 shrink-0">
                    {group.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase text-brand-400 tracking-wider">
                        Step {group.order}
                      </span>
                      {prereqGroups.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          Requires: {prereqGroups.map((p) => p.title).join(', ')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{group.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-200">
                        {groupSolved}/{groupProblemIds.length} Solved
                      </div>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800 mt-1">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${groupPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Problems List */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 bg-slate-950/40 p-4 space-y-2">
                  {groupProblems.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 text-center">
                      Theoretical foundational topic — explore connected lessons and visualizers.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {groupProblems.map((problem) => {
                        const progress = problemProgress[problem.id];
                        const isSolved = progress?.status === 'SOLVED';
                        const isAttempted = progress?.status === 'ATTEMPTED';
                        const isRevision = progress?.status === 'REVISION_NEEDED';
                        const diffColors = getDifficultyColor(problem.difficulty);

                        const matchedVisualizer = VISUALIZER_MAPPINGS.find((v) =>
                          problem.topicTags.some((tag) => v.algorithmId.includes(tag) || v.id.includes(tag))
                        );

                        return (
                          <div
                            key={problem.id}
                            onClick={() => setSelectedProblem(problem)}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition cursor-pointer ${
                              isSolved
                                ? 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-700/50'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateProblemStatus(
                                    problem.id,
                                    isSolved ? 'NOT_STARTED' : 'SOLVED'
                                  );
                                }}
                                className={`h-6 w-6 rounded-lg flex items-center justify-center transition border shrink-0 ${
                                  isSolved
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                    : isAttempted
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                    : isRevision
                                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                    : 'border-slate-700 bg-slate-800 text-slate-500 hover:border-slate-500'
                                }`}
                                title={isSolved ? 'Mark uncompleted' : 'Mark solved'}
                              >
                                {isSolved ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : isAttempted ? (
                                  <Hourglass className="h-3.5 w-3.5" />
                                ) : isRevision ? (
                                  <RotateCcw className="h-3.5 w-3.5" />
                                ) : (
                                  <div className="h-2 w-2 rounded-full bg-slate-600" />
                                )}
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-semibold ${
                                      isSolved
                                        ? 'text-slate-400 line-through'
                                        : 'text-white hover:text-brand-300'
                                    }`}
                                  >
                                    {problem.title}
                                  </span>
                                  <span
                                    className={`text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase tracking-wider ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}
                                  >
                                    {problem.difficulty}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                  {problem.description}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                              {matchedVisualizer && (
                                <Link
                                  to={`/visualize/${matchedVisualizer.algorithmId}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
                                  title="Visualize Algorithm on AlgoNerve"
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                                  <span>Visualizer</span>
                                </Link>
                              )}

                              <a
                                href={problem.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                              >
                                <span>Solve</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};
