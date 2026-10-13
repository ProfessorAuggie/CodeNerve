import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Code2 } from 'lucide-react';
import { DSA_ROADMAP, CPP_PATH, getLearningPathById } from '../data/learningPaths';
import { RoadmapView } from '../components/roadmap/RoadmapView';

export const RoadmapPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();

  // Default to dsa-roadmap if pathId not specified
  const currentPathId = pathId || 'dsa-roadmap';
  const currentRoadmap = getLearningPathById(currentPathId) || DSA_ROADMAP;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Switcher Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link
          to="/roadmap/dsa-roadmap"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            currentPathId === 'dsa-roadmap'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>DSA Roadmap (12 Groups)</span>
        </Link>

        <Link
          to="/roadmap/cpp-path"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            currentPathId === 'cpp-path'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>C++ & OOP Roadmap (12 Groups)</span>
        </Link>
      </div>

      {/* Render Roadmap */}
      <RoadmapView roadmap={currentRoadmap} />
    </div>
  );
};
