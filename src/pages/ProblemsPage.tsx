import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Terminal, 
  X, 
  Bookmark,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import type { Problem, ProblemStatus } from '../types';
import { ProblemTable } from '../components/problems/ProblemTable';
import { ProblemModal } from '../components/problems/ProblemModal';
import { useUserStore } from '../store/userStore';

export const ProblemsPage: React.FC = () => {
  const { problemProgress, bookmarks, activePortal } = useUserStore();
  const [isFitScreen, setIsFitScreen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const isLpu = activePortal === 'lpu';

  // 1. Strictly separate problem universe by active portal (NO OVERLAPPING)
  const portalProblems = useMemo(() => {
    return PROBLEMS.filter((p) => (p.track || 'global') === activePortal);
  }, [activePortal]);

  // 2. Extract all unique topic tags for the active portal
  const allTags = useMemo(() => {
    const set = new Set<string>();
    portalProblems.forEach((p) => p.topicTags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [portalProblems]);

  // 3. Filter problems within active portal
  const filteredProblems = useMemo(() => {
    return portalProblems.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTag = p.topicTags.some((t) => t.toLowerCase().includes(q));
        const matchesPlatform = p.platform.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTag && !matchesPlatform) return false;
      }

      // Platform
      if (selectedPlatform !== 'all' && p.platform !== selectedPlatform) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Tag
      if (selectedTag !== 'all' && !p.topicTags.includes(selectedTag)) {
        return false;
      }

      // Bookmark
      if (showOnlyBookmarked && !bookmarks.includes(p.id)) {
        return false;
      }

      // Status
      const status: ProblemStatus = problemProgress[p.id]?.status || 'NOT_STARTED';
      if (selectedStatus === 'SOLVED' && status !== 'SOLVED') return false;
      if (selectedStatus === 'ATTEMPTED' && status !== 'ATTEMPTED') return false;
      if (selectedStatus === 'REVISION_NEEDED' && status !== 'REVISION_NEEDED') return false;
      if (selectedStatus === 'NOT_STARTED' && status !== 'NOT_STARTED') return false;

      return true;
    });
  }, [
    portalProblems,
    searchQuery,
    selectedPlatform,
    selectedDifficulty,
    selectedStatus,
    selectedTag,
    showOnlyBookmarked,
    problemProgress,
    bookmarks,
  ]);

  // Overall counts for active portal
  const totalCount = portalProblems.length;
  const portalProblemIds = useMemo(() => new Set(portalProblems.map((p) => p.id)), [portalProblems]);
  const solvedCount = Object.entries(problemProgress).filter(([id, p]) => portalProblemIds.has(id) && p.status === 'SOLVED').length;
  const revisionCount = Object.entries(problemProgress).filter(([id, p]) => portalProblemIds.has(id) && p.status === 'REVISION_NEEDED').length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setSelectedTag('all');
    setShowOnlyBookmarked(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedPlatform !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedStatus !== 'all' ||
    selectedTag !== 'all' ||
    showOnlyBookmarked;

  return (
    <div
      className={
        isFitScreen
          ? 'h-[calc(100vh-56px)] flex flex-col p-3 sm:p-4 max-w-[1700px] mx-auto w-full overflow-hidden space-y-2.5'
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'
      }
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shrink-0 ${
            isLpu 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
          }`}>
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{isLpu ? 'LPU Academic Question Bank' : 'Global DSA Problem Catalogue'}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                isLpu 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {totalCount} problems ({isLpu ? 'LPU Track' : 'Global Track'})
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isLpu
                ? 'University-aligned questions for CSE202 (C++ OOP) and CSE205 (Data Structures) structured unit-by-unit with curriculum topic prerequisites.'
                : '182 canonical, language-agnostic DSA problems (LeetCode, GFG & DSA 130) with AlgoNerve visualizers and tracking.'}
            </p>
          </div>
        </div>

        {/* Quick Stats & Viewport Toggle */}
        <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Total: <span className="font-bold text-white">{totalCount}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
            Solved: <span className="font-bold">{solvedCount}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300">
            Revise: <span className="font-bold">{revisionCount}</span>
          </div>

          <button
            onClick={() => setIsFitScreen(!isFitScreen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold border transition ${
              isFitScreen
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isFitScreen ? 'Switch to Standard Scroll View' : 'Fit Entire Catalogue on One Screen'}
          >
            {isFitScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isFitScreen ? 'Single Screen' : 'Full Page'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-2.5 sm:p-3 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg backdrop-blur-sm space-y-2 shrink-0">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by name, tag, or platform..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Platform Dropdown */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="geeksforgeeks">GeeksforGeeks</option>
            <option value="hackerrank">HackerRank</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="SOLVED">Solved</option>
            <option value="ATTEMPTED">Attempted</option>
            <option value="REVISION_NEEDED">Needs Revision</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>

          {/* Bookmark Filter Toggle */}
          <button
            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition ${
              showOnlyBookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-medium'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-brand-400 hover:text-brand-300 px-2 py-1 shrink-0"
            >
              Reset
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 text-[11px] scrollbar-none">
          <span className="text-slate-500 text-xs shrink-0 mr-1">Tags:</span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2 py-0.5 rounded text-[11px] shrink-0 transition ${
              selectedTag === 'all'
                ? 'bg-brand-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
              className={`px-2 py-0.5 rounded text-[11px] shrink-0 transition ${
                selectedTag === tag
                  ? 'bg-brand-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Table */}
      <ProblemTable
        fitScreen={isFitScreen}
        problems={filteredProblems}
        onSelectProblem={(prob) => setSelectedProblem(prob)}
      />

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};
