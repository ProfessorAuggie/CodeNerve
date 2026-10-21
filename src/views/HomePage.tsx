'use client';

import React, { useState } from 'react';
import { Link } from '../lib/router';
import { 
  Compass, 
  Sparkles, 
  Terminal, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Cpu,
  Zap,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { useUserStore } from '../store/userStore';

interface CodeSnippetPreview {
  id: string;
  title: string;
  lang: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  code: string;
  traceSteps: string[];
}

const PREVIEWS: CodeSnippetPreview[] = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    lang: 'C++ / Python / Java',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    description: 'Divide-and-conquer on sorted monotonic range by bisecting midpoint.',
    code: `int binarySearch(const vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target)  low = mid + 1;
        else                     high = mid - 1;
    }
    return -1; // Target not found
}`,
    traceSteps: [
      'Range: [0..7], mid = 3 (val: 12) < target (28) ➔ search right',
      'Range: [4..7], mid = 5 (val: 28) == target (28) ➔ MATCH FOUND',
      'Returned index: 5 in 2 comparisons.'
    ]
  },
  {
    id: 'bfs-graph',
    title: 'Graph BFS Traversal',
    lang: 'C++ STL (queue)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Level-order graph exploration guaranteeing shortest path on unweighted edges.',
    code: `vector<int> bfs(int startNode, const vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    vector<int> traversal;

    visited[startNode] = true;
    q.push(startNode);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        traversal.push_back(u);
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return traversal;
}`,
    traceSteps: [
      'Enqueue root 0 ➔ queue: [0], visited: {0}',
      'Pop 0 ➔ push neighbors {1, 2} ➔ queue: [1, 2]',
      'Pop 1 ➔ push neighbor {3} ➔ queue: [2, 3]',
      'Shortest path distances determined level-by-level.'
    ]
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache Design',
    lang: 'C++ (List + Hash Map)',
    timeComplexity: 'O(1) Get / Put',
    spaceComplexity: 'O(Capacity)',
    description: 'Constant-time eviction cache combining Doubly-Linked List with Hash Table.',
    code: `class LRUCache {
    int cap;
    list<pair<int, int>> dll; // {key, val}
    unordered_map<int, list<pair<int, int>>::iterator> map;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        if (!map.count(key)) return -1;
        dll.splice(dll.begin(), dll, map[key]); // Move to front
        return map[key]->second;
    }

    void put(int key, int value) {
        if (map.count(key)) {
            map[key]->second = value;
            dll.splice(dll.begin(), dll, map[key]);
            return;
        }
        if (dll.size() == cap) {
            map.erase(dll.back().first);
            dll.pop_back(); // Evict LRU
        }
        dll.emplace_front(key, value);
        map[key] = dll.begin();
    }
};`,
    traceSteps: [
      'put(1, 10), put(2, 20) ➔ DLL: [2:20, 1:10]',
      'get(1) ➔ moves 1 to front ➔ DLL: [1:10, 2:20]',
      'put(3, 30) (cap=2) ➔ evicts LRU key 2 ➔ DLL: [3:30, 1:10]'
    ]
  }
];

export const HomePage: React.FC = () => {
  const { setActivePortal } = useUserStore();
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const activeSnippet = PREVIEWS[activeSnippetIndex];

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setSimStep(0);
    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= activeSnippet.traceSteps.length - 1) {
          clearInterval(interval);
          setIsRunningSim(false);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const easyCount = PROBLEMS.filter((p) => p.difficulty === 'easy').length;
  const mediumCount = PROBLEMS.filter((p) => p.difficulty === 'medium').length;
  const hardCount = PROBLEMS.filter((p) => p.difficulty === 'hard').length;

  const popularAlgos = [
    { id: 'bubble-sort', name: 'Bubble Sort', category: 'Sorting', icon: '📊', time: 'O(N²)' },
    { id: 'binary-search', name: 'Binary Search', category: 'Searching', icon: '🔍', time: 'O(log N)' },
    { id: 'singly-linked-list', name: 'Linked List', category: 'Data Structures', icon: '🔗', time: 'O(1) insert' },
    { id: 'bfs', name: 'Breadth-First Search', category: 'Graphs', icon: '🕸️', time: 'O(V + E)' },
    { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'Graphs', icon: '⚡', time: 'O((V+E)log V)' },
    { id: 'bst-insert', name: 'BST Insert', category: 'Trees', icon: '🌲', time: 'O(h)' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-8 md:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          {/* Engineering Control Ribbon */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-purple-600 dark:text-purple-400">ENGINE v2.6 ACTIVE</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>DUAL-TRACK ARCHITECTURE</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1">
              <span>Sign In / Register ➔</span>
            </Link>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Engineered for Mastery in <br />
            <span className="text-slate-900 dark:text-white">
              Data Structures & Algorithms
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A developer platform combining a <strong>language-agnostic Global DSA dependency tree</strong> with the <strong>official LPU Computer Science C++ curriculum</strong> (CSE202 OOP & CSE205 DSA). Explore freely as a guest or sign in to record solutions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/roadmap"
              onClick={() => setActivePortal('global')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition group cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>🌐 Global DSA Tree</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              to="/lpu"
              onClick={() => setActivePortal('lpu')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition group cursor-pointer"
            >
              <GraduationCap className="h-4 w-4" />
              <span>🎓 LPU Academic Portal</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <a
              href="https://algonerve.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 font-bold text-xs sm:text-sm shadow-sm transition"
            >
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>AlgoNerve Visualizer ↗</span>
            </a>

            <Link
              to="/problems"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Problems ({PROBLEMS.length})</span>
            </Link>
          </div>
        </div>

        {/* ─── Hero Interactive Terminal / Code Execution Preview ─── */}
        <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-200">
          {/* Terminal Window Chrome */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="font-mono text-[11px] text-slate-400 ml-2">
                codenerve-runtime :: {activeSnippet.id}.cc
              </span>
            </div>

            {/* Snippet Switcher Tabs */}
            <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800 font-mono text-[11px]">
              {PREVIEWS.map((snippet, idx) => (
                <button
                  key={snippet.id}
                  onClick={() => {
                    setActiveSnippetIndex(idx);
                    setSimStep(0);
                  }}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    activeSnippetIndex === idx
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {snippet.title}
                </button>
              ))}
            </div>

            {/* Live Play Action */}
            <button
              onClick={handleRunSimulation}
              disabled={isRunningSim}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-[11px] font-bold transition shadow-sm cursor-pointer"
            >
              {isRunningSim ? <RotateCcw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              <span>{isRunningSim ? 'Tracing...' : 'Run Trace'}</span>
            </button>
          </div>

          {/* Terminal Code & Execution Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Code Listing */}
            <div className="md:col-span-8 p-4 font-mono text-xs overflow-x-auto bg-slate-900/90 leading-relaxed text-slate-300">
              <pre className="text-[12px] whitespace-pre-wrap">{activeSnippet.code}</pre>
            </div>

            {/* Execution Telemetry Sidecar */}
            <div className="md:col-span-4 p-4 space-y-4 bg-slate-950/60 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Complexity Bounds</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-[11px]">
                    Time: {activeSnippet.timeComplexity}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
                    Space: {activeSnippet.spaceComplexity}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Concept Objective</span>
                <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                  {activeSnippet.description}
                </p>
              </div>

              {/* Execution Trace Feed */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  <span>Verified Execution Trace</span>
                </span>
                <div className="space-y-1">
                  {activeSnippet.traceSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`text-[11px] p-1.5 rounded transition ${
                        idx === simStep
                          ? 'bg-purple-900/50 text-purple-200 border border-purple-500/50 font-bold'
                          : idx < simStep
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      › {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── High-Density Problem & Engine Telemetry Ribbon ─── */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Canonical Bank</span>
              <Terminal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{PROBLEMS.length} Problems</div>
            <div className="flex items-center gap-2 text-[10px] mt-1 font-mono font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">{easyCount} Easy</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400">{mediumCount} Med</span>
              <span>•</span>
              <span className="text-rose-600 dark:text-rose-400">{hardCount} Hard</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Interactive Sims</span>
              <Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">160+ Algos</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">AlgoNerve Simulation Suite</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Academic Syllabi</span>
              <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">CSE202 & 205</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">114 Official LPU Units</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Access Model</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">Zero Lockout</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Explore all paths without sign in</div>
          </div>
        </div>
      </section>

      {/* ─── Dual Track Architecture Cards ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">
            ARCHITECTURAL TRACKS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Two Specialized Learning Ecosystems
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Switch effortlessly between the universal interview roadmap and the university course modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track 1: Global DSA */}
          <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-sm hover:border-purple-500 transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                  🌐 TRACK 01: GLOBAL DSA
                </span>
                <span className="text-[11px] font-mono text-slate-500">Language-Agnostic</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Universal Dependency Tree
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Interactive 18-domain hierarchical graph. Solve problems and build deep algorithmic mental models in any programming language: Python, Java, C++, JavaScript, Go, or Rust.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span><strong>Prerequisite Visual Trace:</strong> Node-by-node dependency graph with interactive parent trace-back</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span><strong>Multi-Platform Problems:</strong> Canonical curated questions from LeetCode, HackerRank, GeeksforGeeks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span><strong>Deep Visualizer Integration:</strong> Instant links to step-by-step AlgoNerve simulations</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/roadmap"
                onClick={() => setActivePortal('global')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <span>Launch Global Tree</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/problems"
                onClick={() => setActivePortal('global')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition"
              >
                <span>Problem List</span>
              </Link>
            </div>
          </div>

          {/* Track 2: LPU Academic Portal */}
          <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-sm hover:border-emerald-500 transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  🎓 TRACK 02: LPU ACADEMIC PORTAL
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Pure C++ Focus</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  LPU B.Tech CSE Curriculum (C++)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Engineered specifically for Lovely Professional University faculty and students. Aligned unit-by-unit with official CSE202 (OOP in C++) and CSE205 (Data Structures in C++) syllabi.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>Dedicated C++ Rigor:</strong> Pointers, heap memory, class templates, operator overloading, STL</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>Complete Unit Coverage:</strong> CSE202 OOP (Units 1–6) & CSE205 DSA in C++ (Units 1–6)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>Official Academic Checklist:</strong> 114 curriculum lesson milestones, unit quizzes, and tests</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/lpu"
                onClick={() => setActivePortal('lpu')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <span>Enter LPU Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/syllabus"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition"
              >
                <span>View Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AlgoNerve Visualizer Showcase ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
              STEP-BY-STEP SIMULATION ENGINE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive AlgoNerve Visualizers
            </h2>
          </div>
          <a
            href="https://algonerve.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Explore all 160+ algorithms on AlgoNerve ↗</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularAlgos.map((algo) => (
            <a
              key={algo.id}
              href={`https://algonerve.vercel.app/visualize/${algo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-purple-500 shadow-sm transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                  {algo.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                    {algo.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{algo.category}</span>
                    <span>•</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{algo.time}</span>
                  </div>
                </div>
              </div>
              <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-white group-hover:bg-purple-600 transition">
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── Platform Architectural Pillars ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Built for Academic Excellence & Industry Interviews
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            A methodical, structured workflow from foundational memory allocation to graph algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Structured Roadmaps</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Prerequisite-ordered paths for DSA and Modern C++. Step systematically through arrays, trees, graphs, and dynamic programming without jumping blindly.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">LPU Academic Alignment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct unit-by-unit mapping to CSE202 OOP and CSE205 Data Structures. Every exam unit connects directly to visualizations, lessons, and practice problems.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Practice & Telemetry</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Record solutions, bookmarks, and notes. Seamlessly switch between guest explorer mode and authenticated student progress tracking with real-time faculty sync.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
