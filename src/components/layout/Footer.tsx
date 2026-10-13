import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../../lib/config';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Code<span className="text-brand-600 dark:text-brand-400">Nerve</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The comprehensive computer science education platform integrated with AlgoNerve algorithm visualizer, curated coding problems, and university syllabi.
          </p>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Engineered by <span className="text-slate-700 dark:text-slate-300 font-medium">{APP_CONFIG.author}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Roadmaps & Problems</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/roadmap/dsa-roadmap" className="hover:text-brand-600 dark:hover:text-brand-300 transition">DSA Roadmap (12 Units)</Link></li>
            <li><Link to="/roadmap/cpp-path" className="hover:text-brand-600 dark:hover:text-brand-300 transition">C++ & OOP Learning Path</Link></li>
            <li><Link to="/problems" className="hover:text-brand-600 dark:hover:text-brand-300 transition">Curated Problem Catalogue</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-300 transition">Personal Problem Tracker</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Academic & Visualizer</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/university" className="hover:text-brand-600 dark:hover:text-brand-300 transition">LPU B.Tech CSE Syllabus</Link></li>
            <li><a href="https://algonerve.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 dark:hover:text-brand-300 transition flex items-center gap-1.5">AlgoNerve Visualizer <Sparkles className="h-3 w-3 text-brand-500 dark:text-brand-400" /></a></li>
            <li><Link to="/syllabus" className="hover:text-brand-600 dark:hover:text-brand-300 transition">Official Syllabus Checklist</Link></li>
            <li><Link to="/documentation" className="hover:text-brand-600 dark:hover:text-brand-300 transition">Algorithm Documentation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Platform Integrity</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            External problems link directly to original hosts (LeetCode, GFG, HackerRank) without copyright reproduction.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">LeetCode</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">GeeksforGeeks</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">HackerRank</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
        <div>&copy; {new Date().getFullYear()} CodeNerve. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-300 transition">Home</Link>
          <Link to="/problems" className="hover:text-slate-900 dark:hover:text-slate-300 transition">Problems</Link>
          <a href="https://algonerve.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-300 transition">AlgoNerve</a>
          <span className="text-slate-300 dark:text-slate-800">•</span>
          <Link to="/admin" className="text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition text-[11px]">Faculty & Admin</Link>
        </div>
      </div>
    </footer>
  );
};
