import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Scan, 
  Search, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles,
  Layers,
  FolderOpen,
  Folder,
  Globe,
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

  // View Mode: 'whimsical-embed' (Original Whimsical Canvas) vs 'interactive-tree' (Native Tree with Problems)
  const [viewMode, setViewMode] = useState<'whimsical-embed' | 'interactive-tree'>('whimsical-embed');

  // Sync with activePortal if changed
  useEffect(() => {
    setVariant(activePortal === 'lpu' ? 'lpu' : 'global');
  }, [activePortal]);

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

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Modals & Drawer
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerNode, setDrawerNode] = useState<{ id: string; title: string; description: string; problemIds: string[] } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Canvas Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [pan, setPan] = useState({ x: 40, y: 30 });
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
    setZoomLevel(0.8);
    setPan({ x: 40, y: 30 });
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
    <div className={`relative w-full bg-slate-50 dark:bg-[#090b10] flex flex-col overflow-hidden transition-all duration-200 ${
      fitScreen ? 'flex-1 min-h-0 h-full rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl' : 'h-[850px] rounded-2xl border border-slate-200 dark:border-slate-800'
    }`}>
      {/* ───── Top Controls Bar ───── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dual View Mode: Live Whimsical Embed vs Interactive Mind Map */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('whimsical-embed')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                viewMode === 'whimsical-embed'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Live Whimsical Board</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Original</span>
            </button>
            <button
              onClick={() => setViewMode('interactive-tree')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                viewMode === 'interactive-tree'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Mind Map</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Practice Sync</span>
            </button>
          </div>

          {/* If in interactive-tree mode: allow toggling Global vs LPU */}
          {viewMode === 'interactive-tree' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setVariant('global')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  variant === 'global'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Global Patterns
              </button>
              <button
                onClick={() => setVariant('lpu')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  variant === 'lpu'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                LPU Syllabus
              </button>
            </div>
          )}

          {viewMode === 'interactive-tree' && (
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
          )}

          {viewMode === 'interactive-tree' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
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
          )}
        </div>

        {/* Right Info & External Link */}
        <div className="flex items-center gap-2">
          {viewMode === 'whimsical-embed' ? (
            <a
              href="https://whimsical.com/dsa-patterns-47DQdVg8MiLZ1idPyveWFr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-100 transition shadow-sm"
            >
              <span>Open in Whimsical</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter pattern..."
                  className="pl-8 pr-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40 sm:w-48"
                />
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Solved:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalPatternProblems.solved} / {totalPatternProblems.total}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───── VIEW 1: LIVE ORIGINAL WHIMSICAL BOARD EMBED ───── */}
      {viewMode === 'whimsical-embed' && (
        <div className="relative flex-1 min-h-0 w-full h-full bg-slate-100 dark:bg-[#12151e]">
          <iframe
            src="https://whimsical.com/embed/47DQdVg8MiLZ1idPyveWFr?key=0"
            title="Whimsical DSA Patterns Board"
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>
      )}

      {/* ───── VIEW 2: INTERACTIVE PRACTICE MIND MAP WITH HORIZONTAL BRANCHING ───── */}
      {viewMode === 'interactive-tree' && (
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
          {/* Scaled & Panned 2D Canvas */}
          <div
            className="absolute origin-top-left transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            }}
          >
            {/* Horizontal Tree Fan-Out */}
            <div className="flex items-start gap-16 py-8 pr-20 min-w-max">
              {/* Central Root Card (DSA Patterns CodeWithNishchal) */}
              <div className="sticky top-1/2 -translate-y-1/2 shrink-0 z-20">
                <div className="w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-xl flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    DSA Patterns Mind Map
                  </span>
                  <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {variant === 'global' ? 'DSA Patterns' : 'LPU Academic Curricula'}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {variant === 'global' 
                      ? '(CodeWithNishchal)' 
                      : '(CSE205 & CSE202 Syllabi)'}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    Click colored pills to expand branches
                  </div>
                </div>
              </div>

              {/* Category Columns */}
              <div className="flex flex-col gap-5 relative">
                {categories.map((cat) => {
                  const isCatExpanded = expandedCategories.has(cat.id);

                  return (
                    <div key={cat.id} className="flex items-start gap-8 relative group">
                      {/* Category Pill Button */}
                      <div className="shrink-0 z-10">
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition shadow-sm hover:shadow ${
                            isCatExpanded
                              ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {cat.title}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shrink-0"
                            style={{ backgroundColor: cat.color }}
                          >
                            {cat.count}
                          </span>
                        </button>
                      </div>

                      {/* Sub-Pattern Children (Branching to the Right) */}
                      {isCatExpanded && (
                        <div className="flex flex-col gap-3 pl-4 border-l-2" style={{ borderColor: cat.color }}>
                          {cat.subPatterns.map((sub) => {
                            const isSubExpanded = expandedSubPatterns.has(sub.id);

                            return (
                              <div key={sub.id} className="flex items-start gap-6 relative">
                                <div className="shrink-0 z-10">
                                  <button
                                    onClick={() => toggleSubPattern(sub.id)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition ${
                                      isSubExpanded
                                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <span>{sub.title}</span>
                                    <span 
                                      className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold text-white"
                                      style={{ backgroundColor: cat.color }}
                                    >
                                      {sub.patterns.length}
                                    </span>
                                  </button>
                                </div>

                                {/* Leaf Pattern Cards */}
                                {isSubExpanded && (
                                  <div className="flex flex-col gap-2 pl-3 border-l border-slate-300 dark:border-slate-700">
                                    {sub.patterns.map((pat) => {
                                      const solvedCount = pat.problemIds.filter(
                                        (id) => problemProgress[id]?.status === 'SOLVED'
                                      ).length;
                                      const isComplete = pat.problemIds.length > 0 && solvedCount === pat.problemIds.length;

                                      return (
                                        <div
                                          key={pat.id}
                                          className={`p-2.5 rounded-xl border bg-white dark:bg-slate-900 shadow-sm w-72 sm:w-80 flex flex-col gap-1.5 text-xs ${
                                            isComplete
                                              ? 'border-emerald-500/50 bg-emerald-500/5'
                                              : 'border-slate-200 dark:border-slate-800'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-1">
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

                                          {pat.keyRule && (
                                            <div className="text-[10px] font-mono p-1 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 line-clamp-1">
                                              {pat.keyRule}
                                            </div>
                                          )}

                                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                                            <button
                                              onClick={() => handleOpenDrawer(pat.title, pat.description, pat.problemIds)}
                                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                              {pat.problemIds.length} Practice Problems
                                            </button>

                                            {pat.visualizerId && (
                                              <a
                                                href="/visualizers"
                                                className="flex items-center gap-1 font-semibold text-indigo-500 hover:text-indigo-600"
                                              >
                                                <Play className="h-2.5 w-2.5" />
                                                <span>Visualizer</span>
                                              </a>
                                            )}
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
      )}

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
