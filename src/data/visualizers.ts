import type { VisualizerMapping } from '../types';

// ───── AlgoNerve Visualizer Mappings ─────
// Maps CodeClass topic IDs to AlgoNerve algorithm IDs.
// Only algorithms that actually exist in AlgoNerve are listed.

export const VISUALIZER_MAPPINGS: VisualizerMapping[] = [
  // Searching
  { id: 'vis-linear-search', algorithmId: 'linear-search', topicIds: ['cse205-u1-t6'], label: 'Linear Search Visualizer', description: 'Step through linear search to see how each element is checked sequentially.' },
  { id: 'vis-binary-search', algorithmId: 'binary-search', topicIds: ['cse205-u1-t7'], label: 'Binary Search Visualizer', description: 'Visualize the divide-and-conquer process of binary search.' },
  
  // Sorting
  { id: 'vis-bubble-sort', algorithmId: 'bubble-sort', topicIds: ['cse205-u1-t3'], label: 'Bubble Sort Visualizer', description: 'Watch adjacent elements being compared and swapped.' },
  { id: 'vis-insertion-sort', algorithmId: 'insertion-sort', topicIds: ['cse205-u1-t4'], label: 'Insertion Sort Visualizer', description: 'See how elements are inserted into their correct sorted position.' },
  { id: 'vis-selection-sort', algorithmId: 'selection-sort', topicIds: ['cse205-u1-t5'], label: 'Selection Sort Visualizer', description: 'Watch the minimum finding and swapping process.' },
  { id: 'vis-merge-sort', algorithmId: 'merge-sort', topicIds: ['cse205-u4-t4'], label: 'Merge Sort Visualizer', description: 'Visualize the divide, sort, and merge phases.' },
  { id: 'vis-quick-sort', algorithmId: 'quick-sort', topicIds: ['cse205-u4-t5'], label: 'Quick Sort Visualizer', description: 'See pivot selection and partitioning in action.' },
  { id: 'vis-heap-sort', algorithmId: 'heap-sort', topicIds: ['cse205-u5-t1'], label: 'Heap Sort Visualizer', description: 'Watch the heapify and extraction process.' },
  
  // Data Structures
  { id: 'vis-stack', algorithmId: 'stack-operations', topicIds: ['cse205-u3-t1'], label: 'Stack Visualizer', description: 'Visualize push, pop, and peek operations on a stack.' },
  { id: 'vis-queue', algorithmId: 'queue-operations', topicIds: ['cse205-u3-t3'], label: 'Queue Visualizer', description: 'See enqueue and dequeue operations on a queue.' },
  { id: 'vis-linked-list', algorithmId: 'singly-linked-list', topicIds: ['cse205-u2-t1'], label: 'Linked List Visualizer', description: 'Visualize node connections and list operations.' },
  
  // Trees
  { id: 'vis-bst-insert', algorithmId: 'bst-insert', topicIds: ['cse205-u4-t3'], label: 'BST Insert Visualizer', description: 'Watch values being inserted into a binary search tree.' },
  { id: 'vis-bst-search', algorithmId: 'bst-search', topicIds: ['cse205-u4-t3'], label: 'BST Search Visualizer', description: 'See the search path through a BST.' },
  { id: 'vis-avl', algorithmId: 'avl-balancing', topicIds: [], label: 'AVL Tree Balancing', description: 'Visualize rotations to maintain AVL balance.' },
  
  // Graphs
  { id: 'vis-bfs', algorithmId: 'bfs', topicIds: ['cse205-u6-t1'], label: 'BFS Visualizer', description: 'Level-by-level graph traversal using a queue.' },
  { id: 'vis-dfs', algorithmId: 'dfs', topicIds: ['cse205-u6-t2'], label: 'DFS Visualizer', description: 'Depth-first exploration of a graph.' },
  { id: 'vis-dijkstra', algorithmId: 'dijkstra', topicIds: ['cse205-u6-t3'], label: "Dijkstra's Visualizer", description: 'Watch shortest path computation with distance relaxation.' },
  { id: 'vis-astar', algorithmId: 'a-star', topicIds: [], label: 'A* Search Visualizer', description: 'Heuristic-guided pathfinding visualization.' },
  { id: 'vis-prim', algorithmId: 'prim', topicIds: [], label: "Prim's MST Visualizer", description: 'Minimum spanning tree construction.' },
  { id: 'vis-kruskal', algorithmId: 'kruskal', topicIds: [], label: "Kruskal's MST Visualizer", description: 'Edge-based MST algorithm.' },
  
  // Recursion
  { id: 'vis-recursion', algorithmId: 'factorial', topicIds: ['cse202-u1-t13', 'cse205-u4-t1'], label: 'Recursion Visualizer', description: 'Visualize the call stack and recursive returns.' },
  { id: 'vis-hanoi', algorithmId: 'hanoi', topicIds: ['cse205-u4-t1'], label: 'Tower of Hanoi Visualizer', description: 'Watch discs move between pegs recursively.' },
  
  // DP
  { id: 'vis-fibonacci-dp', algorithmId: 'fibonacci-dp', topicIds: [], label: 'Fibonacci DP Visualizer', description: 'Compare recursive vs dynamic programming approaches.' },
  { id: 'vis-lcs', algorithmId: 'lcs', topicIds: [], label: 'LCS Visualizer', description: 'Longest Common Subsequence DP table construction.' },
  { id: 'vis-knapsack', algorithmId: 'knapsack', topicIds: [], label: '0/1 Knapsack Visualizer', description: 'Watch the knapsack DP table being filled.' },
  
  // Backtracking
  { id: 'vis-nqueens', algorithmId: 'n-queens', topicIds: [], label: 'N-Queens Visualizer', description: 'Backtracking placement of N queens on a chessboard.' },
];

export function getVisualizerForTopic(topicId: string): VisualizerMapping | undefined {
  return VISUALIZER_MAPPINGS.find(v => v.topicIds.includes(topicId));
}

export function getVisualizerById(id: string): VisualizerMapping | undefined {
  return VISUALIZER_MAPPINGS.find(v => v.id === id);
}

export function getVisualizerByAlgorithmId(algoId: string): VisualizerMapping | undefined {
  return VISUALIZER_MAPPINGS.find(v => v.algorithmId === algoId);
}

export function getAllVisualizers(): VisualizerMapping[] {
  return VISUALIZER_MAPPINGS;
}

export function getAlgoNerveUrl(algorithmId?: string): string {
  if (!algorithmId) return 'https://algonerve.vercel.app';
  return `https://algonerve.vercel.app/visualize/${algorithmId}`;
}
