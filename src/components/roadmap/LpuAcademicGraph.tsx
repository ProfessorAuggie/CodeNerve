import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  BookOpen, 
  ArrowRight,
  ShieldAlert,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { PROBLEMS } from '../../data/problems';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../../data/visualizers';
import { useUserStore } from '../../store/userStore';
import { ProblemModal } from '../problems/ProblemModal';
import type { Problem } from '../../types';

interface LpuNodeData {
  id: string;
  unitNumber: number;
  unitCode: string;
  title: string;
  category: 'foundation' | 'core' | 'advanced';
  x: number;
  y: number;
  examScope: 'CA-1' | 'MTE' | 'CA-2' | 'ETE';
  prerequisites: string[];
  description: string;
  visualizerId?: string;
  problemIds: string[];
}

interface LpuEdgeData {
  from: string;
  to: string;
  label?: string;
  isDotted?: boolean;
}

// ───── CSE205 Data Structures & Algorithms Academic DAG ─────
const CSE205_NODES: LpuNodeData[] = [
  // Level 0: Foundations
  {
    id: 'cse205-arrays',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'Arrays & Big-O Foundations',
    category: 'foundation',
    x: 480,
    y: 40,
    examScope: 'CA-1',
    prerequisites: ['Basic C++ programming', 'Loop constructs & memory addresses'],
    description: 'Contiguous 1D/2D memory addressing, element shifting, Big-O asymptotic analysis.',
    problemIds: ['p-dsa-array-traversal-1', 'p-dsa-array-insert-1'],
  },

  // Level 1: Searching & Basic Sorting
  {
    id: 'cse205-searching',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'Linear & Binary Search',
    category: 'foundation',
    x: 320,
    y: 135,
    examScope: 'CA-1',
    prerequisites: ['Arrays & Big-O Foundations'],
    description: 'Sequential comparison vs logarithmic interval halving on ordered ranges.',
    visualizerId: 'binary-search',
    problemIds: ['p-dsa-linear-search-1', 'p-dsa-binary-search-1'],
  },
  {
    id: 'cse205-sorting',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'Bubble, Insert & Select Sort',
    category: 'foundation',
    x: 620,
    y: 135,
    examScope: 'CA-1',
    prerequisites: ['Arrays & Big-O Foundations'],
    description: 'Quadratic sorting paradigms, bubble passes, insertion shifts, and selection minima.',
    visualizerId: 'bubble-sort',
    problemIds: ['p-dsa-bubble-sort-1', 'p-dsa-insertion-sort-1', 'p-dsa-selection-sort-1'],
  },

  // Level 2: Advanced Sorting & Linked Lists
  {
    id: 'cse205-adv-sorting',
    unitNumber: 2,
    unitCode: 'Unit 2',
    title: 'Quick & Merge Sort',
    category: 'core',
    x: 680,
    y: 235,
    examScope: 'CA-1',
    prerequisites: ['Bubble, Insert & Select Sort', 'Divide and conquer recursion'],
    description: 'Divide and conquer partitioning, recursive stack unwinding, and guaranteed O(n log n) merges.',
    visualizerId: 'merge-sort',
    problemIds: ['p-dsa-merge-sort-1', 'p-dsa-quick-sort-1'],
  },
  {
    id: 'cse205-linked-lists',
    unitNumber: 3,
    unitCode: 'Unit 3',
    title: 'Singly & Doubly Linked Lists',
    category: 'core',
    x: 320,
    y: 235,
    examScope: 'MTE',
    prerequisites: ['Arrays & Big-O Foundations', 'Pointers and dynamic memory (new/delete)'],
    description: 'Non-contiguous node allocation, next/prev pointer rewiring, insertion and deletion.',
    visualizerId: 'singly-linked-list',
    problemIds: ['p-dsa-ll-insert-1', 'p-dsa-ll-reverse-1', 'p-dsa-dll-1'],
  },

  // Level 3: Linear Abstract Data Types
  {
    id: 'cse205-stacks-queues',
    unitNumber: 4,
    unitCode: 'Unit 4',
    title: 'Stacks & Circular Queues',
    category: 'core',
    x: 480,
    y: 335,
    examScope: 'MTE',
    prerequisites: ['Singly & Doubly Linked Lists', 'Arrays & Big-O Foundations'],
    description: 'LIFO stack semantics, expression evaluation (Infix to Postfix), and FIFO circular queues.',
    visualizerId: 'stack-operations',
    problemIds: ['p-dsa-stack-valid-parens-1', 'p-dsa-queue-1', 'p-dsa-circ-queue-1'],
  },

  // Level 4: Non-Linear Trees
  {
    id: 'cse205-trees',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'Binary Trees & BST Traversals',
    category: 'core',
    x: 420,
    y: 435,
    examScope: 'ETE',
    prerequisites: ['Stacks & Circular Queues', 'Divide and conquer recursion'],
    description: 'Hierarchical node branching, in-order/pre-order/post-order, BST search invariant.',
    visualizerId: 'bst-insert',
    problemIds: ['p-dsa-tree-traversal-1', 'p-dsa-bst-insert-1'],
  },
  {
    id: 'cse205-avl',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'AVL Balanced Trees',
    category: 'advanced',
    x: 240,
    y: 535,
    examScope: 'ETE',
    prerequisites: ['Binary Trees & BST Traversals'],
    description: 'Self-balancing height property, balance factor, single (LL/RR) and double (LR/RL) rotations.',
    visualizerId: 'avl-tree',
    problemIds: ['p-dsa-bst-insert-1'],
  },
  {
    id: 'cse205-heaps',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'Heaps & Priority Queues',
    category: 'advanced',
    x: 580,
    y: 535,
    examScope: 'ETE',
    prerequisites: ['Binary Trees & BST Traversals', 'Arrays & Big-O Foundations'],
    description: 'Complete binary tree array mapping, heapify, max-heap/min-heap, and priority scheduling.',
    visualizerId: 'heap-sort',
    problemIds: ['p-dsa-heap-kth-1'],
  },

  // Level 5: Graphs & Advanced Topics
  {
    id: 'cse205-graphs',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'Graph Traversals (BFS & DFS)',
    category: 'advanced',
    x: 420,
    y: 635,
    examScope: 'ETE',
    prerequisites: ['Binary Trees & BST Traversals', 'Stacks & Circular Queues'],
    description: 'Adjacency matrix & list, queue-based BFS layer exploration, and stack-based DFS paths.',
    visualizerId: 'bfs',
    problemIds: ['p-dsa-bfs-1'],
  },
  {
    id: 'cse205-adv-graphs',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'Shortest Path & MST (Dijkstra, Prim)',
    category: 'advanced',
    x: 500,
    y: 735,
    examScope: 'ETE',
    prerequisites: ['Graph Traversals (BFS & DFS)', 'Heaps & Priority Queues'],
    description: 'Greedy shortest paths via Dijkstra, minimum spanning trees via Prim and Kruskal algorithms.',
    visualizerId: 'dijkstra',
    problemIds: ['p-dsa-dijkstra-1'],
  },
];

const CSE205_EDGES: LpuEdgeData[] = [
  // Arrays -> Searching & Sorting
  { from: 'cse205-arrays', to: 'cse205-searching' },
  { from: 'cse205-arrays', to: 'cse205-sorting' },

  // Sorting -> Advanced Sorting
  { from: 'cse205-sorting', to: 'cse205-adv-sorting' },

  // Arrays -> Linked Lists
  { from: 'cse205-arrays', to: 'cse205-linked-lists' },

  // Linked Lists & Searching -> Stacks & Queues
  { from: 'cse205-linked-lists', to: 'cse205-stacks-queues' },
  { from: 'cse205-searching', to: 'cse205-stacks-queues', isDotted: true },

  // Stacks & Queues -> Trees
  { from: 'cse205-stacks-queues', to: 'cse205-trees' },

  // Trees -> AVL, Heaps, Graphs
  { from: 'cse205-trees', to: 'cse205-avl' },
  { from: 'cse205-trees', to: 'cse205-heaps' },
  { from: 'cse205-trees', to: 'cse205-graphs' },

  // Graphs & Heaps -> Shortest Path / MST
  { from: 'cse205-graphs', to: 'cse205-adv-graphs' },
  { from: 'cse205-heaps', to: 'cse205-adv-graphs', isDotted: true },
];

// ───── CSE202 Object Oriented Programming C++ Academic DAG ─────
const CSE202_NODES: LpuNodeData[] = [
  // Level 0
  {
    id: 'cse202-basics',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'C++ Syntax, I/O & Functions',
    category: 'foundation',
    x: 480,
    y: 40,
    examScope: 'CA-1',
    prerequisites: ['Basic programming fundamentals'],
    description: 'Streams (cin/cout), manipulators, parameter passing, and inline member functions.',
    problemIds: ['p-cpp-io-1', 'p-cpp-classes-1'],
  },

  // Level 1
  {
    id: 'cse202-pointers',
    unitNumber: 2,
    unitCode: 'Unit 2',
    title: 'Pointers & Dynamic Memory',
    category: 'foundation',
    x: 340,
    y: 135,
    examScope: 'CA-1',
    prerequisites: ['C++ Syntax, I/O & Functions'],
    description: 'Pointer arithmetic, void pointers, references, heap allocation with new and delete.',
    problemIds: ['p-cpp-pointers-1', 'p-cpp-references-1'],
  },
  {
    id: 'cse202-overloading',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'Function Overloading & Scope (::)',
    category: 'foundation',
    x: 620,
    y: 135,
    examScope: 'CA-1',
    prerequisites: ['C++ Syntax, I/O & Functions'],
    description: 'Compile-time overload resolution, default arguments, and scope resolution operator.',
    problemIds: ['p-cpp-func-overload-1'],
  },

  // Level 2: Classes & Objects
  {
    id: 'cse202-classes',
    unitNumber: 3,
    unitCode: 'Unit 3',
    title: 'Classes & Encapsulation',
    category: 'core',
    x: 480,
    y: 235,
    examScope: 'MTE',
    prerequisites: ['C++ Syntax, I/O & Functions', 'Pointers & Dynamic Memory'],
    description: 'Data hiding, private/public access, member functions, and static class members.',
    problemIds: ['p-cpp-classes-1', 'p-cpp-static-1'],
  },

  // Level 3: Constructors & Operator Overloading
  {
    id: 'cse202-constructors',
    unitNumber: 3,
    unitCode: 'Unit 3',
    title: 'Constructors & Destructors',
    category: 'core',
    x: 340,
    y: 335,
    examScope: 'MTE',
    prerequisites: ['Classes & Encapsulation'],
    description: 'Default, parameterized, copy constructors, initializer lists, and RAII cleanup.',
    problemIds: ['p-cpp-constructors-1'],
  },
  {
    id: 'cse202-operator-overload',
    unitNumber: 4,
    unitCode: 'Unit 4',
    title: 'Operator Overloading & Friends',
    category: 'core',
    x: 620,
    y: 335,
    examScope: 'CA-2',
    prerequisites: ['Classes & Encapsulation', 'Function Overloading & Scope (::)'],
    description: 'Unary and binary operator overloading, friend function access, stream operators (<<, >>).',
    problemIds: ['p-cpp-operator-overload-1', 'p-cpp-friend-1'],
  },

  // Level 4: Inheritance
  {
    id: 'cse202-inheritance',
    unitNumber: 4,
    unitCode: 'Unit 4',
    title: 'Inheritance & Access Specifiers',
    category: 'core',
    x: 480,
    y: 435,
    examScope: 'CA-2',
    prerequisites: ['Constructors & Destructors', 'Classes & Encapsulation'],
    description: 'Single, multiple, multilevel inheritance, protected members, and constructor chaining.',
    problemIds: ['p-cpp-inheritance-1'],
  },

  // Level 5: Polymorphism & Virtual Functions
  {
    id: 'cse202-polymorphism',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'Virtual Functions & Polymorphism',
    category: 'advanced',
    x: 360,
    y: 535,
    examScope: 'ETE',
    prerequisites: ['Inheritance & Access Specifiers', 'Pointers & Dynamic Memory'],
    description: 'Dynamic dispatch, vtable/vptr mechanism, runtime polymorphism, and virtual destructors.',
    problemIds: ['p-cpp-polymorphism-1', 'p-cpp-virtual-destructor-1'],
  },
  {
    id: 'cse202-abstract',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'Pure Virtual & Abstract Classes',
    category: 'advanced',
    x: 600,
    y: 535,
    examScope: 'ETE',
    prerequisites: ['Inheritance & Access Specifiers'],
    description: 'Pure virtual functions (= 0), interface contracts, and concrete derived implementations.',
    problemIds: ['p-cpp-polymorphism-1'],
  },

  // Level 6: Templates & STL
  {
    id: 'cse202-templates',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'Function & Class Templates',
    category: 'advanced',
    x: 420,
    y: 635,
    examScope: 'ETE',
    prerequisites: ['Virtual Functions & Polymorphism', 'Pure Virtual & Abstract Classes'],
    description: 'Generic programming, template type parameters, and specialized implementations.',
    problemIds: ['p-cpp-templates-1'],
  },
  {
    id: 'cse202-stl',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'STL Containers & Iterators',
    category: 'advanced',
    x: 580,
    y: 635,
    examScope: 'ETE',
    prerequisites: ['Function & Class Templates'],
    description: 'Vector, list, map, set, iterators, and <algorithm> standard utilities.',
    problemIds: ['p-cpp-stl-vector-1', 'p-cpp-stl-map-1'],
  },
  {
    id: 'cse202-files',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'File I/O Streams & Serialization',
    category: 'advanced',
    x: 500,
    y: 735,
    examScope: 'ETE',
    prerequisites: ['Function & Class Templates', 'C++ Syntax, I/O & Functions'],
    description: 'ifstream, ofstream, fstream, binary file reading/writing, and error state flags.',
    problemIds: ['p-cpp-io-1'],
  },
];

const CSE202_EDGES: LpuEdgeData[] = [
  { from: 'cse202-basics', to: 'cse202-pointers' },
  { from: 'cse202-basics', to: 'cse202-overloading' },

  { from: 'cse202-pointers', to: 'cse202-classes' },
  { from: 'cse202-overloading', to: 'cse202-classes' },

  { from: 'cse202-classes', to: 'cse202-constructors' },
  { from: 'cse202-classes', to: 'cse202-operator-overload' },

  { from: 'cse202-constructors', to: 'cse202-inheritance' },
  { from: 'cse202-operator-overload', to: 'cse202-inheritance', isDotted: true },

  { from: 'cse202-inheritance', to: 'cse202-polymorphism' },
  { from: 'cse202-inheritance', to: 'cse202-abstract' },

  { from: 'cse202-polymorphism', to: 'cse202-templates' },
  { from: 'cse202-abstract', to: 'cse202-templates' },

  { from: 'cse202-templates', to: 'cse202-stl' },
  { from: 'cse202-templates', to: 'cse202-files' },
  { from: 'cse202-stl', to: 'cse202-files', isDotted: true },
];

export const LpuAcademicGraph: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'cse205' | 'cse202'>('cse205');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cse205-arrays');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const { problemProgress } = useUserStore();

  const currentNodes = selectedSubject === 'cse205' ? CSE205_NODES : CSE202_NODES;
  const currentEdges = selectedSubject === 'cse205' ? CSE205_EDGES : CSE202_EDGES;

  // Active selected node data
  const selectedNode = currentNodes.find((n) => n.id === selectedNodeId) || currentNodes[0];

  // Backward DAG trace calculation on hover
  const hoveredPrereqTrace = useMemo(() => {
    if (!hoveredNodeId) return null;
    const ancestorIds = new Set<string>([hoveredNodeId]);
    const activeEdgeKeys = new Set<string>();

    const queue = [hoveredNodeId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const edge of currentEdges) {
        if (edge.to === curr) {
          activeEdgeKeys.add(`${edge.from}->${edge.to}`);
          if (!ancestorIds.has(edge.from)) {
            ancestorIds.add(edge.from);
            queue.push(edge.from);
          }
        }
      }
    }

    const pathNodes = currentNodes.filter((n) => ancestorIds.has(n.id));
    const sortedAncestors = [...pathNodes].sort((a, b) => a.y - b.y);

    return {
      targetId: hoveredNodeId,
      ancestorIds,
      activeEdgeKeys,
      sortedAncestors,
    };
  }, [hoveredNodeId, currentEdges, currentNodes]);

  // Compute node progress
  const getNodeStats = (node: LpuNodeData) => {
    const problems = PROBLEMS.filter((p) => node.problemIds.includes(p.id));
    const solved = problems.filter((p) => problemProgress[p.id]?.status === 'SOLVED').length;
    return {
      total: problems.length,
      solved,
      percent: problems.length > 0 ? Math.round((solved / problems.length) * 100) : 0,
      problems,
    };
  };

  const getNodeCoord = (id: string) => {
    const node = currentNodes.find((n) => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + 80, // half of node card width (160/2)
      y: node.y + 24, // half of node card height (48/2)
    };
  };

  const createSmoothPath = (fromId: string, toId: string) => {
    const start = getNodeCoord(fromId);
    const end = getNodeCoord(toId);
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  };

  const selectedNodeStats = getNodeStats(selectedNode);

  return (
    <div className="relative w-full rounded-2xl border border-indigo-900/40 bg-[#090c14] overflow-hidden shadow-2xl space-y-0">
      {/* Subject Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>LPU Academic Dependency Flowchart</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Prerequisite Tracing
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hover on any unit node to trace all academic prerequisites required before that topic.
            </p>
          </div>
        </div>

        {/* Subject Course Tabs */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
          <button
            onClick={() => {
              setSelectedSubject('cse205');
              setSelectedNodeId('cse205-arrays');
              setHoveredNodeId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              selectedSubject === 'cse205'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌲 CSE205 (Data Structures)</span>
          </button>
          <button
            onClick={() => {
              setSelectedSubject('cse202');
              setSelectedNodeId('cse202-basics');
              setHoveredNodeId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              selectedSubject === 'cse202'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡ CSE202 (C++ OOP)</span>
          </button>
        </div>
      </div>

      {/* Floating Prerequisite Breadcrumb Trace HUD */}
      {hoveredPrereqTrace && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/95 border border-emerald-500/50 backdrop-blur-md shadow-2xl shadow-emerald-500/15 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LPU Prerequisites:</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs overflow-x-auto max-w-md sm:max-w-lg scrollbar-none py-0.5">
            {hoveredPrereqTrace.sortedAncestors.map((anc, idx) => {
              const isTarget = anc.id === hoveredPrereqTrace.targetId;
              return (
                <React.Fragment key={anc.id}>
                  {idx > 0 && <span className="text-emerald-400 font-bold text-xs">➔</span>}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
                      isTarget
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {anc.unitCode}: {anc.title}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          <span className="text-[10px] text-slate-400 font-medium shrink-0 pl-1">
            {hoveredPrereqTrace.sortedAncestors.length - 1 === 0 ? (
              <span className="text-emerald-300 font-semibold">🌟 Foundational Unit</span>
            ) : (
              <span>({hoveredPrereqTrace.sortedAncestors.length - 1} required)</span>
            )}
          </span>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className="w-full overflow-x-auto overflow-y-auto py-16 px-6 min-h-[780px] relative flex justify-center items-start select-none"
        style={{
          backgroundColor: '#0a0d14',
          backgroundImage: 'radial-gradient(circle, #252b3d 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        {/* Zoom Controls */}
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
          >
            Reset
          </button>
        </div>

        <div
          className="relative transition-transform duration-200 origin-top"
          style={{
            width: '980px',
            height: '820px',
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* SVG Connecting Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <filter id="lpu-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {currentEdges.map((edge, idx) => {
              const pathData = createSmoothPath(edge.from, edge.to);
              const edgeKey = `${edge.from}->${edge.to}`;
              const isPrereqEdge = hoveredPrereqTrace?.activeEdgeKeys.has(edgeKey);
              const isDimmed = hoveredPrereqTrace && !isPrereqEdge;
              const isSelectedEdge =
                selectedNodeId === edge.from || selectedNodeId === edge.to;

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill="none"
                  stroke={
                    isPrereqEdge
                      ? '#34d399'
                      : isDimmed
                      ? '#161d2e'
                      : isSelectedEdge
                      ? '#10b981'
                      : edge.isDotted
                      ? '#3b82f6'
                      : '#313d5a'
                  }
                  strokeWidth={isPrereqEdge ? 3.5 : isDimmed ? 1.5 : isSelectedEdge ? 2.5 : 2}
                  strokeDasharray={edge.isDotted ? '4,4' : undefined}
                  filter={isPrereqEdge ? 'url(#lpu-neon-glow)' : undefined}
                  opacity={isDimmed ? 0.15 : 1}
                  className="transition-all duration-200"
                />
              );
            })}
          </svg>

          {/* Academic Node Cards */}
          {currentNodes.map((node) => {
            const stats = getNodeStats(node);
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isAncestor = hoveredPrereqTrace?.ancestorIds.has(node.id);
            const isDimmedNode = hoveredPrereqTrace && !isAncestor;

            const examColors: Record<string, string> = {
              'CA-1': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
              'MTE': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
              'CA-2': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
              'ETE': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            };

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onClick={() => {
                  setSelectedNodeId(node.id);
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
                  width: '160px',
                }}
              >
                {/* Status Indicator */}
                {isHovered ? (
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30 mb-0.5 animate-bounce">
                    Target Unit
                  </span>
                ) : isAncestor ? (
                  <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 mb-0.5">
                    Prereq
                  </span>
                ) : null}

                {/* Node Card */}
                <div
                  className={`w-full py-2.5 px-3 rounded-xl border text-center transition-all duration-200 shadow-xl ${
                    isHovered
                      ? 'bg-[#153428] border-emerald-400 ring-2 ring-emerald-400/80 shadow-emerald-500/40'
                      : isAncestor
                      ? 'bg-[#102920] border-emerald-500 ring-1 ring-emerald-400/60 shadow-emerald-500/25'
                      : isSelected
                      ? 'bg-[#17253b] border-indigo-400 shadow-indigo-500/30'
                      : 'bg-[#141a2c] border-[#2d3754] hover:bg-[#1a233a] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {node.unitCode}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1 rounded border ${examColors[node.examScope]}`}
                    >
                      {node.examScope}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-white tracking-tight leading-tight block truncate">
                    {node.title}
                  </span>

                  {/* Progress bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-[#0e121e] overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.max(15, stats.percent)}%` }}
                    />
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono mt-0.5 opacity-80 group-hover:opacity-100">
                  {stats.solved}/{stats.total} Solved
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Drawer: Selected Unit Details, Prerequisites & Problems */}
      {drawerOpen && selectedNode && (
        <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-md p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {selectedNode.unitCode} Academic Topic
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-400">
                  Exam Scope: <strong className="text-white">{selectedNode.examScope}</strong>
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{selectedNode.title}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">{selectedNode.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {selectedNode.visualizerId && (
                <a
                  href={`https://algonerve.vercel.app/visualize/${selectedNode.visualizerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Launch Visualizer ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Explicit Prerequisites Block */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold text-emerald-400 shrink-0 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>Academic Prerequisites:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedNode.prerequisites.map((req, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Curated Unit Problems */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Practice Problems for this Unit ({selectedNodeStats.total})
            </h4>

            {selectedNodeStats.problems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Problems are mapped dynamically across the full catalogue.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedNodeStats.problems.map((problem) => {
                  const status = problemProgress[problem.id]?.status || 'UNSOLVED';
                  return (
                    <div
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-850 hover:border-slate-700 cursor-pointer flex items-center justify-between transition group"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                          {problem.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-400 uppercase font-mono">
                            {problem.platform}
                          </span>
                          <span className="text-slate-600">&bull;</span>
                          <span
                            className={
                              problem.difficulty === 'easy'
                                ? 'text-emerald-400 capitalize'
                                : problem.difficulty === 'medium'
                                ? 'text-amber-400 capitalize'
                                : 'text-rose-400 capitalize'
                            }
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {status === 'SOLVED' && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition" />
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
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
};
