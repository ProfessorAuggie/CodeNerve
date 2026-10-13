import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Compass, Code2, GitFork, GraduationCap } from 'lucide-react';
import { DSA_ROADMAP, CPP_PATH } from '../data/learningPaths';
import { RoadmapView } from '../components/roadmap/RoadmapView';
import { DsaDependencyGraph } from '../components/roadmap/DsaDependencyGraph';
import { LpuAcademicGraph } from '../components/roadmap/LpuAcademicGraph';

export const RoadmapPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const [activeView, setActiveView] = useState<'tree' | 'lpu-tree' | 'dsa-units' | 'cpp-units'>(() => {
    if (pathId === 'cpp-path') return 'cpp-units';
    if (pathId === 'dsa-roadmap') return 'dsa-units';
    if (pathId === 'lpu') return 'lpu-tree';
    return 'tree'; // Default view is the interactive branch tree
  });

  const currentRoadmap = activeView === 'cpp-units' ? CPP_PATH : DSA_ROADMAP;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Switcher Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Interactive DSA Branching Flowchart */}
          <button
            onClick={() => setActiveView('tree')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'tree'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitFork className="h-4 w-4" />
            <span>Global DSA Flowchart</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200">
              Generic
            </span>
          </button>

          {/* LPU Academic Flowchart */}
          <button
            onClick={() => setActiveView('lpu-tree')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'lpu-tree'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>LPU Academic Flowchart</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200">
              CSE202/205
            </span>
          </button>

          {/* DSA 12 Groups */}
          <button
            onClick={() => setActiveView('dsa-units')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeView === 'dsa-units'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>DSA Units List (12 Groups)</span>
          </button>

          {/* C++ Path */}
          <button
            onClick={() => setActiveView('cpp-units')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeView === 'cpp-units'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>C++ & OOP Roadmap</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          {activeView === 'tree'
            ? 'Click any node to view problems & launch visualizer'
            : 'Prerequisite-aware progression'}
        </span>
      </div>

      {/* Render Active View */}
      {activeView === 'tree' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>
                <strong>Global DSA Roadmap (Language-Agnostic):</strong> Follow prerequisite paths from Arrays & Hashing down to 2-D DP. Solve problems and analyze complexity in any language (Python, Java, C++, JS, Go). Hover on any node to trace prerequisites; click to reveal practice problems & AlgoNerve simulations.
              </span>
            </div>
            <span className="text-slate-500 text-[11px] hidden md:inline">18 Nodes &bull; Language Agnostic</span>
          </div>

          <DsaDependencyGraph />
        </div>
      ) : activeView === 'lpu-tree' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-900/40 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>
                <strong>LPU Academic Curriculum Flowchart:</strong> Switch between CSE205 (Data Structures) and CSE202 (C++ OOP). Hover on any academic unit to trace foundational prerequisites!
              </span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px] hidden md:inline">CSE205 &bull; CSE202 Syllabi</span>
          </div>

          <LpuAcademicGraph />
        </div>
      ) : (
        <RoadmapView roadmap={currentRoadmap} />
      )}
    </div>
  );
};
