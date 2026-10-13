import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Hourglass, 
  RotateCcw, 
  Bookmark, 
  Award, 
  User, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  Trash2, 
  RefreshCw,
  Compass,
  Sparkles
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { PROBLEMS } from '../data/problems';
import { ProblemModal } from '../components/problems/ProblemModal';
import type { Problem } from '../types';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    setRole, 
    problemProgress, 
    bookmarks, 
    customProblemSets, 
    deleteCustomProblemSet, 
    resetProgress 
  } = useUserStore();

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Solved counts
  const solvedProblems = Object.values(problemProgress).filter((p) => p.status === 'SOLVED');
  const attemptedProblems = Object.values(problemProgress).filter((p) => p.status === 'ATTEMPTED');
  const revisionProblems = Object.values(problemProgress).filter((p) => p.status === 'REVISION_NEEDED');

  const totalCount = PROBLEMS.length;
  const solvedCount = solvedProblems.length;
  const overallPercent = Math.round((solvedCount / totalCount) * 100);

  // Difficulty counts
  const easyTotal = PROBLEMS.filter((p) => p.difficulty === 'easy').length;
  const medTotal = PROBLEMS.filter((p) => p.difficulty === 'medium').length;
  const hardTotal = PROBLEMS.filter((p) => p.difficulty === 'hard').length;

  const easySolved = solvedProblems.filter((p) => {
    const prob = PROBLEMS.find((item) => item.id === p.problemId);
    return prob?.difficulty === 'easy';
  }).length;

  const medSolved = solvedProblems.filter((p) => {
    const prob = PROBLEMS.find((item) => item.id === p.problemId);
    return prob?.difficulty === 'medium';
  }).length;

  const hardSolved = solvedProblems.filter((p) => {
    const prob = PROBLEMS.find((item) => item.id === p.problemId);
    return prob?.difficulty === 'hard';
  }).length;

  // Bookmarked problem objects
  const bookmarkedItems = bookmarks
    .map((id) => PROBLEMS.find((p) => p.id === id))
    .filter((p): p is Problem => !!p);

  // Revision problem objects
  const revisionItems = revisionProblems
    .map((p) => PROBLEMS.find((item) => item.id === p.problemId))
    .filter((p): p is Problem => !!p);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Profile */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/25">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {user.name}
              </h1>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                user.role === 'teacher'
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  : 'bg-brand-500/10 text-brand-300 border-brand-500/30'
              }`}>
                {user.role} mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.university} &bull; Semester {user.semester}
            </p>
          </div>
        </div>

        {/* Role toggle and reset controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRole(user.role === 'student' ? 'teacher' : 'student')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700"
          >
            {user.role === 'student' ? <ShieldCheck className="h-3.5 w-3.5 text-purple-400" /> : <User className="h-3.5 w-3.5 text-brand-400" />}
            <span>Switch to {user.role === 'student' ? 'Teacher' : 'Student'}</span>
          </button>

          <button
            onClick={() => setConfirmReset(!confirmReset)}
            className="p-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition"
            title="Reset progress"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Confirm Reset Alert */}
      {confirmReset && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 flex items-center justify-between text-xs text-rose-200">
          <span>Are you sure you want to reset all your progress data? This cannot be undone.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500 transition"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Solved Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overall Progress</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {solvedCount} <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">{overallPercent}% of catalogue solved</div>
        </div>

        {/* Easy Distribution */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase">
            <span>Easy</span>
            <span>{easySolved}/{easyTotal}</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">{easySolved} solved</div>
        </div>

        {/* Medium Distribution */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase">
            <span>Medium</span>
            <span>{medSolved}/{medTotal}</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">{medSolved} solved</div>
        </div>

        {/* Hard Distribution */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold uppercase">
            <span>Hard</span>
            <span>{hardSolved}/{hardTotal}</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">{hardSolved} solved</div>
        </div>
      </div>

      {/* Two Columns: Revision Queue & Bookmarked Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revision Queue */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">Revision Queue</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {revisionItems.length} problems
            </span>
          </div>

          {revisionItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No problems currently flagged for revision. Click 'Revise Later' on any problem to queue it here.
            </div>
          ) : (
            <div className="space-y-2">
              {revisionItems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-white hover:text-brand-300">
                      {prob.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {prob.platform} &bull; {prob.difficulty}
                    </div>
                  </div>
                  <a
                    href={prob.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Problems */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Bookmarked Problems</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {bookmarkedItems.length} saved
            </span>
          </div>

          {bookmarkedItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No bookmarked problems. Click the bookmark icon on any problem to save it for later.
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarkedItems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-white hover:text-brand-300">
                      {prob.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {prob.platform} &bull; {prob.difficulty}
                    </div>
                  </div>
                  <a
                    href={prob.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Problem Sets / Teacher Assignment Sets */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Teacher & Custom Problem Sets</h3>
            <p className="text-xs text-slate-400">Curated assignments and topic bundles</p>
          </div>
          <Link
            to="/teacher"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Manage Problem Sets</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customProblemSets.map((set) => (
            <div
              key={set.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{set.title}</h4>
                <button
                  onClick={() => deleteCustomProblemSet(set.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Delete set"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">{set.description}</p>
              <div className="text-xs text-purple-400 font-medium pt-1">
                {set.problemIds.length} Assigned Problems
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};
