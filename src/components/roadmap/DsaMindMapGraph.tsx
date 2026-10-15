import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Scan, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles,
  Maximize2,
  Minimize2,
  FolderOpen,
  Folder,
  Layers
} from 'lucide-react';
import { 
  GLOBAL_DSA_PATTERNS, 
  LPU_ACADEMIC_PATTERNS, 
  type MindMapCategory, 
  type MindMapSubPattern, 
  type MindMapLeafPattern 
} from '../../data/dsaPatternsData';
import { PROBLEMS } from '../../data/problems';
import { useUserStore } from '../../store/userStore';
import { ProblemModal } from '../problems/ProblemModal';
import { TopicDrawer } from './TopicDrawer';
import type { Problem, ProblemStatus } from '../../types';

interface DsaMindMapGraphProps {
  initialVariant?: 'global' | 'lpu';
  fitScreen?: boolean;
}

export const DsaMindMapGraph: React.FC<DsaMindMapGraphProps> = ({ 
  initialVariant = 'global',
  fitScreen = true 
}) => {
  const { activePortal, problemProgress, updateProblemStatus, bookmarks, toggleBookmark } = useUserStore();
  const effectiveVariant = initialVariant || (activePortal === 'lpu' ? 'lpu' : 'global');
  const [variant, setVariant] = useState<'global' | 'lpu'>(effectiveVariant);

  const handleToggleStatus = (problemId: string) => {
    const current = problemProgress[problemId]?.status || 'NOT_STARTED';
    const next: ProblemStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    updateProblemStatus(problemId, next);
  };

  // Sync with activePortal if changed
  useEffect(() => {
    setVariant(activePortal === 'lpu' ? 'lpu' : 'global');
  }, [activePortal]);

  const categories = useMemo(() => {
    return variant === 'global' ? GLOBAL_DSA_PATTERNS : LPU_ACADEMIC_PATTERNS;
  }, [variant]);

  // Expanded nodes state: categoryIds, subPatternIds
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    // Expand first 3 categories by default for a lively initial view
    return new Set(categories.slice(0, 3).map((c) => c.id));
  });

  const [expandedSubPatterns, setExpandedSubPatterns] = useState<Set<string>>(() => {
    const initialSubs = new Set<string>();
    categories.slice(0, 2).forEach((c) => {
      c.subPatterns.slice(0, 2).forEach((s) => initialSubs.add(s.id));
    });
    return initialSubs;
  });

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Modals & Drawer
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerNode, setDrawerNode] = useState<{ id: string; title: string; description: string; problemIds: string[] } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Canvas Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [pan, setPan] = useState({ x: 80, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Problems lookup map
  const problemsMap = useMemo(() => {
    const map = new Map<string, Problem>();
    for (const prob of PROBLEMS) {
      map.set(prob.id, prob);
    }
    return map;
  }, []);

  // Filter categories and patterns by search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q && selectedDifficulty === 'all') return categories;

    return categories.map((cat) => {
      const matchCat = cat.title.toLowerCase().includes(q);
      const filteredSubs = cat.subPatterns.map((sub) => {
        const matchSub = sub.title.toLowerCase().includes(q);
        const filteredLeaves = sub.patterns.filter((pat) => {
          const matchTitle = pat.title.toLowerCase().includes(q);
          const matchRule = pat.keyRule?.toLowerCase().includes(q) || false;
          const matchDiff = selectedDifficulty === 'all' || pat.difficulty === selectedDifficulty;
          return (matchCat || matchSub || matchTitle || matchRule) && matchDiff;
        });

        return {
          ...sub,
          patterns: filteredLeaves,
        };
      }).filter((sub) => sub.patterns.length > 0 || sub.title.toLowerCase().includes(q));

      return {
        ...cat,
        subPatterns: filteredSubs,
      };
    }).filter((cat) => cat.subPatterns.length > 0 || cat.title.toLowerCase().includes(q));
  }, [categories, searchQuery, selectedDifficulty]);

  // Automatically expand all matched nodes when searching
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const allCats = new Set<string>();
      const allSubs = new Set<string>();
      filteredCategories.forEach((cat) => {
        allCats.add(cat.id);
        cat.subPatterns.forEach((s) => allSubs.add(s.id));
      });
      setExpandedCategories(allCats);
      setExpandedSubPatterns(allSubs);
    }
  }, [searchQuery, filteredCategories]);

  // Toggle Category expansion
  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Toggle SubPattern expansion
  const toggleSubPattern = useCallback((id: string) => {
    setExpandedSubPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Expand all / Collapse all
  const handleExpandAll = () => {
    const allCats = new Set<string>();
    const allSubs = new Set<string>();
    categories.forEach((c) => {
      allCats.add(c.id);
      c.subPatterns.forEach((s) => allSubs.add(s.id));
    });
    setExpandedCategories(allCats);
    setExpandedSubPatterns(allSubs);
  };

  const handleCollapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedSubPatterns(new Set());
  };

  // Canvas Mouse Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a, .interactive-card')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zooming with Wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || !e.shiftKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoomLevel((prev) => Math.min(1.8, Math.max(0.3, Number((prev * zoomFactor).toFixed(3)))));
    }
  };

  // Reset View
  const handleReset = () => {
    setZoomLevel(0.85);
    setPan({ x: 80, y: 40 });
  };

  // Solved Stats calculation
  const totalPatternProblems = useMemo(() => {
    const pIdSet = new Set<string>();
    for (const cat of categories) {
      for (const sub of cat.subPatterns) {
        for (const pat of sub.patterns) {
          pat.problemIds.forEach((id) => pIdSet.add(id));
        }
      }
    }
    const all = Array.from(pIdSet);
    const solved = all.filter((id) => problemProgress[id]?.status === 'SOLVED').length;
    return {
      total: all.length,
      solved,
      percentage: all.length > 0 ? Math.round((solved / all.length) * 100) : 0,
    };
  }, [categories, problemProgress]);

  // Open Topic Drawer for a Leaf Pattern or Category
  const handleOpenDrawer = (title: string, description: string, problemIds: string[]) => {
    setDrawerNode({
      id: title,
      title,
      description,
      problemIds,
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className={`relative w-full bg-slate-50 dark:bg-[#090b10] flex flex-col overflow-hidden transition-all duration-200 ${
      fitScreen ? 'flex-1 min-h-0 h-full rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl' : 'h-[850px] rounded-2xl border border-slate-200 dark:border-slate-800'
    }`}>
      {/* ───── Controls & Filter Header Bar ───── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Variant Switcher Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setVariant('global')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                variant === 'global'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Global DSA Patterns</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">16 Roots</span>
            </button>
            <button
              onClick={() => setVariant('lpu')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                variant === 'lpu'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>LPU Academic Mind Map</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">CSE205 &bull; 202</span>
            </button>
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={handleExpandAll}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold"
              title="Expand all branches"
            >
              <FolderOpen className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Expand All</span>
            </button>
            <button
              onClick={handleCollapseAll}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold"
              title="Collapse all branches"
            >
              <Folder className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md"
              title="Reset View"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>
        </div>

        {/* Right Search & Stats */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter pattern, sort, or BFS..."
              className="pl-8 pr-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                &times;
              </button>
            )}
          </div>

          {/* Solved Progress Counter */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Solved:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {totalPatternProblems.solved} / {totalPatternProblems.total}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              ({totalPatternProblems.percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* ───── Interactive Canvas Container ───── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative flex-1 min-h-0 w-full overflow-hidden select-none cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Scaled & Panned Content Layer */}
        <div
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* Main Tree Layout */}
          <div className="flex items-start gap-12 sm:gap-16 py-8 pr-16 min-w-max">
            {/* 1. CENTRAL ROOT NODE */}
            <div className="sticky top-1/2 -translate-y-1/2 shrink-0 z-20">
              <div className="w-72 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/80 dark:border-indigo-500 shadow-2xl shadow-indigo-500/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-3 w-3" />
                    Interactive Mind Map
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {categories.length} Categories
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {variant === 'global' ? 'DSA Patterns' : 'LPU Academic Curricula'}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {variant === 'global' 
                      ? '(CodeWithNishchal & CodeNerve Framework)' 
                      : '(CSE205 Data Structures & CSE202 C++ OOP)'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Click category pills to expand</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">&rarr;</span>
                </div>
              </div>
            </div>

            {/* 2. CATEGORY BRANCHES & CHILDREN */}
            <div className="flex flex-col gap-6 relative">
              {filteredCategories.map((cat, catIdx) => {
                const isCatExpanded = expandedCategories.has(cat.id);

                return (
                  <div key={cat.id} className="flex items-start gap-8 relative group">
                    {/* SVG Connector Curve from Root to Category */}
                    <svg
                      className="absolute -left-16 top-5 pointer-events-none overflow-visible"
                      width="64"
                      height="24"
                    >
                      <path
                        d="M -4 10 C 20 10, 40 12, 64 12"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="opacity-75 group-hover:opacity-100 transition-opacity"
                      />
                    </svg>

                    {/* Category Capsule Node */}
                    <div className="shrink-0 z-10">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className={`interactive-card flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-150 text-left shadow-md hover:shadow-lg ${
                          isCatExpanded
                            ? `${cat.bgLight} ${cat.bgDark} ${cat.borderColor} ring-2 ring-indigo-500/20`
                            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: cat.color }}
                        />

                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            {cat.title}
                            {cat.syllabusUnit && (
                              <span className="text-[9px] px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                                {cat.syllabusUnit}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {cat.subPatterns.length} sub-branches
                          </span>
                        </div>

                        {/* Number Count Pill (Just like Whimsical) */}
                        <span 
                          className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-extrabold text-white shadow-sm shrink-0"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.count}
                        </span>

                        <div className="text-slate-400 ml-1">
                          {isCatExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                    </div>

                    {/* 3. SUB-PATTERNS (Visible if Category is Expanded) */}
                    {isCatExpanded && (
                      <div className="flex flex-col gap-4 pl-4 relative border-l-2 border-slate-200 dark:border-slate-800/80">
                        {cat.subPatterns.map((sub) => {
                          const isSubExpanded = expandedSubPatterns.has(sub.id);

                          return (
                            <div key={sub.id} className="flex items-start gap-6 relative group/sub">
                              {/* SubPattern Header Capsule */}
                              <div className="shrink-0 z-10">
                                <button
                                  onClick={() => toggleSubPattern(sub.id)}
                                  className={`interactive-card flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition ${
                                    isSubExpanded
                                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50'
                                  }`}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {sub.title}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-extrabold text-slate-700 dark:text-slate-300">
                                    {sub.patterns.length}
                                  </span>
                                  {isSubExpanded ? (
                                    <ChevronDown className="h-3 w-3 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 text-slate-400" />
                                  )}
                                </button>
                              </div>

                              {/* 4. LEAF PATTERN CARDS (Visible if SubPattern is Expanded) */}
                              {isSubExpanded && (
                                <div className="flex flex-col gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                                  {sub.patterns.map((pat) => {
                                    const solvedCount = pat.problemIds.filter(
                                      (id) => problemProgress[id]?.status === 'SOLVED'
                                    ).length;
                                    const isComplete = pat.problemIds.length > 0 && solvedCount === pat.problemIds.length;

                                    return (
                                      <div
                                        key={pat.id}
                                        className={`interactive-card p-3 rounded-xl border bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all w-80 sm:w-96 flex flex-col gap-2 ${
                                          isComplete
                                            ? 'border-emerald-500/50 bg-emerald-500/5'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex items-center gap-1.5">
                                            {isComplete && (
                                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            )}
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                              {pat.title}
                                            </h4>
                                          </div>
                                          {pat.difficulty && (
                                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                                              pat.difficulty === 'easy'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : pat.difficulty === 'hard'
                                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            }`}>
                                              {pat.difficulty}
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                          {pat.description}
                                        </p>

                                        {pat.keyRule && (
                                          <div className="text-[10px] font-mono p-1.5 rounded bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                            <strong className="text-indigo-600 dark:text-indigo-400">Rule: </strong>
                                            {pat.keyRule}
                                          </div>
                                        )}

                                        {/* Actions footer */}
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                          <button
                                            onClick={() => handleOpenDrawer(pat.title, pat.description, pat.problemIds)}
                                            className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                          >
                                            <span>{pat.problemIds.length} Problems</span>
                                            <span className="text-[10px] text-slate-400 font-normal">
                                              ({solvedCount} solved)
                                            </span>
                                          </button>

                                          <div className="flex items-center gap-1.5">
                                            {pat.visualizerId && (
                                              <a
                                                href={`/visualizers`}
                                                className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-semibold text-[10px]"
                                              >
                                                <Play className="h-2.5 w-2.5" />
                                                <span>Visualizer</span>
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ───── Topic Drawer for Pattern Problems ───── */}
      {drawerNode && (
        <TopicDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={drawerNode.title}
          description={drawerNode.description}
          problems={drawerNode.problemIds.map((id) => problemsMap.get(id)).filter(Boolean) as Problem[]}
          problemProgress={problemProgress}
          bookmarks={bookmarks}
          onToggleStatus={handleToggleStatus}
          onToggleBookmark={toggleBookmark}
          onOpenProblemModal={(prob) => setSelectedProblem(prob)}
        />
      )}

      {/* ───── Problem Modal ───── */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
};
