import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Terminal, 
  X, 
  Bookmark 
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import type { Problem, ProblemStatus } from '../types';
import { ProblemTable } from '../components/problems/ProblemTable';
import { ProblemModal } from '../components/problems/ProblemModal';
import { useUserStore } from '../store/userStore';

export const ProblemsPage: React.FC = () => {
  const { problemProgress, bookmarks } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  // Extract all unique topic tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    PROBLEMS.forEach((p) => p.topicTags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((p) => {
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
    searchQuery,
    selectedPlatform,
    selectedDifficulty,
    selectedStatus,
    selectedTag,
    showOnlyBookmarked,
    problemProgress,
    bookmarks,
  ]);

  // Overall counts
  const totalCount = PROBLEMS.length;
  const solvedCount = Object.values(problemProgress).filter((p) => p.status === 'SOLVED').length;
  const revisionCount = Object.values(problemProgress).filter((p) => p.status === 'REVISION_NEEDED').length;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Terminal className="h-3.5 w-3.5" />
            <span>Problem Catalogue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Problem Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Curated problems across LeetCode, GeeksforGeeks, and HackerRank with local tracking and AlgoNerve visualizers.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Total: <span className="font-bold text-white">{totalCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
            Solved: <span className="font-bold">{solvedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300">
            Revise: <span className="font-bold">{revisionCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg backdrop-blur-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by name, tag, or platform..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
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
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
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
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
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
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border transition ${
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
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[11px] scrollbar-none">
          <span className="text-slate-500 text-xs shrink-0 mr-1">Tags:</span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2 py-0.5 rounded-lg shrink-0 transition ${
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
              className={`px-2 py-0.5 rounded-lg shrink-0 transition ${
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

      {/* Showing count */}
      <div className="text-xs text-slate-400 flex items-center justify-between">
        <span>Showing {filteredProblems.length} of {PROBLEMS.length} problems</span>
      </div>

      {/* Problem Table */}
      <ProblemTable
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
