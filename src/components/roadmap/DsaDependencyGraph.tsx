import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Scan, 
  Shuffle, 
  Move,
  GitFork
} from 'lucide-react';
import { PROBLEMS } from '../../data/problems';
import { useUserStore } from '../../store/userStore';
import type { Problem, ProblemStatus } from '../../types';
import { ProblemModal } from '../problems/ProblemModal';
import { TopicDrawer } from './TopicDrawer';

interface NodeData {
  id: string;
  title: string;
  x: number;
  y: number;
  topicTags: string[];
  visualizerId?: string;
  description: string;
  prerequisites?: string[];
}

interface EdgeData {
  from: string;
  to: string;
  isDotted?: boolean;
}

// ───── Core DSA Interactive Dependency Flowchart Coordinates ─────
export const GRAPH_NODES: NodeData[] = [
  // Level 0
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    x: 442,
    y: 35,
    topicTags: ['arrays', 'hashing', 'traversal'],
    description: 'Core arrays, hash sets, hash maps, and linear frequency tracking.',
    prerequisites: ['Basic variables & loops', 'Arrays & indexing'],
  },

  // Level 1
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    x: 330,
    y: 125,
    topicTags: ['arrays', 'two-pointers'],
    description: 'Inward and outward pointer traversal paradigms on linear collections.',
    prerequisites: ['Arrays & Hashing'],
  },
  {
    id: 'stack',
    title: 'Stack',
    x: 554,
    y: 125,
    visualizerId: 'stack-operations',
    topicTags: ['stack', 'monotonic-stack'],
    description: 'LIFO execution stack, expression evaluation, and monotonic stacks.',
    prerequisites: ['Arrays & Hashing'],
  },

  // Level 2
  {
    id: 'binary-search',
    title: 'Binary Search',
    x: 170,
    y: 215,
    visualizerId: 'binary-search',
    topicTags: ['searching', 'binary-search'],
    description: 'Divide-and-conquer on sorted ranges and search-on-answer spaces.',
    prerequisites: ['Arrays & Hashing', 'Two Pointers'],
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    x: 370,
    y: 215,
    topicTags: ['arrays', 'two-pointers'],
    description: 'Dynamic subarray and substring window expansion and contraction.',
    prerequisites: ['Two Pointers'],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    x: 570,
    y: 215,
    visualizerId: 'singly-linked-list',
    topicTags: ['linked-list', 'pointers'],
    description: 'Singly, doubly, and circular node structures with pointer rewiring.',
    prerequisites: ['Two Pointers', 'Pointers / References'],
  },

  // Level 3 (Trees convergence)
  {
    id: 'trees',
    title: 'Trees',
    x: 430,
    y: 310,
    visualizerId: 'bst-insert',
    topicTags: ['trees', 'bst', 'traversal'],
    description: 'Binary trees, BST invariants, DFS traversals, and level order BFS.',
    prerequisites: ['Binary Search', 'Sliding Window', 'Linked List'],
  },

  // Level 4
  {
    id: 'tries',
    title: 'Tries',
    x: 190,
    y: 405,
    topicTags: ['trees', 'strings'],
    description: 'Prefix trees for efficient dictionary retrieval and autocomplete.',
    prerequisites: ['Trees'],
  },
  {
    id: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    x: 355,
    y: 485,
    visualizerId: 'heap-sort',
    topicTags: ['heaps', 'priority-queue', 'heap-sort'],
    description: 'Min/Max heaps, priority queues, and top-K frequent patterns.',
    prerequisites: ['Trees'],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    x: 575,
    y: 405,
    visualizerId: 'n-queens',
    topicTags: ['recursion', 'backtracking'],
    description: 'Systematic state space tree exploration with pruning.',
    prerequisites: ['Trees', 'Recursion'],
  },

  // Level 5
  {
    id: 'intervals',
    title: 'Intervals',
    x: 90,
    y: 580,
    topicTags: ['arrays', 'sorting'],
    description: 'Merging, inserting, and detecting overlapping time intervals.',
    prerequisites: ['Heap / Priority Queue', 'Sorting'],
  },
  {
    id: 'greedy',
    title: 'Greedy',
    x: 265,
    y: 585,
    topicTags: ['greedy', 'arrays'],
    description: 'Making locally optimal choices to achieve global optimization.',
    prerequisites: ['Heap / Priority Queue'],
  },
  {
    id: 'advanced-graphs',
    title: 'Advanced Graphs',
    x: 440,
    y: 585,
    visualizerId: 'dijkstra',
    topicTags: ['graphs', 'dijkstra', 'bellman-ford'],
    description: 'Shortest path algorithms: Dijkstra, Bellman-Ford, and Prim/Kruskal MST.',
    prerequisites: ['Heap / Priority Queue', 'Graphs'],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    x: 580,
    y: 495,
    visualizerId: 'bfs',
    topicTags: ['graphs', 'bfs', 'dfs'],
    description: 'Adjacency structures, BFS layer traversal, and DFS cycle detection.',
    prerequisites: ['Backtracking', 'Trees'],
  },
  {
    id: '1d-dp',
    title: '1-D Dynamic Programming',
    x: 760,
    y: 495,
    visualizerId: 'fibonacci-dp',
    topicTags: ['dynamic-programming'],
    description: 'Optimal substructure and memoization on linear state arrays.',
    prerequisites: ['Backtracking', 'Recursion'],
  },

  // Level 6
  {
    id: '2d-dp',
    title: '2-D Dynamic Programming',
    x: 615,
    y: 610,
    visualizerId: 'lcs',
    topicTags: ['dynamic-programming'],
    description: 'Grid-based dynamic programming, LCS, Knapsack, and matrix states.',
    prerequisites: ['1-D Dynamic Programming', 'Graphs'],
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    x: 795,
    y: 610,
    topicTags: ['bit-manipulation', 'math'],
    description: 'Bitwise AND, OR, XOR, shifts, two\'s complement, and mask tracking.',
    prerequisites: ['1-D Dynamic Programming', 'Binary math'],
  },

  // Level 7 (Bottom)
  {
    id: 'math-geometry',
    title: 'Math & Geometry',
    x: 705,
    y: 705,
    topicTags: ['math', 'geometry'],
    description: 'GCD, modular arithmetic, matrix rotations, and computational geometry.',
    prerequisites: ['2-D Dynamic Programming', 'Bit Manipulation'],
  },
];

const GRAPH_EDGES: EdgeData[] = [
  // Arrays & Hashing -> Two Pointers & Stack
  { from: 'arrays-hashing', to: 'two-pointers', isDotted: true },
  { from: 'arrays-hashing', to: 'stack', isDotted: false },

  // Two Pointers -> Binary Search, Sliding Window, Linked List
  { from: 'two-pointers', to: 'binary-search', isDotted: false },
  { from: 'two-pointers', to: 'sliding-window', isDotted: false },
  { from: 'two-pointers', to: 'linked-list', isDotted: true },

  // Convergence into Trees
  { from: 'binary-search', to: 'trees', isDotted: false },
  { from: 'sliding-window', to: 'trees', isDotted: false },
  { from: 'linked-list', to: 'trees', isDotted: false },

  // Trees -> Tries, Heap, Backtracking
  { from: 'trees', to: 'tries', isDotted: false },
  { from: 'trees', to: 'heap-priority-queue', isDotted: false },
  { from: 'trees', to: 'backtracking', isDotted: false },

  // Heap -> Intervals, Greedy, Advanced Graphs
  { from: 'heap-priority-queue', to: 'intervals', isDotted: false },
  { from: 'heap-priority-queue', to: 'greedy', isDotted: false },
  { from: 'heap-priority-queue', to: 'advanced-graphs', isDotted: false },

  // Backtracking -> Graphs, 1-D DP
  { from: 'backtracking', to: 'graphs', isDotted: false },
  { from: 'backtracking', to: '1d-dp', isDotted: false },

  // Graphs -> Advanced Graphs, 2-D DP
  { from: 'graphs', to: 'advanced-graphs', isDotted: false },
  { from: 'graphs', to: '2d-dp', isDotted: false },

  // 1-D DP -> 2-D DP, Bit Manipulation
  { from: '1d-dp', to: '2d-dp', isDotted: false },
  { from: '1d-dp', to: 'bit-manipulation', isDotted: false },

  // Convergence into Math & Geometry
  { from: '2d-dp', to: 'math-geometry', isDotted: false },
  { from: 'bit-manipulation', to: 'math-geometry', isDotted: false },
];

interface DsaDependencyGraphProps {
  fitScreen?: boolean;
}

export const DsaDependencyGraph: React.FC<DsaDependencyGraphProps> = ({ fitScreen = true }) => {
  const { problemProgress, updateProblemStatus, bookmarks, toggleBookmark } = useUserStore();
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(GRAPH_NODES[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Pan & Zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fit to screen calculator for all window sizes
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth <= 0 || clientHeight <= 0) return;

    const graphWidth = 1000;
    const graphHeight = 820;
    const paddingX = clientWidth < 640 ? 20 : 48;
    const paddingY = clientHeight < 640 ? 30 : 60;

    const scaleX = (clientWidth - paddingX) / graphWidth;
    const scaleY = (clientHeight - paddingY) / graphHeight;
    const optimalZoom = Math.min(1.25, Math.max(0.35, Math.min(scaleX, scaleY)));

    setZoomLevel(Number(optimalZoom.toFixed(2)));
    setPan({ x: 0, y: 0 });
  }, []);

  // Auto-fit on mount and window resize
  useEffect(() => {
    fitToScreen();
    const handleResize = () => {
      fitToScreen();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToScreen]);

  // Non-passive native wheel listener to zoom roadmap only (prevents browser/webpage zoom & document scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent browser from zooming the webpage and from scrolling the page
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      // Trackpad pinch (ctrlKey) vs standard mouse wheel
      const zoomFactor = e.ctrlKey ? 0.015 : 0.08;
      const zoomDelta = e.deltaY < 0 ? zoomFactor : -zoomFactor;

      setZoomLevel((prevZoom) => {
        const nextZoom = Math.min(2.0, Math.max(0.35, Number((prevZoom + zoomDelta).toFixed(2))));
        if (nextZoom === prevZoom) return prevZoom;

        // Cursor-centric focal zoom: keep position under mouse stable
        const scaleRatio = nextZoom / prevZoom;
        setPan((prevPan) => ({
          x: Math.round(mouseX - (mouseX - prevPan.x) * scaleRatio),
          y: Math.round(mouseY - (mouseY - prevPan.y) * scaleRatio),
        }));

        return nextZoom;
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Map problems for each node
  const nodeProblemsMap = useMemo(() => {
    const map: Record<string, Problem[]> = {};
    GRAPH_NODES.forEach((node) => {
      map[node.id] = PROBLEMS.filter((p) =>
        p.topicTags.some((tag) => node.topicTags.includes(tag))
      );
    });
    return map;
  }, []);

  // Backward DAG trace calculation on hover
  const hoveredPrereqTrace = useMemo(() => {
    if (!hoveredNodeId) return null;
    const ancestorIds = new Set<string>([hoveredNodeId]);
    const activeEdgeKeys = new Set<string>();

    const queue = [hoveredNodeId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const edge of GRAPH_EDGES) {
        if (edge.to === curr) {
          activeEdgeKeys.add(`${edge.from}->${edge.to}`);
          if (!ancestorIds.has(edge.from)) {
            ancestorIds.add(edge.from);
            queue.push(edge.from);
          }
        }
      }
    }

    const pathNodes = GRAPH_NODES.filter((n) => ancestorIds.has(n.id));
    const sortedAncestors = [...pathNodes].sort((a, b) => a.y - b.y);

    return {
      targetId: hoveredNodeId,
      ancestorIds,
      activeEdgeKeys,
      sortedAncestors,
    };
  }, [hoveredNodeId]);

  // Total roadmap stats
  const totalRoadmapStats = useMemo(() => {
    const allProblems = PROBLEMS;
    const solved = allProblems.filter((p) => problemProgress[p.id]?.status === 'SOLVED').length;
    return {
      total: allProblems.length,
      solved,
      percent: allProblems.length > 0 ? Math.round((solved / allProblems.length) * 100) : 0,
    };
  }, [problemProgress]);

  // Compute node progress
  const getNodeStats = (nodeId: string) => {
    const problems = nodeProblemsMap[nodeId] || [];
    const solved = problems.filter((p) => problemProgress[p.id]?.status === 'SOLVED').length;
    return {
      total: problems.length,
      solved,
      percent: problems.length > 0 ? Math.round((solved / problems.length) * 100) : 0,
    };
  };

  // Node center coordinate calculation
  const getNodeCoord = (id: string) => {
    const node = GRAPH_NODES.find((n) => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + 78, // half of node card width (156/2)
      y: node.y + 24, // half of node card height (48/2)
    };
  };

  // Cubic bezier path generation
  const createSmoothPath = (fromId: string, toId: string) => {
    const start = getNodeCoord(fromId);
    const end = getNodeCoord(toId);
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  };

  // Pan & Zoom Event Handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = newDist / touchStartRef.current.dist;
      setZoomLevel((z) => Math.min(1.5, Math.max(0.55, Number((z * scaleFactor).toFixed(2)))));
      touchStartRef.current.dist = newDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Pick Random Problem
  const handlePickRandomProblem = () => {
    const all = PROBLEMS;
    const unsolved = all.filter((p) => problemProgress[p.id]?.status !== 'SOLVED');
    const pool = unsolved.length > 0 ? unsolved : all;
    const random = pool[Math.floor(Math.random() * pool.length)];

    const targetNode = GRAPH_NODES.find((node) =>
      nodeProblemsMap[node.id]?.some((p) => p.id === random.id)
    );

    if (targetNode) {
      setSelectedNode(targetNode);
      setDrawerOpen(true);
    }
    setSelectedProblem(random);
  };

  const handleToggleStatus = (problemId: string) => {
    const current = problemProgress[problemId]?.status || 'NOT_STARTED';
    const next: ProblemStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    updateProblemStatus(problemId, next);
  };

  return (
    <div className={`relative w-full bg-slate-50 dark:bg-[#0c0e14] overflow-hidden transition-all duration-200 flex flex-col ${
      fitScreen
        ? 'flex-1 min-h-0 h-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl'
        : 'rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl'
    }`}>
      {/* Top Controls & Stats Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md z-20 relative shrink-0 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
            <GitFork className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Core DSA Prerequisite Flowchart</span>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                Interactive Graph
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              Drag to pan &bull; Scroll to zoom &bull; Click node to open problem drawer
            </p>
          </div>
        </div>

        {/* Right side controls: Zoom, Shuffle, Solved stats */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom & Screen Fit Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={fitToScreen}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-800 transition text-[11px] font-semibold"
              title="Fit entire roadmap into current window"
              aria-label="Fit to window"
            >
              <Scan className="h-3 w-3 text-brand-600 dark:text-brand-400" />
              <span>Fit</span>
            </button>
            <button
              onClick={handleReset}
              className="px-1.5 py-0.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition text-[11px] font-semibold"
              title="Reset Zoom to 100%"
              aria-label="Reset zoom"
            >
              100%
            </button>
          </div>

          <button
            onClick={handlePickRandomProblem}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm transition"
            title="Pick a random problem to solve"
          >
            <Shuffle className="h-3 w-3 text-brand-600 dark:text-brand-400" />
            <span className="hidden xs:inline">Shuffle</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Solved:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {totalRoadmapStats.solved}/{totalRoadmapStats.total}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              ({totalRoadmapStats.percent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Prerequisite Trace-Back Breadcrumb Banner (In Normal Layout Flow - Never Overlaps Controls) */}
      {hoveredPrereqTrace && (
        <div className="w-full flex items-center justify-between gap-2 px-3 py-1.5 sm:px-4 border-b border-sky-300 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-950/70 text-xs backdrop-blur-sm z-20 shrink-0 animate-in fade-in duration-150 overflow-x-auto scrollbar-none transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1 font-bold text-sky-700 dark:text-sky-400 shrink-0">
              <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />
              <span>Prerequisites:</span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {hoveredPrereqTrace.sortedAncestors.map((anc, idx) => {
                const isTarget = anc.id === hoveredPrereqTrace.targetId;
                return (
                  <React.Fragment key={anc.id}>
                    {idx > 0 && <span className="text-sky-500 dark:text-sky-400 font-bold text-xs">➔</span>}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
                        isTarget
                          ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-400'
                          : 'bg-white dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/40 shadow-xs'
                      }`}
                    >
                      {anc.title}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium shrink-0 pl-1">
            {hoveredPrereqTrace.sortedAncestors.length - 1 === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">🌟 Starting Root</span>
            ) : (
              <span>
                ({hoveredPrereqTrace.sortedAncestors.length - 1} required)
              </span>
            )}
          </span>
        </div>
      )}

      {/* Main Flowchart Canvas Area with Fluid Drag-to-Pan */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full relative flex justify-center items-center select-none overflow-hidden transition-colors duration-200 bg-slate-100/80 dark:bg-[#0a0d14] ${
          fitScreen
            ? 'flex-1 min-h-[380px] h-full'
            : 'h-[72vh] min-h-[500px] max-h-[850px]'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundImage: 'radial-gradient(circle, var(--grid-dot-color, rgba(148, 163, 184, 0.4)) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          touchAction: 'none',
        }}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredNodeId(null);
        }}
      >
        <div 
          className="relative transition-transform duration-75 origin-center will-change-transform"
          style={{ 
            width: '1000px', 
            height: '800px',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* SVG Connecting Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <filter id="dsa-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {GRAPH_EDGES.map((edge, idx) => {
              const pathData = createSmoothPath(edge.from, edge.to);
              const edgeKey = `${edge.from}->${edge.to}`;
              const isPrereqEdge = hoveredPrereqTrace?.activeEdgeKeys.has(edgeKey);
              const isDimmed = hoveredPrereqTrace && !isPrereqEdge;
              const isSelectedEdge =
                selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill="none"
                  stroke={
                    isPrereqEdge
                      ? '#0284c7'
                      : isDimmed
                      ? '#cbd5e1'
                      : isSelectedEdge
                      ? '#6366f1'
                      : edge.isDotted
                      ? '#818cf8'
                      : '#94a3b8'
                  }
                  strokeWidth={isPrereqEdge ? 3.5 : isDimmed ? 1.5 : isSelectedEdge ? 2.5 : 2}
                  strokeDasharray={edge.isDotted ? '4,4' : undefined}
                  filter={isPrereqEdge ? 'url(#dsa-neon-glow)' : undefined}
                  opacity={isDimmed ? 0.2 : 1}
                  className="transition-all duration-200 dark:stroke-[color] dark:[&:not([filter])]:stroke-slate-700"
                />
              );
            })}
          </svg>

          {/* Node Cards */}
          {GRAPH_NODES.map((node) => {
            const stats = getNodeStats(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isAllSolved = stats.total > 0 && stats.solved === stats.total;

            const isHovered = hoveredNodeId === node.id;
            const isAncestor = hoveredPrereqTrace?.ancestorIds.has(node.id);
            const isDimmedNode = hoveredPrereqTrace && !isAncestor;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onClick={() => {
                  setSelectedNode(node);
                  setDrawerOpen(true);
                }}
                className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  isHovered
                    ? 'z-40 scale-105'
                    : isAncestor
                    ? 'z-30 scale-102'
                    : 'z-10'
                } ${isDimmedNode ? 'opacity-25 filter grayscale-[40%]' : 'opacity-100'}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '156px',
                }}
              >
                {/* Absolute Badge for Target or Prerequisite */}
                {isHovered ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-md shadow-brand-500/30 whitespace-nowrap z-50 pointer-events-none">
                    Target
                  </span>
                ) : isAncestor ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-400/40 whitespace-nowrap z-50 pointer-events-none">
                    Prereq
                  </span>
                ) : null}

                {/* Node Pill Card */}
                <div
                  className={`w-full py-2.5 px-2.5 rounded-xl border text-center transition-all duration-200 shadow-md ${
                    isHovered
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-400 text-brand-900 shadow-brand-500/20 dark:bg-[#252f52] dark:border-brand-400 dark:ring-brand-400/80 dark:shadow-brand-500/40 dark:text-white'
                      : isAncestor
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400/60 text-sky-900 shadow-sky-500/15 dark:bg-[#15233b] dark:border-sky-400 dark:text-white'
                      : isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-[#252f52] dark:border-brand-400 dark:text-white'
                      : isAllSolved
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 dark:bg-[#152e25] dark:border-emerald-500/50 dark:text-white'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-brand-400 hover:shadow-lg dark:bg-[#1a2035] dark:border-[#313c5e] dark:text-white dark:hover:bg-[#202742] dark:hover:border-slate-500'
                  }`}
                >
                  <span className="text-[11.5px] font-bold tracking-tight leading-snug block text-center break-words">
                    {node.title}
                  </span>

                  {/* Underline Progress Bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-200 dark:bg-[#121626] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isAllSolved
                          ? 'bg-emerald-500'
                          : isHovered || isSelected
                          ? 'bg-brand-500'
                          : isAncestor
                          ? 'bg-sky-500'
                          : 'bg-indigo-500 dark:bg-indigo-400/80'
                      }`}
                      style={{ width: `${Math.max(15, stats.percent)}%` }}
                    />
                  </div>
                </div>

                {/* Micro Solved Counter */}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 opacity-80 group-hover:opacity-100">
                  {stats.solved}/{stats.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Right-Side Slide-Over Problem Drawer */}
      {selectedNode && (
        <TopicDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedNode.title}
          description={selectedNode.description}
          category="Core DSA Topic"
          prerequisites={selectedNode.prerequisites}
          visualizerId={selectedNode.visualizerId}
          problems={nodeProblemsMap[selectedNode.id] || []}
          problemProgress={problemProgress}
          bookmarks={bookmarks}
          onToggleStatus={handleToggleStatus}
          onToggleBookmark={toggleBookmark}
          onOpenProblemModal={setSelectedProblem}
        />
      )}

      {/* Problem Modal for details & notes */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
};
