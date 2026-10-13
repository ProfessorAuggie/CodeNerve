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
  GitFork 
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { PROBLEMS } from '../../data/problems';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, problemProgress, activePortal, setActivePortal, isAdminAuthenticated } = useUserStore();

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

  // Nav links dynamically adapted for Global vs LPU portals
  const globalNavLinks = [
    { name: 'DSA Roadmap', path: '/roadmap', icon: GitFork, badge: 'Generic' },
    { name: 'Problems', path: '/problems', icon: Terminal },
    { name: 'Visualizer', path: 'https://algonerve.vercel.app', icon: Sparkles, badge: 'AlgoNerve', isExternal: true },
    { name: 'Quizzes', path: '/quizzes', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: CheckCircle2 },
  ];

  const lpuNavLinks = [
    { name: 'LPU Syllabus', path: '/lpu', icon: GraduationCap, badge: 'CSE' },
    { name: 'Academic Roadmap', path: '/roadmap', icon: GitFork, badge: 'CSE202/205' },
    { name: 'Problems Bank', path: '/problems', icon: Terminal },
    { name: 'Visualizer', path: 'https://algonerve.vercel.app', icon: Sparkles, badge: 'AlgoNerve', isExternal: true },
    { name: 'Exam Quizzes', path: '/quizzes', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: CheckCircle2 },
  ];

  const currentNavLinks = activePortal === 'lpu' ? lpuNavLinks : globalNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8">
        {/* Brand Logo & Portal Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-brand-500/25 transition group-hover:scale-105 group-hover:shadow-brand-500/40">
              <Code2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-brand-300 transition">
                Code<span className="text-brand-400">Nerve</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {activePortal === 'lpu' ? 'LPU Portal' : 'Global DSA'}
              </span>
            </div>
          </Link>

          {/* Dual Platform Switcher: Global Public (Generic) vs LPU University (C++) */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/95 p-0.5 text-xs shadow-inner">
            <button
              onClick={() => {
                setActivePortal('global');
                if (location.pathname === '/lpu' || location.pathname === '/teacher') navigate('/roadmap');
              }}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg font-bold transition text-[11px] sm:text-xs ${
                activePortal === 'global'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200'
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
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Lovely Professional University Academic Portal (CSE202 / CSE205)"
            >
              <GraduationCap className="h-3 w-3" />
              <span>LPU Portal</span>
            </button>
          </div>
        </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-0.5">
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
                    className="relative flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-400" />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-semibold px-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
                  className={`relative flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-slate-800/80 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

        {/* Right Section: Progress pill & Role Toggle */}
        <div className="flex items-center gap-2">
          {/* Progress Pill */}
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{solvedCount}</span>
              <span className="text-slate-500">/</span>
              <span>{totalProblems}</span>
            </div>
            <div className="h-1.5 w-10 sm:w-12 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-400">{progressPercent}%</span>
          </Link>

          {/* Student Profile Link */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Student Learning Profile & Dashboard"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/30 text-brand-300 text-[10px] font-bold">
              {user.name[0]}
            </div>
            <span className="hidden md:inline font-medium">{user.name.split(' ')[0]}</span>
          </Link>

          {/* Discreet Faculty / Admin Access Link */}
          <Link
            to="/admin"
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition ${
              isAdminAuthenticated
                ? 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:bg-purple-900/50'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Faculty & Instructor Admin Portal (Restricted)"
          >
            <ShieldCheck className={`h-3.5 w-3.5 ${isAdminAuthenticated ? 'text-purple-400' : 'text-slate-400'}`} />
            <span className="hidden xl:inline">{isAdminAuthenticated ? 'Admin' : 'Faculty'}</span>
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          {/* Mobile Platform Switcher */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
            <button
              onClick={() => {
                setActivePortal('global');
                setMobileMenuOpen(false);
                navigate('/roadmap');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition ${
                activePortal === 'global' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              🌐 Global DSA Track
            </button>
            <button
              onClick={() => {
                setActivePortal('lpu');
                setMobileMenuOpen(false);
                navigate('/lpu');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition ${
                activePortal === 'lpu' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              🎓 LPU Academic Portal
            </button>
          </div>

          <div className="space-y-1.5">
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
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-brand-400" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
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
        </div>
      )}
    </header>
  );
};
