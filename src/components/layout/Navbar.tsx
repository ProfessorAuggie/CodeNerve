import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  BookOpen, 
  Terminal, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Globe, 
  GitFork,
  LogIn,
  LogOut
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { PROBLEMS } from '../../data/problems';

import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    user, 
    problemProgress, 
    activePortal, 
    setActivePortal, 
    isAdminAuthenticated, 
    isStudentAuthenticated, 
    logoutStudent 
  } = useUserStore();

  const portalProblems = PROBLEMS.filter((p) => (p.track || 'global') === activePortal);
  const portalProblemIds = new Set(portalProblems.map((p) => p.id));
  const totalProblems = portalProblems.length;
  const solvedCount = Object.values(problemProgress).filter(
    (p) => portalProblemIds.has(p.problemId) && p.status === 'SOLVED'
  ).length;
  const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const globalNavLinks = [
    { name: 'DSA Roadmap', path: '/roadmap', icon: GitFork, badge: 'Generic' },
    { name: 'Problems', path: '/problems', icon: Terminal },
    { name: 'Visualizer', path: 'https://algonerve.vercel.app', icon: Sparkles, badge: 'AlgoNerve', isExternal: true },
    { name: 'Dashboard', path: '/dashboard', icon: CheckCircle2 },
  ];

  const lpuNavLinks = [
    { name: 'LPU Syllabus', path: '/syllabus', icon: GraduationCap, badge: 'CSE202/205' },
    { name: 'Academic Roadmap', path: '/roadmap', icon: GitFork, badge: 'Flowchart' },
    { name: 'Problems Bank', path: '/problems', icon: Terminal },
    { name: 'Visualizer', path: 'https://algonerve.vercel.app', icon: Sparkles, badge: 'AlgoNerve', isExternal: true },
    { name: 'Dashboard', path: '/dashboard', icon: CheckCircle2 },
  ];

  const currentNavLinks = activePortal === 'lpu' ? lpuNavLinks : globalNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8">
        {/* Brand Logo & Portal Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-brand-500/25 transition group-hover:scale-105 group-hover:shadow-brand-500/40">
              <Code2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition">
                Code<span className="text-brand-600 dark:text-brand-400">Nerve</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                {activePortal === 'lpu' ? 'LPU Portal' : 'Global DSA'}
              </span>
            </div>
          </Link>

          {/* Dual Platform Switcher: Global Public (Generic) vs LPU University (C++) */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/95 p-0.5 text-xs shadow-inner">
            <button
              onClick={() => {
                setActivePortal('global');
                if (location.pathname === '/lpu' || location.pathname === '/teacher') navigate('/roadmap');
              }}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg font-bold transition text-[11px] sm:text-xs ${
                activePortal === 'global'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Generic Public Coding Track (Language Agnostic: Python, Java, C++, JS, Go)"
            >
              <Globe className="h-3 w-3" />
              <span>Global DSA</span>
            </button>

            <button
              onClick={() => {
                setActivePortal('lpu');
                navigate('/lpu');
              }}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg font-bold transition text-[11px] sm:text-xs ${
                activePortal === 'lpu'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Lovely Professional University Academic Portal (CSE202 / CSE205)"
            >
              <GraduationCap className="h-3 w-3" />
              <span>LPU Portal</span>
            </button>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {currentNavLinks.map((link) => {
            const active = !link.isExternal && isActive(link.path);
            const Icon = link.icon;
            if (link.isExternal) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-semibold px-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  active
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-brand-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
                {active && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-brand-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Progress pill & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle (Desktop) */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Progress Pill */}
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{solvedCount}</span>
              <span className="text-slate-400">/</span>
              <span>{totalProblems}</span>
            </div>
            <div className="h-1.5 w-10 sm:w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{progressPercent}%</span>
          </Link>

          {/* Student Profile / Sign In Link */}
          {isStudentAuthenticated ? (
            <div className="flex items-center gap-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition"
                title={`Student Learning Profile: ${user.name}`}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/20 dark:bg-brand-600/30 text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                  {user.name[0]}
                </div>
                <span className="hidden md:inline font-medium">{user.name.split(' ')[0]}</span>
              </Link>
              <Link
                to="/login"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Switch Student Account / Sign In"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white px-3 py-1 text-xs font-semibold shadow-sm shadow-brand-500/25 transition"
              title="Student Login & Sign In"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Platform Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1 text-xs">
            <button
              onClick={() => {
                setActivePortal('global');
                setMobileMenuOpen(false);
                navigate('/roadmap');
              }}
              className={`flex-1 py-2 rounded-lg font-bold text-center transition min-h-[44px] flex items-center justify-center gap-1.5 ${
                activePortal === 'global'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Global DSA</span>
            </button>
            <button
              onClick={() => {
                setActivePortal('lpu');
                setMobileMenuOpen(false);
                navigate('/lpu');
              }}
              className={`flex-1 py-2 rounded-lg font-bold text-center transition min-h-[44px] flex items-center justify-center gap-1.5 ${
                activePortal === 'lpu'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>LPU Portal</span>
            </button>
          </div>

          {/* Theme Selector (Mobile) */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Appearance</div>
            <ThemeToggle showLabel className="w-full" />
          </div>

          <div className="space-y-1">
            {currentNavLinks.map((link) => {
              const active = !link.isExternal && isActive(link.path);
              const Icon = link.icon;
              if (link.isExternal) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 min-h-[44px] text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-brand-500 dark:text-brand-400" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                        {link.badge}
                      </span>
                    )}
                  </a>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 min-h-[44px] text-sm font-semibold rounded-xl transition ${
                    active
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Dashboard Progress on Mobile */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Progress: <strong className="text-slate-800 dark:text-white">{solvedCount}/{totalProblems}</strong> ({progressPercent}%)</span>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              View Analytics ➔
            </Link>
          </div>

          {/* Student Auth Bar on Mobile */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs px-1">
            {isStudentAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold">
                    {user.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-500">{user.track === 'lpu' ? 'LPU Portal' : 'Global DSA'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-brand-600 dark:text-brand-400 font-semibold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logoutStudent();
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="text-rose-600 dark:text-rose-400 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-600 text-white font-bold text-center text-xs shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Student Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
