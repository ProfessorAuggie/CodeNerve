import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  RotateCcw, 
  Bookmark, 
  ExternalLink, 
  Trash2, 
  RefreshCw,
  LogIn,
  LogOut,
  Edit3
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { PROBLEMS, isProblemInTrack } from '../data/problems';
import { ProblemModal } from '../components/problems/ProblemModal';
import { EditProfileModal } from '../components/common/EditProfileModal';
import type { Problem } from '../types';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    problemProgress, 
    bookmarks, 
    customProblemSets, 
    deleteCustomProblemSet, 
    resetProgress,
    activePortal,
    isStudentAuthenticated,
    updateStudentActivity
  } = useUserStore();

  useEffect(() => {
    if (isStudentAuthenticated) {
      updateStudentActivity('Viewing performance dashboard & solved progress');
    }
  }, [isStudentAuthenticated, updateStudentActivity]);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Active portal filtered problems (with dual-track support)
  const portalProblems = PROBLEMS.filter((p) => isProblemInTrack(p, activePortal));
  const portalProblemIds = new Set(portalProblems.map((p) => p.id));

  // Solved counts within active portal
  const solvedProblems = Object.values(problemProgress).filter(
    (p) => portalProblemIds.has(p.problemId) && p.status === 'SOLVED'
  );
  const revisionProblems = Object.values(problemProgress).filter(
    (p) => portalProblemIds.has(p.problemId) && p.status === 'REVISION_NEEDED'
  );

  const totalCount = portalProblems.length;
  const solvedCount = solvedProblems.length;
  const overallPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Difficulty counts within active portal
  const easyTotal = portalProblems.filter((p) => p.difficulty === 'easy').length;
  const medTotal = portalProblems.filter((p) => p.difficulty === 'medium').length;
  const hardTotal = portalProblems.filter((p) => p.difficulty === 'hard').length;

  const easySolved = solvedProblems.filter((p) => {
    const prob = portalProblems.find((item) => item.id === p.problemId);
    return prob?.difficulty === 'easy';
  }).length;

  const medSolved = solvedProblems.filter((p) => {
    const prob = portalProblems.find((item) => item.id === p.problemId);
    return prob?.difficulty === 'medium';
  }).length;

  const hardSolved = solvedProblems.filter((p) => {
    const prob = portalProblems.find((item) => item.id === p.problemId);
    return prob?.difficulty === 'hard';
  }).length;

  // Bookmarked problem objects within active portal
  const bookmarkedItems = bookmarks
    .filter((id) => portalProblemIds.has(id))
    .map((id) => portalProblems.find((p) => p.id === id))
    .filter((p): p is Problem => !!p);

  // Revision problem objects within active portal
  const revisionItems = revisionProblems
    .map((p) => portalProblems.find((item) => item.id === p.problemId))
    .filter((p): p is Problem => !!p);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Guest Notice (if not authenticated) */}
      {!isStudentAuthenticated && (
        <div className="p-4 rounded-2xl border border-brand-500/30 bg-brand-500/10 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brand-900 dark:text-brand-100">
          <div className="space-y-1">
            <div className="font-bold text-sm flex items-center gap-2">
              <LogIn className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>You are viewing CodeNerve as Guest</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Sign in with your student registration number or email to save solved DSA problems, submit midterm lab codes, and sync across devices.
            </p>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-center shadow-md shadow-brand-500/20 transition shrink-0"
          >
            Student Sign In ➔
          </Link>
        </div>
      )}

      {/* User Header Profile */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-brand-500/25">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isStudentAuthenticated
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 border-brand-200 dark:border-brand-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
              }`}>
                {isStudentAuthenticated ? 'Student Account' : 'Guest Mode'}
              </span>
              {user.track && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  user.track === 'lpu'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                }`}>
                  {user.track === 'lpu' ? 'LPU Track' : 'Global Track'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user.university} &bull; Semester {user.semester}
              {user.registrationNumber ? ` • Reg: ${user.registrationNumber}` : ''}
              {user.batch ? ` • ${user.batch}` : ''}
            </p>
          </div>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-2.5">
          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition shadow-sm cursor-pointer"
            title="Edit student profile details"
          >
            <Edit3 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Edit Profile</span>
          </button>

          {isStudentAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition shadow-sm"
              title="Switch to another student account or sign in"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-400" />
              <span>Switch Student</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            onClick={() => setConfirmReset(!confirmReset)}
            className="p-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/30 transition shadow-sm"
            title="Reset progress"
            aria-label="Reset progress"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Profile Updated Alert Banner */}
      {profileSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
          <button
            onClick={() => setProfileSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Confirm Reset Alert */}
      {confirmReset && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between text-xs text-rose-800 dark:text-rose-200">
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
              className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Solved Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Overall Progress</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {solvedCount} <span className="text-sm font-normal text-slate-400 dark:text-slate-500">/ {totalCount}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{overallPercent}% of catalogue solved</div>
        </div>

        {/* Easy Distribution */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase">
            <span>Easy</span>
            <span>{easySolved}/{easyTotal}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">{easySolved} solved</div>
        </div>

        {/* Medium Distribution */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase">
            <span>Medium</span>
            <span>{medSolved}/{medTotal}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">{medSolved} solved</div>
        </div>

        {/* Hard Distribution */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase">
            <span>Hard</span>
            <span>{hardSolved}/{hardTotal}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Revision Queue</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              {revisionItems.length} problems
            </span>
          </div>

          {revisionItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No problems currently flagged for revision. Click 'Revise Later' on any problem to queue it here.
            </div>
          ) : (
            <div className="space-y-2">
              {revisionItems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-300">
                      {prob.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {prob.platform} &bull; {prob.difficulty}
                    </div>
                  </div>
                  <a
                    href={prob.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Problems */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bookmarked Problems</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              {bookmarkedItems.length} saved
            </span>
          </div>

          {bookmarkedItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No bookmarked problems. Click the bookmark icon on any problem to save it for later.
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarkedItems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-300">
                      {prob.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {prob.platform} &bull; {prob.difficulty}
                    </div>
                  </div>
                  <a
                    href={prob.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Course Tests & Problem Bundles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Curated assignments and topic bundles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customProblemSets.map((set) => (
            <div
              key={set.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{set.title}</h4>
                <button
                  onClick={() => deleteCustomProblemSet(set.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-md"
                  title="Delete set"
                  aria-label="Delete set"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{set.description}</p>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium pt-1">
                {set.problemIds.length} Assigned Problems
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Modal */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        mode="student-self"
        onSuccess={(msg) => {
          setProfileSuccessMsg(msg);
          setTimeout(() => setProfileSuccessMsg(null), 4000);
        }}
      />
    </div>
  );
};
