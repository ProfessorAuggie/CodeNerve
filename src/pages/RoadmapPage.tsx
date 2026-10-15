import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Compass, Code2, GitFork, GraduationCap, Sparkles } from 'lucide-react';
import { DSA_ROADMAP, CPP_PATH } from '../data/learningPaths';
import { RoadmapView } from '../components/roadmap/RoadmapView';
import { DsaDependencyGraph } from '../components/roadmap/DsaDependencyGraph';
import { LpuAcademicGraph } from '../components/roadmap/LpuAcademicGraph';
import { DsaMindMapGraph } from '../components/roadmap/DsaMindMapGraph';
import { useUserStore } from '../store/userStore';

export const RoadmapPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { activePortal, updateStudentActivity } = useUserStore();

  // Intra-portal sub-view state: flowchart (DAG, default) | list (Roadmap groups) | mindmap (Whimsical tree)
  const [subView, setSubView] = useState<'flowchart' | 'list' | 'mindmap'>('flowchart');

  useEffect(() => {
    if (pathId === 'cpp-path' || pathId === 'dsa-roadmap') {
      setSubView('list');
    } else {
      setSubView('flowchart');
    }
  }, [pathId, activePortal]);

  useEffect(() => {
    updateStudentActivity(`Exploring ${activePortal === 'lpu' ? 'LPU CSE Curriculum Roadmap' : 'Global DSA Dependency Graph'}`);
  }, [activePortal, updateStudentActivity]);

  const isGlobal = activePortal === 'global';

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col p-3 sm:p-4 max-w-[1700px] mx-auto w-full overflow-hidden">
      {/* Intra-Portal Navigation Bar & View Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {isGlobal ? (
            <>
              {/* 1. Global DSA Flowchart (Default) */}
              <button
                onClick={() => setSubView('flowchart')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  subView === 'flowchart'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <GitFork className="h-4 w-4" />
                <span>Global DSA Flowchart</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-200">
                  Interactive
                </span>
              </button>

              {/* 2. Global Topic Groups List */}
              <button
                onClick={() => setSubView('list')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  subView === 'list'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Topic Groups List</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  16 Units
                </span>
              </button>

              {/* 3. Whimsical DSA Patterns Mind Map */}
              <button
                onClick={() => setSubView('mindmap')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  subView === 'mindmap'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <span>Whimsical Mind Map</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                  16 Branches
                </span>
              </button>
            </>
          ) : (
            <>
              {/* 1. LPU Academic Flowchart (Default) */}
              <button
                onClick={() => setSubView('flowchart')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  subView === 'flowchart'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>LPU Academic Flowchart</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-200">
                  CSE205 &bull; CSE202
                </span>
              </button>

              {/* 2. C++ & OOP Units */}
              <button
                onClick={() => setSubView('list')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  subView === 'list'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Code2 className="h-4 w-4" />
                <span>C++ & OOP Units</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  6 Units
                </span>
              </button>

              {/* 3. LPU Syllabus Mind Map */}
              <button
                onClick={() => setSubView('mindmap')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  subView === 'mindmap'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>LPU Syllabus Mind Map</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  Whimsical
                </span>
              </button>
            </>
          )}
        </div>

        {/* Helper Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {subView === 'mindmap'
              ? 'Click category badges to expand all branches & problems'
              : subView === 'flowchart'
              ? 'Click node for problems & visualizer'
              : 'Prerequisite-aware progression'}
          </span>
        </div>
      </div>

      {/* Render Active View based on activePortal and subView */}
      {isGlobal ? (
        subView === 'mindmap' ? (
          <div className="flex flex-col flex-1 min-h-0 pt-2">
            <DsaMindMapGraph initialVariant="global" fitScreen={true} />
          </div>
        ) : subView === 'flowchart' ? (
          <div className="flex flex-col flex-1 min-h-0 pt-2">
            <div className="p-2.5 sm:p-3 mb-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <span>
                  <strong>Global DSA Roadmap:</strong> Prerequisite paths from Arrays & Hashing down to 2-D DP. Hover on any node to trace prerequisites; click to reveal practice problems & AlgoNerve simulations.
                </span>
              </div>
              <span className="text-slate-500 text-[11px] hidden md:inline ml-3 shrink-0">18 Nodes &bull; Language Agnostic</span>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <DsaDependencyGraph fitScreen={true} />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-2">
            <RoadmapView roadmap={DSA_ROADMAP} />
          </div>
        )
      ) : (
        subView === 'mindmap' ? (
          <div className="flex flex-col flex-1 min-h-0 pt-2">
            <DsaMindMapGraph initialVariant="lpu" fitScreen={true} />
          </div>
        ) : subView === 'flowchart' ? (
          <div className="flex flex-col flex-1 min-h-0 pt-2">
            <div className="p-2.5 sm:p-3 mb-2 rounded-xl bg-white dark:bg-slate-900/60 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong>LPU Academic Curriculum Flowchart:</strong> Switch between CSE205 (Data Structures in C++) and CSE202 (C++ OOP). Hover on any academic unit to trace foundational prerequisites!
                </span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] hidden md:inline ml-3 shrink-0 font-semibold">CSE205 &bull; CSE202 Syllabi</span>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <LpuAcademicGraph fitScreen={true} />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-2">
            <RoadmapView roadmap={CPP_PATH} />
          </div>
        )
      )}
    </div>
  );
};
