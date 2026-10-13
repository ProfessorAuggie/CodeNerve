import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Compass, 
  BookOpen, 
  Terminal, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { PROBLEMS } from '../../data/problems';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setRole, problemProgress } = useUserStore();

  const totalProblems = PROBLEMS.length;
  const solvedCount = Object.values(problemProgress).filter((p) => p.status === 'SOLVED').length;
  const progressPercent = Math.round((solvedCount / totalProblems) * 100);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'DSA Roadmap', path: '/roadmap/dsa-roadmap', icon: Compass },
    { name: 'C++ Path', path: '/roadmap/cpp-path', icon: Code2 },
    { name: 'Problems', path: '/problems', icon: Terminal },
    { name: 'University Syllabus', path: '/university', icon: GraduationCap },
    { name: 'Visualizer', path: '/visualize', icon: Sparkles, badge: 'AlgoNerve' },
    { name: 'Quizzes', path: '/quizzes', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-brand-500/25 transition group-hover:scale-105 group-hover:shadow-brand-500/40">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-300 transition">
                Code<span className="text-brand-400">Nerve</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                NeetCode + Algo
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-slate-800/80 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Progress pill & Role Toggle */}
        <div className="flex items-center gap-3">
          {/* Progress Pill */}
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{solvedCount}</span>
              <span className="text-slate-500">/</span>
              <span>{totalProblems}</span>
            </div>
            <div className="h-2 w-14 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-400">{progressPercent}%</span>
          </Link>

          {/* Role Mode Switcher (Student / Teacher Mode) */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-xs">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                user.role === 'student'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Student Mode: track problems and practice"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Student</span>
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                user.role === 'teacher'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Teacher Mode: create problem sets and syllabus assignments"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Teacher</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg ${
                  active
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
