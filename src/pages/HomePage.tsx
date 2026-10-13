import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Terminal, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { useUserStore } from '../store/userStore';

export const HomePage: React.FC = () => {
  const { setActivePortal } = useUserStore();

  const popularAlgos = [
    { id: 'bubble-sort', name: 'Bubble Sort', category: 'Sorting', icon: '📊' },
    { id: 'binary-search', name: 'Binary Search', category: 'Searching', icon: '🔍' },
    { id: 'singly-linked-list', name: 'Linked List', category: 'Data Structures', icon: '🔗' },
    { id: 'bfs', name: 'Breadth-First Search', category: 'Graphs', icon: '🕸️' },
    { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'Graphs', icon: '⚡' },
    { id: 'bst-insert', name: 'BST Insert', category: 'Trees', icon: '🌲' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Glow ambient effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/20 to-purple-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-brand-600 dark:text-brand-300 shadow-sm dark:shadow-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Dual-Track Architecture</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400">Switch Portals in Top Navbar</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Master Data Structures & Algorithms <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-400">
              Generic DSA & Dedicated LPU C++
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose between the <strong>language-agnostic Global DSA roadmap</strong> (solve in Python, Java, C++, JS, Go) and the <strong>official LPU Computer Science curriculum</strong> (CSE202 OOP & CSE205 DSA in C++). Switch anytime via the navbar.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              to="/roadmap"
              onClick={() => setActivePortal('global')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition group cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>🌐 Global DSA Track</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              to="/lpu"
              onClick={() => setActivePortal('lpu')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition group cursor-pointer"
            >
              <GraduationCap className="h-4 w-4" />
              <span>🎓 LPU Academic Portal</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <a
              href="https://algonerve.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-sm transition"
            >
              <Sparkles className="h-4 w-4 text-brand-500 dark:text-brand-400" />
              <span>AlgoNerve Visualizer ↗</span>
            </a>

            <Link
              to="/problems"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-sm font-medium transition"
            >
              <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Problems</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">160+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Algorithms in AlgoNerve</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{PROBLEMS.length}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Curated Coding Problems</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">2</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">LPU Syllabi (CSE202 & 205)</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Free & Privacy-Focused</div>
            </div>
          </div>

          {/* Dual Platform Split: Generic Public vs LPU Portal Gateway */}
          <div className="pt-12 text-left">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-brand-600 dark:text-brand-300 font-semibold shadow-sm">
                <span>Select Your Learning Track</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Two Dedicated Ecosystems, One Platform
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose between the universal DSA dependency flowchart or the official LPU University academic curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Track 1: Generic Public Portal */}
              <div className="relative group rounded-3xl border border-brand-500/30 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/90 dark:to-slate-950/90 p-8 shadow-sm dark:shadow-xl hover:border-brand-500 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/20 transition" />
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-bold text-brand-600 dark:text-brand-300">
                      <span>🌐 Global DSA Track (Language Agnostic)</span>
                    </div>
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Python • Java • C++ • JS • Go</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition">
                      Global DSA Dependency Roadmap
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      Interactive 18-topic hierarchical flowchart with dotted matrix canvas and bezier curve branches. Solve problems and build deep algorithmic intuition in any programming language (Python, Java, C++, JavaScript, Go, etc.).
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span><strong>Language Agnostic:</strong> Focus on core logic, time/space trade-offs, and interview patterns in any language</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span><strong>Branching Flowchart:</strong> Visual dependency graph with interactive prerequisite hover trace-back</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span><strong>Curated Multi-Platform:</strong> Canonical problems from LeetCode, GfG, HackerRank</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span><strong>AlgoNerve Visualizer:</strong> Step-by-step algorithmic simulations in a new tab</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/roadmap"
                    onClick={() => setActivePortal('global')}
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition group/btn"
                  >
                    <span>Launch DSA Tree</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-btn/hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/problems"
                    onClick={() => setActivePortal('global')}
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                  >
                    <span>Problem List</span>
                  </Link>
                </div>
              </div>

              {/* Track 2: LPU Academic Portal */}
              <div className="relative group rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-white to-emerald-50/20 dark:from-slate-900/90 dark:to-slate-950/90 p-8 shadow-sm dark:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition" />
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <span>🎓 LPU Academic Portal (C++ Curriculum)</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Dedicated C++ Syllabus</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                      LPU B.Tech CSE Curriculum (C++)
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      Custom tailored for Lovely Professional University students and professors. Dedicated pure C++ implementation mapped unit-by-unit with prerequisites across official CSE202 and CSE205 syllabi.
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span><strong>Dedicated C++ Focus:</strong> Pointers, heap memory (new/delete), classes, operator overloading & STL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span><strong>CSE202 (C++ OOP):</strong> Units 1–6 (Classes, Constructors, Polymorphism, Templates, Files)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span><strong>CSE205 (Data Structures in C++):</strong> Units 1–6 (Arrays, Stacks, Queues, Trees, Graphs)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span><strong>Dedicated Syllabus & Topics:</strong> Official 114-topic curriculum checklist, lab experiments & problem sets</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/lpu"
                    onClick={() => setActivePortal('lpu')}
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition group/btn"
                  >
                    <span>Enter LPU Academic Portal</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-btn/hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/problems"
                    onClick={() => setActivePortal('lpu')}
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                  >
                    <span>LPU Question Bank</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizer Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
              Integrated AlgoNerve Engine
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Watch Algorithms Step Through in Real-Time
            </h2>
          </div>
          <a
            href="https://algonerve.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Browse all algorithms on AlgoNerve ↗</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularAlgos.map((algo) => (
            <a
              key={algo.id}
              href={`https://algonerve.vercel.app/visualize/${algo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-500/50 shadow-sm transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-2xl h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition">
                  {algo.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition">
                    {algo.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{algo.category}</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-white group-hover:bg-brand-600 transition">
                <ExternalLink className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for University Students & Job Seekers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A cohesive workflow from foundational syntax to competitive interview problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Structured Roadmaps</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Prerequisite-ordered paths for DSA (12 units) and Modern C++ (12 units). Step methodically through arrays, trees, graphs, and dynamic programming without jumping blindly.
            </p>
            <Link
              to="/roadmap/dsa-roadmap"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1 pt-2"
            >
              <span>View Roadmaps</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">University Syllabus Alignments</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct mapping to Lovely Professional University (LPU) CSE courses (CSE202 OOP & CSE205 DSA). Every exam unit connects directly to visualizations, lessons, and practice problems.
            </p>
            <Link
              to="/syllabus"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 pt-2"
            >
              <span>Explore LPU Syllabus</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Progress & Personal Tracking</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mark problems as Solved, Attempted, or Need Revision. Record personal intuitive notes, complexity reflections, and track your distribution across Easy, Medium, and Hard.
            </p>
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center gap-1 pt-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
