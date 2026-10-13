import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Minimize2,
  Scan,
  Shuffle, 
  ShieldAlert,
  Layers,
  BookOpen
} from 'lucide-react';
import { PROBLEMS } from '../../data/problems';
import { useUserStore } from '../../store/userStore';
import { ProblemModal } from '../problems/ProblemModal';
import { TopicDrawer } from './TopicDrawer';
import type { Problem, ProblemStatus } from '../../types';

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
    x: 440,
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
    x: 250,
    y: 140,
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
    x: 630,
    y: 140,
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
    x: 710,
    y: 240,
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
    x: 250,
    y: 240,
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
    x: 440,
    y: 340,
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
    x: 440,
    y: 440,
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
    x: 220,
    y: 540,
    examScope: 'ETE',
    prerequisites: ['Binary Trees & BST Traversals'],
    description: 'Self-balancing binary search trees using LL, RR, LR, and RL rotation balance factors.',
    visualizerId: 'avl-tree',
    problemIds: ['p-dsa-avl-balance-1'],
  },
  {
    id: 'cse205-heaps',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'Binary Heaps & Priority Queues',
    category: 'advanced',
    x: 660,
    y: 540,
    examScope: 'ETE',
    prerequisites: ['Binary Trees & BST Traversals', 'Arrays & Big-O Foundations'],
    description: 'Complete binary tree layout in flat arrays, sift-up/sift-down heapify, HeapSort.',
    visualizerId: 'heap-sort',
    problemIds: ['p-dsa-kth-largest-1', 'p-dsa-heapify-1'],
  },

  // Level 5: Graphs & Hashing
  {
    id: 'cse205-graphs',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'Graph Traversals (BFS & DFS)',
    category: 'advanced',
    x: 330,
    y: 650,
    examScope: 'ETE',
    prerequisites: ['Stacks & Circular Queues', 'Binary Trees & BST Traversals'],
    description: 'Adjacency list representations, queue-driven BFS, recursive stack DFS, cycle detection.',
    visualizerId: 'bfs-graph',
    problemIds: ['p-dsa-bfs-1', 'p-dsa-dfs-1'],
  },
  {
    id: 'cse205-spanning-trees',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: "Kruskal's & Prim's MST",
    category: 'advanced',
    x: 550,
    y: 650,
    examScope: 'ETE',
    prerequisites: ['Graph Traversals (BFS & DFS)', 'Binary Heaps & Priority Queues'],
    description: 'Minimum spanning tree discovery using greedy edge selection and Disjoint Set Union (DSU).',
    visualizerId: 'dijkstra',
    problemIds: ['p-dsa-mst-kruskal-1', 'p-dsa-mst-prim-1'],
  },
  {
    id: 'cse205-hashing',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'Hashing & Collision Resolution',
    category: 'core',
    x: 440,
    y: 750,
    examScope: 'ETE',
    prerequisites: ['Arrays & Big-O Foundations', 'Singly & Doubly Linked Lists'],
    description: 'Hash functions, open addressing linear probing, chaining, load factor amortized O(1).',
    problemIds: ['p-dsa-hash-table-1'],
  },
];

const CSE205_EDGES: LpuEdgeData[] = [
  { from: 'cse205-arrays', to: 'cse205-searching' },
  { from: 'cse205-arrays', to: 'cse205-sorting' },

  { from: 'cse205-searching', to: 'cse205-linked-lists' },
  { from: 'cse205-sorting', to: 'cse205-adv-sorting' },

  { from: 'cse205-linked-lists', to: 'cse205-stacks-queues' },
  { from: 'cse205-adv-sorting', to: 'cse205-stacks-queues', isDotted: true },

  { from: 'cse205-stacks-queues', to: 'cse205-trees' },

  { from: 'cse205-trees', to: 'cse205-avl' },
  { from: 'cse205-trees', to: 'cse205-heaps' },

  { from: 'cse205-avl', to: 'cse205-graphs' },
  { from: 'cse205-heaps', to: 'cse205-spanning-trees' },
  { from: 'cse205-trees', to: 'cse205-graphs' },

  { from: 'cse205-graphs', to: 'cse205-spanning-trees' },
  { from: 'cse205-spanning-trees', to: 'cse205-hashing' },
  { from: 'cse205-linked-lists', to: 'cse205-hashing', isDotted: true },
];

// ───── CSE202 C++ Object Oriented Programming Academic DAG ─────
const CSE202_NODES: LpuNodeData[] = [
  // Unit 1
  {
    id: 'cse202-basics',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'C++ Syntax, I/O & Functions',
    category: 'foundation',
    x: 440,
    y: 40,
    examScope: 'CA-1',
    prerequisites: ['Introductory computer science concepts', 'Basic computational logic'],
    description: 'Primitive types, std::cin/cout, namespaces, call-by-reference vs call-by-value.',
    problemIds: ['p-cpp-io-1', 'p-cpp-func-ref-1'],
  },
  {
    id: 'cse202-pointers',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'Pointers & Dynamic Memory',
    category: 'foundation',
    x: 280,
    y: 140,
    examScope: 'CA-1',
    prerequisites: ['C++ Syntax, I/O & Functions'],
    description: 'Pointer arithmetic, new/delete heap allocation, memory leaks and nullptr safeguards.',
    problemIds: ['p-cpp-pointers-1', 'p-cpp-dynamic-arr-1'],
  },
  {
    id: 'cse202-overloading',
    unitNumber: 1,
    unitCode: 'Unit 1',
    title: 'Function Overloading & Inline',
    category: 'foundation',
    x: 600,
    y: 140,
    examScope: 'CA-1',
    prerequisites: ['C++ Syntax, I/O & Functions'],
    description: 'Compile-time function resolution, default arguments, inline performance trade-offs.',
    problemIds: ['p-cpp-fn-overload-1'],
  },

  // Unit 2
  {
    id: 'cse202-classes',
    unitNumber: 2,
    unitCode: 'Unit 2',
    title: 'Classes, Objects & Encapsulation',
    category: 'core',
    x: 440,
    y: 240,
    examScope: 'MTE',
    prerequisites: ['Pointers & Dynamic Memory', 'Function Overloading & Inline'],
    description: 'Access specifiers (public/private/protected), this pointer, member function definition.',
    problemIds: ['p-cpp-class-student-1', 'p-cpp-encapsulation-1'],
  },
  {
    id: 'cse202-constructors',
    unitNumber: 2,
    unitCode: 'Unit 2',
    title: 'Constructors, Destructors & Copy',
    category: 'core',
    x: 260,
    y: 340,
    examScope: 'MTE',
    prerequisites: ['Classes, Objects & Encapsulation'],
    description: 'Default, parameterized, copy constructor, deep vs shallow copy, and destructor lifecycles.',
    problemIds: ['p-cpp-copy-constructor-1', 'p-cpp-destructor-order-1'],
  },
  {
    id: 'cse202-operator-overload',
    unitNumber: 3,
    unitCode: 'Unit 3',
    title: 'Operator Overloading & Friends',
    category: 'core',
    x: 620,
    y: 340,
    examScope: 'MTE',
    prerequisites: ['Classes, Objects & Encapsulation'],
    description: 'Overloading +, -, <<, >> operators, friend functions, and symmetric binary operands.',
    problemIds: ['p-cpp-op-complex-1', 'p-cpp-friend-class-1'],
  },

  // Unit 4
  {
    id: 'cse202-inheritance',
    unitNumber: 4,
    unitCode: 'Unit 4',
    title: 'Inheritance & Access Control',
    category: 'core',
    x: 440,
    y: 440,
    examScope: 'CA-2',
    prerequisites: ['Constructors, Destructors & Copy', 'Operator Overloading & Friends'],
    description: 'Single, multiple, hierarchical, and virtual base classes to resolve diamond problem.',
    problemIds: ['p-cpp-single-inherit-1', 'p-cpp-virtual-base-diamond-1'],
  },
  {
    id: 'cse202-polymorphism',
    unitNumber: 4,
    unitCode: 'Unit 4',
    title: 'Virtual Functions & Runtime Poly',
    category: 'advanced',
    x: 260,
    y: 540,
    examScope: 'CA-2',
    prerequisites: ['Inheritance & Access Control'],
    description: 'Virtual tables (vptr/vtable), late dynamic binding, virtual destructors.',
    problemIds: ['p-cpp-virtual-vtable-1'],
  },
  {
    id: 'cse202-abstract',
    unitNumber: 4,
    unitCode: 'Unit 4',
    title: 'Pure Virtual & Interfaces',
    category: 'core',
    x: 620,
    y: 540,
    examScope: 'CA-2',
    prerequisites: ['Inheritance & Access Control'],
    description: 'Abstract base classes, pure virtual (= 0), interface contracts for polymorphic subsystems.',
    problemIds: ['p-cpp-pure-virtual-shape-1'],
  },

  // Unit 5 & 6
  {
    id: 'cse202-templates',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'Function & Class Templates',
    category: 'core',
    x: 440,
    y: 640,
    examScope: 'ETE',
    prerequisites: ['Virtual Functions & Runtime Poly', 'Pure Virtual & Interfaces'],
    description: 'Generic programming, template specialization, typename and class parameters.',
    problemIds: ['p-cpp-template-stack-1', 'p-cpp-fn-template-max-1'],
  },
  {
    id: 'cse202-stl',
    unitNumber: 5,
    unitCode: 'Unit 5',
    title: 'STL Containers, Iterators & Algos',
    category: 'advanced',
    x: 220,
    y: 740,
    examScope: 'ETE',
    prerequisites: ['Function & Class Templates'],
    description: 'vector, list, map, set, iterators, std::sort, std::find, and lambda predicates.',
    problemIds: ['p-cpp-stl-vector-1', 'p-cpp-stl-map-1'],
  },
  {
    id: 'cse202-files',
    unitNumber: 6,
    unitCode: 'Unit 6',
    title: 'File I/O Streams & Serialization',
    category: 'advanced',
    x: 660,
    y: 740,
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
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pan & Zoom Engine
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const lastTouchDistance = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fit to screen calculator for all window sizes
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth <= 0 || clientHeight <= 0) return;

    const graphWidth = 1000;
    const graphHeight = 840;
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

  // Fullscreen escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Refit when toggling fullscreen
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToScreen();
    }, 60);
    return () => clearTimeout(timer);
  }, [isFullscreen, fitToScreen]);

  const { problemProgress, updateProblemStatus, bookmarks, toggleBookmark } = useUserStore();

  const currentNodes = selectedSubject === 'cse205' ? CSE205_NODES : CSE202_NODES;
  const currentEdges = selectedSubject === 'cse205' ? CSE205_EDGES : CSE202_EDGES;

  // Active selected node data
  const selectedNode = currentNodes.find((n) => n.id === selectedNodeId) || currentNodes[0];

  // Map problems for all nodes
  const nodeProblemsMap = useMemo(() => {
    const map: Record<string, Problem[]> = {};
    for (const node of currentNodes) {
      map[node.id] = PROBLEMS.filter((p) => node.problemIds.includes(p.id));
    }
    return map;
  }, [currentNodes]);

  // Overall statistics for current subject
  const subjectStats = useMemo(() => {
    const allProblemIds = new Set<string>();
    currentNodes.forEach((n) => n.problemIds.forEach((pid) => allProblemIds.add(pid)));
    const total = allProblemIds.size;
    let solved = 0;
    allProblemIds.forEach((pid) => {
      if (problemProgress[pid]?.status === 'SOLVED') solved++;
    });
    return {
      total,
      solved,
      percent: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  }, [currentNodes, problemProgress]);

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
    const problems = nodeProblemsMap[node.id] || [];
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
      x: node.x + 86, // half of node card width (172/2)
      y: node.y + 26, // half of node card height (52/2)
    };
  };

  const createSmoothPath = (fromId: string, toId: string) => {
    const start = getNodeCoord(fromId);
    const end = getNodeCoord(toId);
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, select')) return;
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = Math.abs(e.clientX - (dragStart.x + pan.x));
    const deltaY = Math.abs(e.clientY - (dragStart.y + pan.y));
    if (deltaX > 4 || deltaY > 4) {
      setHasMoved(true);
    }
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan & pinch zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, select')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setHasMoved(false);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
      lastTouchDistance.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      lastTouchDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const deltaX = Math.abs(e.touches[0].clientX - (dragStart.x + pan.x));
      const deltaY = Math.abs(e.touches[0].clientY - (dragStart.y + pan.y));
      if (deltaX > 4 || deltaY > 4) {
        setHasMoved(true);
      }
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const factor = dist / lastTouchDistance.current;
      setZoomLevel((z) => Math.min(1.6, Math.max(0.65, z * factor)));
      lastTouchDistance.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoomLevel((z) => Math.min(1.6, Math.max(0.35, Number((z + zoomDelta).toFixed(2)))));
  };

  // Reset view to center
  const resetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Pick random problem across current subject
  const pickRandomProblem = () => {
    const allSubjectProblems: Problem[] = [];
    currentNodes.forEach((node) => {
      const pList = nodeProblemsMap[node.id] || [];
      allSubjectProblems.push(...pList);
    });

    if (allSubjectProblems.length > 0) {
      const unsolved = allSubjectProblems.filter((p) => problemProgress[p.id]?.status !== 'SOLVED');
      const pool = unsolved.length > 0 ? unsolved : allSubjectProblems;
      const random = pool[Math.floor(Math.random() * pool.length)];
      setSelectedProblem(random);
    }
  };

  const handleToggleStatus = (problemId: string) => {
    const current = problemProgress[problemId]?.status || 'NOT_STARTED';
    const next: ProblemStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    updateProblemStatus(problemId, next);
  };

  const examColors: Record<string, string> = {
    'CA-1': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    'MTE': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'CA-2': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    'ETE': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  };

  return (
    <div className={`relative w-full bg-[#090c14] overflow-hidden transition-all duration-200 space-y-0 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
        : 'rounded-2xl border border-indigo-900/40 shadow-2xl'
    }`}>
      {/* Subject Header & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Academic Curriculum Flowchart</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Interactive Graph
              </span>
            </h3>
            <p className="text-xs text-slate-400 hidden xs:block">
              Drag to pan &bull; Scroll to zoom &bull; Click node to open study drawer
            </p>
          </div>
        </div>

        {/* Top Controls: Course Selector & Overall Progress */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Zoom & Fit Bar */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={fitToScreen}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-[11px] font-semibold"
              title="Fit entire curriculum into current window"
              aria-label="Fit to window"
            >
              <Scan className="h-3 w-3 text-emerald-400" />
              <span>Fit</span>
            </button>
            <button
              onClick={resetView}
              className="px-1.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-[11px] font-semibold"
              title="Reset Zoom View"
              aria-label="Reset zoom"
            >
              Reset ({Math.round(zoomLevel * 100)}%)
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Maximize to full window'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>

          {/* Progress Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Solved:</span>
            <span className="font-mono font-bold text-emerald-400">
              {subjectStats.solved}/{subjectStats.total}
            </span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
              {subjectStats.percent}%
            </span>
          </div>

          {/* Random Problem Shuffle */}
          <button
            onClick={pickRandomProblem}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition"
            title="Pick a random problem from this curriculum"
          >
            <Shuffle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Pick Random</span>
          </button>

          {/* Subject Course Tabs */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
            <button
              onClick={() => {
                setSelectedSubject('cse205');
                setSelectedNodeId('cse205-arrays');
                setHoveredNodeId(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                selectedSubject === 'cse205'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌲 CSE205</span>
            </button>
            <button
              onClick={() => {
                setSelectedSubject('cse202');
                setSelectedNodeId('cse202-basics');
                setHoveredNodeId(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                selectedSubject === 'cse202'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡ CSE202</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Prerequisite Breadcrumb Trace HUD */}
      {hoveredPrereqTrace && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/95 border border-emerald-500/50 backdrop-blur-md shadow-2xl shadow-emerald-500/20 animate-in fade-in zoom-in-95 duration-150 max-w-[90%]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Academic Prerequisites:</span>
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

      {/* Interactive Pan-and-Zoom Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`w-full relative flex justify-center items-center select-none overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'h-[calc(100vh-68px)]'
            : 'h-[72vh] min-h-[500px] max-h-[850px]'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundColor: '#0a0d14',
          backgroundImage: 'radial-gradient(circle, #252b3d 1.5px, transparent 1.5px)',
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
            height: '840px',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
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

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onClick={() => {
                  if (hasMoved) return;
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
                  width: '172px',
                }}
              >
                {/* Absolute Status Indicator */}
                {isHovered ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30 whitespace-nowrap z-50 pointer-events-none">
                    Target Unit
                  </span>
                ) : isAncestor ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 whitespace-nowrap z-50 pointer-events-none">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400">
                      {node.unitCode}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${examColors[node.examScope]}`}
                    >
                      {node.examScope}
                    </span>
                  </div>

                  <span className="text-[11.5px] font-bold text-white tracking-tight leading-snug block text-center break-words line-clamp-2">
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

                <span className="text-[10px] text-slate-400 font-mono mt-1 opacity-80 group-hover:opacity-100">
                  {stats.solved}/{stats.total} Solved
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-Over Problem Drawer */}
      {selectedNode && (
        <TopicDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedNode.title}
          description={selectedNode.description}
          category={`${selectedSubject.toUpperCase()} Curriculum`}
          unitCode={selectedNode.unitCode}
          examScope={selectedNode.examScope}
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
