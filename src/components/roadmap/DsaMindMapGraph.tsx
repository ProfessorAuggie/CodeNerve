import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Search, 
  Play, 
  CheckCircle2, 
  Sparkles,
  FolderOpen,
  Folder,
  GraduationCap,
  Globe2,
  BookOpen,
  X,
  Maximize2
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

  // Sync with activePortal if changed
  useEffect(() => {
    setVariant(initialVariant || (activePortal === 'lpu' ? 'lpu' : 'global'));
  }, [activePortal, initialVariant]);

  const categories = useMemo(() => {
    return variant === 'global' ? GLOBAL_DSA_PATTERNS : LPU_ACADEMIC_PATTERNS;
  }, [variant]);

  // Expanded nodes state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    return new Set(categories.map((c) => c.id));
  });

  const [expandedSubPatterns, setExpandedSubPatterns] = useState<Set<string>>(() => {
    const initialSubs = new Set<string>();
    categories.forEach((c) => {
      c.subPatterns.forEach((s) => initialSubs.add(s.id));
    });
    return initialSubs;
  });

  // Re-expand when variant changes
  useEffect(() => {
    const newCats = new Set<string>();
    const newSubs = new Set<string>();
    categories.forEach((c) => {
      newCats.add(c.id);
      c.subPatterns.forEach((s) => newSubs.add(s.id));
    });
    setExpandedCategories(newCats);
    setExpandedSubPatterns(newSubs);
  }, [categories]);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawer
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerNode, setDrawerNode] = useState<{ id: string; title: string; description: string; problemIds: string[] } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Canvas Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [pan, setPan] = useState({ x: 40, y: 35 });
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

  const handleToggleStatus = (problemId: string) => {
    const current = problemProgress[problemId]?.status || 'NOT_STARTED';
    const next: ProblemStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    updateProblemStatus(problemId, next);
  };

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

  // Auto-expand on search match
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const matchedCats = new Set<string>();
    const matchedSubs = new Set<string>();

    categories.forEach((cat) => {
      let catMatched = cat.title.toLowerCase().includes(q);
      cat.subPatterns.forEach((sub) => {
        let subMatched = sub.title.toLowerCase().includes(q) || (sub.description && sub.description.toLowerCase().includes(q));
        const patternMatch = sub.patterns.some((p) => 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) || 
          (p.keyRule && p.keyRule.toLowerCase().includes(q))
        );
        if (subMatched || patternMatch) {
          catMatched = true;
          matchedSubs.add(sub.id);
        }
      });
      if (catMatched) {
        matchedCats.add(cat.id);
      }
    });

    if (matchedCats.size > 0) {
      setExpandedCategories((prev) => new Set([...prev, ...matchedCats]));
      setExpandedSubPatterns((prev) => new Set([...prev, ...matchedSubs]));
    }
  }, [searchQuery, categories]);

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

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || !e.shiftKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoomLevel((prev) => Math.min(1.8, Math.max(0.25, Number((prev * zoomFactor).toFixed(3)))));
    }
  };

  const handleReset = () => {
    setZoomLevel(0.85);
    setPan({ x: 40, y: 35 });
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
    <div className={`relative w-full bg-slate-50 dark:bg-[#07090f] flex flex-col overflow-hidden transition-all duration-200 select-none ${
      fitScreen ? 'flex-1 min-h-0 h-full rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl' : 'h-[850px] rounded-2xl border border-slate-200 dark:border-slate-800'
    }`}>
      {/* ───── Top Unified Controls Bar ───── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-md z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Variant Switcher: Global DSA Patterns vs LPU Syllabus Units */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              onClick={() => setVariant('global')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                variant === 'global'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>Global DSA Patterns</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">16 Categories</span>
            </button>
            <button
              onClick={() => setVariant('lpu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                variant === 'lpu'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>LPU Academic Syllabus</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">CSE205 &bull; CSE202</span>
            </button>
          </div>

          {/* Expand / Collapse Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={handleExpandAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold transition"
              title="Expand all branches"
            >
              <FolderOpen className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Expand All</span>
            </button>
            <button
              onClick={handleCollapseAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold transition"
              title="Collapse branches to category root"
            >
              <Folder className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition"
              title="Reset View to 85%"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>
        </div>

        {/* Right Info: Search & Solved Counter */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic or pattern..."
              className="pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Solved:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {totalPatternProblems.solved} / {totalPatternProblems.total}
            </span>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${totalPatternProblems.percentage}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {totalPatternProblems.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* ───── INTERACTIVE CONCEPT TREE CANVAS ───── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative flex-1 min-h-0 w-full overflow-hidden cursor-grab active:cursor-grabbing ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.22) 1.2px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Scaled & Panned Canvas Viewport */}
        <div
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* Horizontal Tree Layout */}
          <div className="flex items-start gap-14 py-12 pr-28 pl-6 min-w-max">
            {/* 1. CENTRAL ROOT NODE */}
            <div className="sticky top-1/2 -translate-y-1/2 shrink-0 z-20">
              <div className="w-72 p-5 rounded-2xl bg-white dark:bg-[#101320] border-2 border-indigo-500/80 shadow-2xl flex flex-col gap-2.5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    {variant === 'global' ? 'DSA Pattern Tree' : 'LPU Syllabus Tree'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {categories.length} Categories
                  </span>
                </div>

                <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  {variant === 'global' ? 'DSA Patterns & Frameworks' : 'LPU Academic Curriculum'}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {variant === 'global' 
                    ? '(Core Algorithmic Taxonomy & Frameworks)' 
                    : '(CSE205 Data Structures & CSE202 C++ OOP)'}
                </p>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Click pills to expand branches</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {totalPatternProblems.solved}/{totalPatternProblems.total} Solved
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CATEGORIES COLUMN WITH CURVED BRANCHES */}
            <div className="flex flex-col gap-7 relative">
              {categories.map((cat) => {
                const isCatExpanded = expandedCategories.has(cat.id);

                return (
                  <div key={cat.id} className="flex items-start gap-9 relative group">
                    {/* Category Capsule Button */}
                    <div className="shrink-0 z-10 flex items-center">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer ${
                          isCatExpanded
                            ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 ring-2 ring-indigo-500/20'
                            : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          {cat.title}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.count}
                        </span>
                        <span 
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-black border transition ${
                            isCatExpanded 
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isCatExpanded ? '−' : '+'}
                        </span>
                      </button>
                    </div>

                    {/* Sub-Topics / Sub-Patterns Branching to the Right */}
                    {isCatExpanded && (
                      <div 
                        className="flex flex-col gap-4 pl-6 border-l-2 relative" 
                        style={{ borderColor: cat.color }}
                      >
                        {cat.subPatterns.map((sub) => {
                          const isSubExpanded = expandedSubPatterns.has(sub.id);
                          const patternCount = sub.patterns.length;

                          return (
                            <div key={sub.id} className="flex items-start gap-7 relative">
                              {/* Sub-Topic Capsule Button */}
                              <div className="shrink-0 z-10 flex items-center">
                                <button
                                  onClick={() => toggleSubPattern(sub.id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 shadow-sm hover:scale-[1.02] cursor-pointer ${
                                    isSubExpanded
                                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <span className="tracking-tight">{sub.title}</span>
                                  {patternCount > 0 && (
                                    <span 
                                      className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold text-white"
                                      style={{ backgroundColor: cat.color }}
                                    >
                                      {patternCount}
                                    </span>
                                  )}
                                  <span 
                                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-black border transition ${
                                      isSubExpanded 
                                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {isSubExpanded ? '−' : '+'}
                                  </span>
                                </button>
                              </div>

                              {/* Concrete Leaf Pattern Cards */}
                              {isSubExpanded && (
                                <div className="flex flex-col gap-2.5 pl-5 border-l-2 border-slate-300 dark:border-slate-700">
                                  {sub.patterns.map((pat) => {
                                    const solvedCount = pat.problemIds.filter(
                                      (id) => problemProgress[id]?.status === 'SOLVED'
                                    ).length;
                                    const isComplete = pat.problemIds.length > 0 && solvedCount === pat.problemIds.length;

                                    return (
                                      <div
                                        key={pat.id}
                                        className={`interactive-card p-3 rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition w-72 sm:w-84 flex flex-col gap-1.5 text-xs ${
                                          isComplete
                                            ? 'border-emerald-500/50 bg-emerald-500/5'
                                            : 'border-slate-200 dark:border-slate-800'
                                        }`}
                                      >
                                        {/* Pattern Title & Difficulty */}
                                        <div className="flex items-center justify-between gap-1.5">
                                          <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                            {pat.title}
                                          </span>
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

                                        {/* Description */}
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                          {pat.description}
                                        </p>

                                        {/* Key Rule / Invariant Monospace Callout */}
                                        {pat.keyRule && (
                                          <div className="text-[10px] font-mono p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 line-clamp-1">
                                            {pat.keyRule}
                                          </div>
                                        )}

                                        {/* Actions: Problem Drawer & Visualizer */}
                                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                          <button
                                            onClick={() => handleOpenDrawer(pat.title, pat.description, pat.problemIds)}
                                            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                          >
                                            <BookOpen className="h-3 w-3" />
                                            <span>
                                              {pat.problemIds.length} Practice {pat.problemIds.length === 1 ? 'Problem' : 'Problems'}
                                            </span>
                                            {solvedCount > 0 && (
                                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                                ({solvedCount}/{pat.problemIds.length})
                                              </span>
                                            )}
                                          </button>

                                          <div className="flex items-center gap-2">
                                            {pat.visualizerId && (
                                              <a
                                                href={`/visualizers`}
                                                className="flex items-center gap-1 font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                                title="Open algorithm visualizer"
                                              >
                                                <Play className="h-2.5 w-2.5" />
                                                <span>Visualizer</span>
                                              </a>
                                            )}
                                            {isComplete && (
                                              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]" title="All problems solved">
                                                <CheckCircle2 className="h-3 w-3" />
                                              </span>
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
