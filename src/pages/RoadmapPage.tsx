import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Compass, Code2, GitFork, GraduationCap, Sparkles, Globe } from 'lucide-react';
import { DSA_ROADMAP, CPP_PATH } from '../data/learningPaths';
import { PROBLEMS, isProblemInTrack } from '../data/problems';
import { RoadmapView } from '../components/roadmap/RoadmapView';
import { DsaDependencyGraph } from '../components/roadmap/DsaDependencyGraph';
import { LpuAcademicGraph } from '../components/roadmap/LpuAcademicGraph';
import { DsaMindMapGraph } from '../components/roadmap/DsaMindMapGraph';
import { useUserStore } from '../store/userStore';

export const RoadmapPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { activePortal, updateStudentActivity } = useUserStore();
  const lpuProblemsCount = PROBLEMS.filter((p) => isProblemInTrack(p, 'lpu')).length;

  // Intra-portal sub-view state: flowchart (DAG, default) | list (Roadmap groups) | mindmap (Concept tree)
  const [userSelectedView, setUserSelectedView] = useState<'flowchart' | 'list' | 'mindmap' | null>(null);
  const subView: 'flowchart' | 'list' | 'mindmap' = userSelectedView ?? (
    (pathId === 'cpp-path' || pathId === 'dsa-roadmap') ? 'list' : 'flowchart'
  );
  const setSubView = (view: 'flowchart' | 'list' | 'mindmap') => setUserSelectedView(view);

  useEffect(() => {
    updateStudentActivity(`Exploring ${activePortal === 'lpu' ? 'LPU CSE Curriculum Roadmap' : 'Global DSA Dependency Graph'}`);
  }, [activePortal, updateStudentActivity]);

  const isGlobal = activePortal === 'global';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner Header */}
      {isGlobal ? (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden text-slate-900 dark:text-white transition-colors">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                <Globe className="h-4 w-4" />
                <span>Global DSA Track &bull; Language Agnostic</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Global DSA Learning Roadmap
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Master algorithmic problem solving from core arrays and two-pointers down to 2-D Dynamic Programming. Explore prerequisite paths, pattern taxonomies, and competitive problem banks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
              <Link
                to="/problems"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition"
              >
                <Code2 className="h-4 w-4" />
                <span>Explore All Problems</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">18 Nodes</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Prerequisite Roadmap</div>
            </div>
            <div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">16 Units</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Topic Groups</div>
            </div>
            <div>
              <div className="text-xl font-bold text-brand-600 dark:text-brand-400">16 Branches</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">DSA Pattern Tree</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">264 Problems</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Curated Problem Bank</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden text-slate-900 dark:text-white transition-colors">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <GraduationCap className="h-4 w-4" />
                <span>Lovely Professional University &bull; School of Computer Science & Engineering</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                LPU Academic Flowchart & Units
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Interactive curriculum dependency engine for CSE202 and CSE205, mapping academic units to university examinations and prerequisite concepts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
              <Link
                to="/lpu"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Open Main LPU Portal</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">12 Units</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">CSE202 &bull; CSE205</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">114 Topics</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Official Curriculum</div>
            </div>
            <div>
              <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{lpuProblemsCount} Problems</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">University Bank</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">Interactive</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Prerequisite Graph</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
        {isGlobal ? (
          <>
            {/* 1. Global DSA Flowchart (Default) */}
            <button
              onClick={() => setSubView('flowchart')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subView === 'flowchart'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Topic Groups List</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                16 Units
              </span>
            </button>

            {/* 3. DSA Patterns Concept Tree */}
            <button
              onClick={() => setSubView('mindmap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subView === 'mindmap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span>DSA Patterns Tree</span>
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
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>C++ & OOP Units</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                6 Units
              </span>
            </button>
          </>
        )}
      </div>

      {/* Render Active View based on activePortal and subView */}
      {isGlobal ? (
        subView === 'flowchart' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-indigo-500/30 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <span>
                  <strong>Global DSA Prerequisite Engine:</strong> Hover over any node to trace prerequisite paths from Arrays & Hashing down to 2-D DP; click node to reveal practice problems & AlgoNerve simulations.
                </span>
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] hidden md:inline font-semibold">
                18 Nodes &bull; Language Agnostic
              </span>
            </div>

            <div className="h-[680px] min-h-[500px] w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <DsaDependencyGraph fitScreen={true} />
            </div>
          </div>
        ) : subView === 'mindmap' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-indigo-500/30 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <span>
                  <strong>DSA Patterns Mind Map:</strong> Interactive organic concept tree spanning all 16 major algorithmic categories with 166 problem patterns.
                </span>
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] hidden md:inline font-semibold">
                16 Categories &bull; 166 Patterns
              </span>
            </div>

            <div className="h-[760px] min-h-[550px] w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <DsaMindMapGraph fitScreen={true} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <RoadmapView roadmap={DSA_ROADMAP} />
          </div>
        )
      ) : (
        subView === 'flowchart' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-emerald-500/30 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong>LPU Academic Prerequisite Dependency Engine:</strong> Hover over any unit or topic to trace back the exact prerequisite foundations required by LPU examiners before that concept.
                </span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] hidden md:inline font-semibold">
                CSE205 &bull; CSE202 Syllabus
              </span>
            </div>

            <div className="h-[680px] min-h-[500px] w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <LpuAcademicGraph fitScreen={true} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <RoadmapView roadmap={CPP_PATH} />
          </div>
        )
      )}
    </div>
  );
};
