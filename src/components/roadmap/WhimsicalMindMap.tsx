import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Search,
  Sparkles,
  FolderOpen,
  Folder,
  X,
  BookOpen,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { WHIMSICAL_DSA_TREE, type WhimsicalTreeNode } from '../../data/whimsicalDsaTreeData';
import { PROBLEMS } from '../../data/problems';
import { useUserStore } from '../../store/userStore';
import { TopicDrawer } from './TopicDrawer';
import { ProblemModal } from '../problems/ProblemModal';
import type { Problem, ProblemStatus } from '../../types';

interface PositionedNode {
  id: string;
  title: string;
  color: string;
  count?: number;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  problemIds?: string[];
  keyRule?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  totalHeight?: number;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  children: PositionedNode[];
  parent?: PositionedNode;
}

interface PathConnection {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
}

interface WhimsicalMindMapProps {
  fitScreen?: boolean;
}

export const WhimsicalMindMap: React.FC<WhimsicalMindMapProps> = ({ fitScreen = true }) => {
  const { problemProgress, updateProblemStatus, bookmarks, toggleBookmark } = useUserStore();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  // Root tree data
  const treeData = WHIMSICAL_DSA_TREE;

  // Problems lookup
  const problemsMap = useMemo(() => {
    const map = new Map<string, Problem>();
    for (const prob of PROBLEMS) {
      map.set(prob.id, prob);
    }
    return map;
  }, []);

  // Track expanded node IDs. By default expand categories for immediate visual richness
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Default: expand all categories and their first subtopics
    treeData.forEach((cat) => {
      initial.add(cat.id);
      if (cat.children) {
        cat.children.forEach((sub) => {
          initial.add(sub.id);
          if (sub.children) {
            sub.children.forEach((leaf) => {
              if (leaf.children) {
                initial.add(leaf.id);
              }
            });
          }
        });
      }
    });
    return initial;
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected pattern for TopicDrawer
  const [drawerNode, setDrawerNode] = useState<{
    id: string;
    title: string;
    description: string;
    problemIds: string[];
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerProblems = useMemo(() => {
    if (!drawerNode || !drawerNode.problemIds) return [];
    return drawerNode.problemIds
      .map((id) => problemsMap.get(id))
      .filter((p): p is Problem => Boolean(p));
  }, [drawerNode, problemsMap]);

  const handleToggleStatus = (problemId: string) => {
    const current = problemProgress[problemId]?.status || 'NOT_STARTED';
    const next: ProblemStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    updateProblemStatus(problemId, next);
  };

  // Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [pan, setPan] = useState({ x: 50, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle expand
  const toggleNode = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedIds((prev) => {
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
  const handleExpandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collect = (nodes: WhimsicalTreeNode[]) => {
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          allIds.add(n.id);
          collect(n.children);
        }
      });
    };
    collect(treeData);
    setExpandedIds(allIds);
  }, [treeData]);

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // Compute problems progress
  const totalStats = useMemo(() => {
    let total = 0;
    let solved = 0;
    const seen = new Set<string>();

    const scan = (nodes: WhimsicalTreeNode[]) => {
      nodes.forEach((n) => {
        if (n.problemIds) {
          n.problemIds.forEach((pid) => {
            if (!seen.has(pid)) {
              seen.add(pid);
              total++;
              if (problemProgress[pid]?.status === 'SOLVED') {
                solved++;
              }
            }
          });
        }
        if (n.children) {
          scan(n.children);
        }
      });
    };
    scan(treeData);
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { total, solved, percentage };
  }, [treeData, problemProgress]);

  // Hierarchical positioning algorithm
  const { positionedRoot, positionedCategories, connections, bounds } = useMemo(() => {
    // Level dimensions
    const LEVEL_WIDTHS = [220, 190, 220, 260, 260];
    const LEVEL_HEIGHTS = [74, 38, 34, 32, 32];
    const LEVEL_X_OFFSETS = [50, 360, 610, 890, 1210];
    const NODE_MARGIN_Y = 12;

    const pathConnections: PathConnection[] = [];

    // Measure vertical height needed for each node
    const measureHeight = (node: WhimsicalTreeNode, level: number): number => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = expandedIds.has(node.id);

      if (!hasChildren || !isExpanded || !node.children) {
        return (LEVEL_HEIGHTS[level] || 32) + NODE_MARGIN_Y;
      }

      let sum = 0;
      node.children.forEach((child) => {
        sum += measureHeight(child, level + 1);
      });
      return Math.max(sum, (LEVEL_HEIGHTS[level] || 32) + NODE_MARGIN_Y);
    };

    // Recursively position nodes
    let maxX = 1200;
    let maxY = 1000;

    const layoutNode = (
      node: WhimsicalTreeNode,
      level: number,
      startY: number,
      totalHeight: number,
      parent?: PositionedNode
    ): PositionedNode => {
      const width = LEVEL_WIDTHS[level] || 220;
      const height = LEVEL_HEIGHTS[level] || 32;
      const x = LEVEL_X_OFFSETS[level] || (parent ? parent.x + 240 : 50);

      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = expandedIds.has(node.id);

      const positionedChildren: PositionedNode[] = [];
      let calculatedY: number;

      if (hasChildren && isExpanded && node.children && node.children.length > 0) {
        let currentChildY = startY;

        node.children.forEach((child) => {
          const childH = measureHeight(child, level + 1);
          const posChild = layoutNode(child, level + 1, currentChildY, childH);
          positionedChildren.push(posChild);
          currentChildY += childH;
        });

        // Parent center Y is midpoint of first and last child centers
        const firstCenter = positionedChildren[0].y;
        const lastCenter = positionedChildren[positionedChildren.length - 1].y;
        calculatedY = Math.round((firstCenter + lastCenter) / 2);
      } else {
        calculatedY = Math.round(startY + totalHeight / 2);
      }

      const posNode: PositionedNode = {
        id: node.id,
        title: node.title,
        color: node.color,
        count: node.count,
        description: node.description,
        difficulty: node.difficulty,
        problemIds: node.problemIds,
        keyRule: node.keyRule,
        x,
        y: calculatedY,
        width,
        height,
        totalHeight,
        level,
        hasChildren,
        isExpanded,
        children: positionedChildren,
        parent,
      };

      // Set parent references on children and generate connections
      posNode.children.forEach((child) => {
        child.parent = posNode;
        pathConnections.push({
          id: `${posNode.id}->${child.id}`,
          startX: posNode.x + posNode.width + 4,
          startY: posNode.y,
          endX: child.x - 4,
          endY: child.y,
          color: child.color || posNode.color,
          strokeWidth: level === 0 ? 3 : level === 1 ? 2.5 : 2,
        });
      });

      if (x + width > maxX) maxX = x + width;
      if (calculatedY + height > maxY) maxY = calculatedY + height;

      return posNode;
    };

    // Position Categories
    let currentCatY = 60;
    const catPositions: PositionedNode[] = [];

    treeData.forEach((cat) => {
      const catH = measureHeight(cat, 1);
      const posCat = layoutNode(cat, 1, currentCatY, catH);
      catPositions.push(posCat);
      currentCatY += catH + 18; // Spacing between categories
    });

    // Root Node (DSA Patterns)
    const rootCenterY = Math.round(
      (catPositions[0].y + catPositions[catPositions.length - 1].y) / 2
    );

    const rootNode: PositionedNode = {
      id: 'root-dsa-patterns',
      title: 'DSA Patterns',
      color: '#6366f1',
      x: LEVEL_X_OFFSETS[0],
      y: rootCenterY,
      width: LEVEL_WIDTHS[0],
      height: LEVEL_HEIGHTS[0],
      totalHeight: LEVEL_HEIGHTS[0],
      level: 0,
      hasChildren: true,
      isExpanded: true,
      children: catPositions,
    };

    // Connections from Root to Categories
    catPositions.forEach((cat) => {
      pathConnections.push({
        id: `root->${cat.id}`,
        startX: rootNode.x + rootNode.width + 4,
        startY: rootNode.y,
        endX: cat.x - 4,
        endY: cat.y,
        color: cat.color,
        strokeWidth: 3,
      });
    });

    return {
      positionedRoot: rootNode,
      positionedCategories: catPositions,
      connections: pathConnections,
      bounds: { width: maxX + 200, height: Math.max(maxY + 150, currentCatY + 100) },
    };
  }, [treeData, expandedIds]);

  // Open drawer for pattern details
  const handleOpenPattern = (node: PositionedNode) => {
    setDrawerNode({
      id: node.id,
      title: node.title,
      description: node.description || `${node.title} pattern and problem set.`,
      problemIds: node.problemIds || [],
    });
    setIsDrawerOpen(true);
  };

  // Mouse pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if not clicking interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('.interactive-node')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoomLevel((z) => Math.min(1.8, Math.max(0.25, Number((z * zoomFactor).toFixed(2)))));
    } else {
      setPan((p) => ({
        x: p.x - e.deltaX,
        y: p.y - e.deltaY,
      }));
    }
  };

  const handleResetView = () => {
    setZoomLevel(0.8);
    setPan({ x: 60, y: 30 });
  };

  // Check if a node matches search query
  const queryLower = searchQuery.trim().toLowerCase();
  const isMatch = (node: PositionedNode) => {
    if (!queryLower) return false;
    return (
      node.title.toLowerCase().includes(queryLower) ||
      (node.description && node.description.toLowerCase().includes(queryLower)) ||
      (node.keyRule && node.keyRule.toLowerCase().includes(queryLower))
    );
  };

  // Auto-expand nodes that match search
  useEffect(() => {
    if (!queryLower) return;
    const matchingAncestors = new Set<string>();

    const searchRec = (node: WhimsicalTreeNode, path: string[]) => {
      const match = node.title.toLowerCase().includes(queryLower);
      if (match) {
        path.forEach((id) => matchingAncestors.add(id));
      }
      if (node.children) {
        node.children.forEach((c) => searchRec(c, [...path, node.id]));
      }
    };

    treeData.forEach((cat) => searchRec(cat, [cat.id]));

    if (matchingAncestors.size > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        matchingAncestors.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [queryLower, treeData]);

  // Render all nodes recursively
  const renderNode = (node: PositionedNode): React.ReactNode => {
    const isNodeMatch = isMatch(node);
    const hasChildren = node.hasChildren;
    const isExpanded = node.isExpanded;

    // Difficulty style
    const diffBadge =
      node.difficulty === 'easy'
        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        : node.difficulty === 'hard'
        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20'
        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20';

    // Solved count
    const solvedCount =
      node.problemIds?.filter((pid) => problemProgress[pid]?.status === 'SOLVED').length || 0;
    const totalProblems = node.problemIds?.length || 0;
    const isAllSolved = totalProblems > 0 && solvedCount === totalProblems;

    return (
      <React.Fragment key={node.id}>
        {/* The Node Element */}
        <div
          className={`interactive-node absolute transition-all duration-150 flex items-center select-none ${
            isNodeMatch ? 'ring-2 ring-amber-400 ring-offset-2 z-30' : ''
          }`}
          style={{
            left: `${node.x}px`,
            top: `${node.y - node.height / 2}px`,
            width: `${node.width}px`,
            height: `${node.height}px`,
          }}
        >
          {/* LEVEL 1: Category Nodes (e.g. Array [20] ○) */}
          {node.level === 1 ? (
            <div
              onClick={() => toggleNode(node.id)}
              className={`w-full h-full flex items-center justify-between px-3 rounded-full border transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer ${
                isExpanded
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 ring-2 ring-indigo-500/20'
                  : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: node.color }}
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {node.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {node.count !== undefined && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm"
                    style={{ backgroundColor: node.color }}
                  >
                    {node.count}
                  </span>
                )}
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border transition ${
                    isExpanded
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200'
                  }`}
                >
                  {isExpanded ? '−' : '+'}
                </span>
              </div>
            </div>
          ) : node.level === 2 ? (
            /* LEVEL 2: Sub-Topics (e.g. Two Pointer [3] ○) */
            <div
              onClick={() => (hasChildren ? toggleNode(node.id) : handleOpenPattern(node))}
              className={`w-full h-full flex items-center justify-between px-3 rounded-full border text-xs font-semibold transition-all duration-150 shadow-sm hover:scale-[1.01] cursor-pointer ${
                isExpanded
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="truncate">{node.title}</span>

              {hasChildren ? (
                <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm"
                    style={{ backgroundColor: node.color }}
                    title={`${node.children.length} branches`}
                  >
                    {node.children.length}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border transition shrink-0 ${
                      isExpanded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200'
                    }`}
                  >
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
              ) : (
                totalProblems > 0 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {solvedCount}/{totalProblems}
                  </span>
                )
              )}
            </div>
          ) : hasChildren ? (
            /* LEVEL 3 with sub-branches (e.g. Variable Size [2] ○) */
            <div
              onClick={() => toggleNode(node.id)}
              className={`w-full h-full flex items-center justify-between px-3 rounded-full border text-xs font-semibold transition-all duration-150 shadow-sm hover:scale-[1.01] cursor-pointer ${
                isExpanded
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="truncate">{node.title}</span>
              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm"
                  style={{ backgroundColor: node.color }}
                  title={`${node.children.length} branches`}
                >
                  {node.children.length}
                </span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border transition shrink-0 ${
                    isExpanded
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200'
                  }`}
                >
                  {isExpanded ? '−' : '+'}
                </span>
              </div>
            </div>
          ) : (
            /* LEAF NODES (e.g. Opposite ends (left + right)) */
            <div
              onClick={() => handleOpenPattern(node)}
              className={`group w-full h-full flex items-center justify-between px-3 rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-indigo-500/80 cursor-pointer transition text-xs ${
                isAllSolved
                  ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {isAllSolved ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: node.color }}
                  />
                )}
                <span className="text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium truncate">
                  {node.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {node.difficulty && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${diffBadge}`}>
                    {node.difficulty}
                  </span>
                )}
                {totalProblems > 0 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {solvedCount > 0 ? `${solvedCount}/${totalProblems}` : `${totalProblems}p`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recursively render visible children */}
        {node.children.map((child) => renderNode(child))}
      </React.Fragment>
    );
  };

  return (
    <div
      className={`flex flex-col bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm relative ${
        fitScreen ? 'h-full flex-1 min-h-[640px]' : 'h-[750px]'
      }`}
    >
      {/* ───── TOP TOOLBAR ───── */}
      <div className="p-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-30 shrink-0">
        <div className="flex items-center gap-2">
          {/* Branch Expand/Collapse Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={handleExpandAll}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Expand All Branches"
            >
              <FolderOpen className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Expand All</span>
            </button>
            <button
              onClick={handleCollapseAll}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Collapse All Branches"
            >
              <Folder className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition cursor-pointer"
              title="Reset View"
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
              placeholder="Search patterns..."
              className="pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40 sm:w-52 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Solved:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {totalStats.solved} / {totalStats.total}
            </span>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${totalStats.percentage}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {totalStats.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* ───── INTERACTIVE MIND MAP CANVAS ───── */}
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
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.25) 1.2px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Scaled & Panned Canvas Viewport */}
        <div
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
          }}
        >
          {/* SVG LAYER: Curved Bézier Connection Lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={bounds.width}
            height={bounds.height}
          >
            {connections.map((conn) => {
              const dx = (conn.endX - conn.startX) * 0.5;
              const pathD = `M ${conn.startX} ${conn.startY} C ${conn.startX + dx} ${
                conn.startY
              }, ${conn.endX - dx} ${conn.endY}, ${conn.endX} ${conn.endY}`;

              return (
                <path
                  key={conn.id}
                  d={pathD}
                  fill="none"
                  stroke={conn.color}
                  strokeWidth={conn.strokeWidth}
                  strokeLinecap="round"
                  opacity={0.88}
                />
              );
            })}
          </svg>

          {/* HTML NODE LAYER: Root Node */}
          <div
            className="absolute p-4 rounded-2xl bg-white dark:bg-[#101320] border-2 border-indigo-500/80 shadow-2xl flex flex-col gap-1.5 backdrop-blur-md select-none"
            style={{
              left: `${positionedRoot.x}px`,
              top: `${positionedRoot.y - positionedRoot.height / 2}px`,
              width: `${positionedRoot.width}px`,
              height: `${positionedRoot.height}px`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Mind Map
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                16 Categories
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
              DSA Patterns
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              (Core Algorithmic Taxonomy • 16 Branches)
            </p>
          </div>

          {/* HTML NODE LAYER: Category Nodes & Sub-Branches */}
          {positionedCategories.map((cat) => renderNode(cat))}
        </div>
      </div>

      {/* ───── TOPIC DETAILS DRAWER & PROBLEM MODAL ───── */}
      {drawerNode && (
        <TopicDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={drawerNode.title}
          description={drawerNode.description}
          problems={drawerProblems}
          problemProgress={problemProgress}
          bookmarks={bookmarks}
          onToggleStatus={handleToggleStatus}
          onToggleBookmark={toggleBookmark}
          onOpenProblemModal={(prob) => setSelectedProblem(prob)}
        />
      )}

      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
};
