import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Hourglass, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  X, 
  BookOpen, 
  ChevronRight,
  Compass
} from 'lucide-react';
import { PROBLEMS } from '../../data/problems';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../../data/visualizers';
import { useUserStore } from '../../store/userStore';
import { getDifficultyColor } from '../../lib/utils';
import type { Problem, ProblemStatus } from '../../types';
import { ProblemModal } from '../problems/ProblemModal';

interface NodeData {
  id: string;
  title: string;
  x: number; // percentage or fixed coordinates
  y: number;
  width?: number;
  height?: number;
  topicTags: string[];
  visualizerId?: string;
  description: string;
}

interface EdgeData {
  from: string;
  to: string;
  isDotted?: boolean;
}

// ───── NeetCode Interactive Graph Coordinates ─────
// Precise node coordinates matching the branching flowchart
const GRAPH_NODES: NodeData[] = [
  // Level 0
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    x: 480,
    y: 40,
    topicTags: ['arrays', 'hashing', 'traversal'],
    description: 'Core arrays, hash sets, hash maps, and linear frequency tracking.',
  },

  // Level 1
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    x: 400,
    y: 130,
    topicTags: ['arrays', 'two-pointers'],
    description: 'Inward and outward pointer traversal paradigms on linear collections.',
  },
  {
    id: 'stack',
    title: 'Stack',
    x: 560,
    y: 130,
    visualizerId: 'stack-operations',
    topicTags: ['stack', 'monotonic-stack'],
    description: 'LIFO execution stack, expression evaluation, and monotonic stacks.',
  },

  // Level 2
  {
    id: 'binary-search',
    title: 'Binary Search',
    x: 270,
    y: 220,
    visualizerId: 'binary-search',
    topicTags: ['searching', 'binary-search'],
    description: 'Divide-and-conquer on sorted ranges and search-on-answer spaces.',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    x: 420,
    y: 220,
    topicTags: ['arrays', 'two-pointers'],
    description: 'Dynamic subarray and substring window expansion and contraction.',
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    x: 580,
    y: 220,
    visualizerId: 'singly-linked-list',
    topicTags: ['linked-list', 'pointers'],
    description: 'Singly, doubly, and circular node structures with pointer rewiring.',
  },

  // Level 3 (Trees convergence)
  {
    id: 'trees',
    title: 'Trees',
    x: 420,
    y: 310,
    visualizerId: 'bst-insert',
    topicTags: ['trees', 'bst', 'traversal'],
    description: 'Binary trees, BST invariants, DFS traversals, and level order BFS.',
  },

  // Level 4
  {
    id: 'tries',
    title: 'Tries',
    x: 290,
    y: 400,
    topicTags: ['trees', 'strings'],
    description: 'Prefix trees for efficient dictionary retrieval and autocomplete.',
  },
  {
    id: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    x: 380,
    y: 470,
    visualizerId: 'heap-sort',
    topicTags: ['heaps', 'priority-queue', 'heap-sort'],
    description: 'Min/Max heaps, priority queues, and top-K frequent patterns.',
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    x: 540,
    y: 400,
    visualizerId: 'n-queens',
    topicTags: ['recursion', 'backtracking'],
    description: 'Systematic state space tree exploration with pruning.',
  },

  // Level 5
  {
    id: 'intervals',
    title: 'Intervals',
    x: 170,
    y: 560,
    topicTags: ['arrays', 'sorting'],
    description: 'Merging, inserting, and detecting overlapping time intervals.',
  },
  {
    id: 'greedy',
    title: 'Greedy',
    x: 300,
    y: 590,
    topicTags: ['greedy', 'arrays'],
    description: 'Making locally optimal choices to achieve global optimization.',
  },
  {
    id: 'advanced-graphs',
    title: 'Advanced Graphs',
    x: 430,
    y: 580,
    visualizerId: 'dijkstra',
    topicTags: ['graphs', 'dijkstra', 'bellman-ford'],
    description: 'Shortest path algorithms: Dijkstra, Bellman-Ford, and Prim/Kruskal MST.',
  },
  {
    id: 'graphs',
    title: 'Graphs',
    x: 540,
    y: 490,
    visualizerId: 'bfs',
    topicTags: ['graphs', 'bfs', 'dfs'],
    description: 'Adjacency structures, BFS layer traversal, and DFS cycle detection.',
  },
  {
    id: '1d-dp',
    title: '1-D Dynamic Programming',
    x: 690,
    y: 490,
    visualizerId: 'fibonacci-dp',
    topicTags: ['dynamic-programming'],
    description: 'Optimal substructure and memoization on linear state arrays.',
  },

  // Level 6
  {
    id: '2d-dp',
    title: '2-D Dynamic Programming',
    x: 600,
    y: 610,
    visualizerId: 'lcs',
    topicTags: ['dynamic-programming'],
    description: 'Grid-based dynamic programming, LCS, Knapsack, and matrix states.',
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    x: 770,
    y: 610,
    topicTags: ['bit-manipulation', 'math'],
    description: 'Bitwise AND, OR, XOR, shifts, two\'s complement, and mask tracking.',
  },

  // Level 7 (Bottom)
  {
    id: 'math-geometry',
    title: 'Math & Geometry',
    x: 710,
    y: 700,
    topicTags: ['math', 'geometry'],
    description: 'GCD, modular arithmetic, matrix rotations, and computational geometry.',
  },
];

// Connecting branches matching the screenshot
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

export const NeetCodeGraph: React.FC = () => {
  const { problemProgress, updateProblemStatus } = useUserStore();
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(GRAPH_NODES[0]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState(true);

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
      x: node.x + 65, // half of node card width (130/2)
      y: node.y + 20, // half of node card height (40/2)
    };
  };

  // Cubic bezier path generation
  const createSmoothPath = (fromId: string, toId: string) => {
    const start = getNodeCoord(fromId);
    const end = getNodeCoord(toId);
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-[#0c0e14] overflow-hidden shadow-2xl">
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-semibold px-2"
          title="Reset Zoom"
        >
          Reset ({Math.round(zoomLevel * 100)}%)
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 backdrop-blur-md transition"
        >
          <BookOpen className="h-3.5 w-3.5 text-brand-400" />
          <span>{drawerOpen ? 'Hide Topic Problems' : 'View Topic Problems'}</span>
        </button>
      </div>

      {/* Main Flowchart Canvas Area */}
      <div 
        className="w-full overflow-x-auto overflow-y-auto py-12 px-6 min-h-[750px] relative flex justify-center items-start select-none"
        style={{
          backgroundColor: '#0a0d14',
          backgroundImage: 'radial-gradient(circle, #252b3d 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div 
          className="relative transition-transform duration-200 origin-top"
          style={{ 
            width: '980px', 
            height: '780px',
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* SVG Connecting Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {GRAPH_EDGES.map((edge, idx) => {
              const pathData = createSmoothPath(edge.from, edge.to);
              const isHighlighted =
                selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill="none"
                  stroke={isHighlighted ? '#6366f1' : edge.isDotted ? '#4e73df' : '#333e5c'}
                  strokeWidth={isHighlighted ? 2.5 : 2}
                  strokeDasharray={edge.isDotted ? '4,4' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Node Cards */}
          {GRAPH_NODES.map((node) => {
            const stats = getNodeStats(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isAllSolved = stats.total > 0 && stats.solved === stats.total;

            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNode(node);
                  setDrawerOpen(true);
                }}
                className={`absolute z-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '140px',
                }}
              >
                {/* Node Pill Card */}
                <div
                  className={`w-full py-2.5 px-3 rounded-xl border text-center transition-all duration-200 shadow-xl ${
                    isSelected
                      ? 'bg-[#252f52] border-brand-400 shadow-brand-500/30'
                      : isAllSolved
                      ? 'bg-[#152e25] border-emerald-500/50 hover:border-emerald-400'
                      : 'bg-[#1a2035] border-[#313c5e] hover:bg-[#202742] hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs font-bold text-white tracking-tight leading-tight block truncate">
                    {node.title}
                  </span>

                  {/* Underline Progress Bar matching NeetCode aesthetic */}
                  <div className="mt-1.5 h-1 w-full rounded-full bg-[#121626] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isAllSolved
                          ? 'bg-emerald-400'
                          : isSelected
                          ? 'bg-brand-400'
                          : 'bg-indigo-400/80'
                      }`}
                      style={{ width: `${Math.max(15, stats.percent)}%` }}
                    />
                  </div>
                </div>

                {/* Micro Solved Counter */}
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 opacity-80 group-hover:opacity-100">
                  {stats.solved}/{stats.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-out Topic Problems Panel */}
      {drawerOpen && selectedNode && (
        <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-md p-6 animate-in slide-in-from-bottom duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                  Topic Node
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-400">
                  {getNodeStats(selectedNode.id).solved} of {getNodeStats(selectedNode.id).total} Solved
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {selectedNode.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* External AlgoNerve Visualizer Link */}
              {selectedNode.visualizerId && (
                <a
                  href={getAlgoNerveUrl(selectedNode.visualizerId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition"
                  title="Open interactive visualizer in new tab"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                  <span>Visualize on AlgoNerve ↗</span>
                </a>
              )}

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Problem List inside Drawer */}
          <div className="pt-4">
            {nodeProblemsMap[selectedNode.id]?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No problems tagged for this category yet. Practice related concept lessons!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {nodeProblemsMap[selectedNode.id]?.map((prob) => {
                  const progress = problemProgress[prob.id];
                  const isSolved = progress?.status === 'SOLVED';
                  const isAttempted = progress?.status === 'ATTEMPTED';
                  const isRevision = progress?.status === 'REVISION_NEEDED';
                  const diffColors = getDifficultyColor(prob.difficulty);

                  return (
                    <div
                      key={prob.id}
                      onClick={() => setSelectedProblem(prob)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSolved
                          ? 'bg-emerald-950/15 border-emerald-900/40 hover:border-emerald-700/60'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateProblemStatus(
                                prob.id,
                                isSolved ? 'NOT_STARTED' : 'SOLVED'
                              );
                            }}
                            className={`h-5 w-5 rounded-md flex items-center justify-center border transition shrink-0 mt-0.5 ${
                              isSolved
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : isAttempted
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : isRevision
                                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                : 'border-slate-700 bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isSolved && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </button>
                          <div>
                            <span className={`text-xs font-semibold ${isSolved ? 'line-through text-slate-400' : 'text-white'}`}>
                              {prob.title}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5 capitalize">
                              {prob.platform}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}>
                          {prob.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                        <span className="text-[11px] text-brand-400 font-medium flex items-center gap-1">
                          <span>Details</span>
                          <ChevronRight className="h-3 w-3" />
                        </span>

                        <a
                          href={prob.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Solve</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};
