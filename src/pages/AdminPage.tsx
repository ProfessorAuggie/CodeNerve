import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Activity, 
  FileText, 
  GraduationCap, 
  Globe, 
  Lock, 
  Unlock, 
  Key, 
  UserPlus, 
  X,
  ExternalLink,
  BarChart3,
  Check,
  AlertCircle,
  RefreshCw,
  Edit3,
  BookOpen
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { PROBLEMS } from '../data/problems';
import { EditProfileModal } from '../components/common/EditProfileModal';
import type { StudentRecord } from '../types';

export const AdminPage: React.FC = () => {
  const { 
    user,
    students, 
    assignedTests, 
    isAdminAuthenticated, 
    authenticateAdmin, 
    logoutAdmin, 
    assignTest, 
    deleteAssignedTest,
    approveStudent,
    disapproveStudent,
    deleteStudent,
    registerStudent,
    syncCohortData 
  } = useUserStore();

  // Authentication Form State
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'students' | 'assign-test' | 'onboard-student'>('students');
  const [dossierTab, setDossierTab] = useState<'profile' | 'problems' | 'lessons' | 'quizzes' | 'tests'>('profile');

  // Student Roster Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState<'all' | 'global' | 'lpu'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'idle' | 'offline'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'disapproved'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);
  const [isAdminProfileModalOpen, setIsAdminProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-sync roster on component mount
  useEffect(() => {
    syncCohortData();
  }, [syncCohortData]);

  // Manual cohort re-sync handler
  const handleManualSync = () => {
    setIsSyncing(true);
    syncCohortData();
    setTimeout(() => {
      setIsSyncing(false);
      setToastMessage({ text: 'Cohort activity & roster synchronized with storage!', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  // New Test Form State
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [targetTrack, setTargetTrack] = useState<'all' | 'global' | 'lpu'>('lpu');
  const [targetBatch, setTargetBatch] = useState('LPU B.Tech CSE (CSE202/205)');
  const [subjectCode, setSubjectCode] = useState('CSE205');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [dueDate, setDueDate] = useState('2026-10-25');
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [problemSearch, setProblemSearch] = useState('');
  const [testCreatedSuccess, setTestCreatedSuccess] = useState(false);

  // New Student Manual Onboarding (Future Auth Simulation)
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentRegNo, setNewStudentRegNo] = useState('');
  const [newStudentTrack, setNewStudentTrack] = useState<'global' | 'lpu'>('lpu');
  const [newStudentBatch, setNewStudentBatch] = useState('LPU B.Tech CSE Section K22-A');
  const [studentCreatedSuccess, setStudentCreatedSuccess] = useState(false);

  // Handle Admin Passcode Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = authenticateAdmin(passcode);
    if (!success) {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 3000);
    } else {
      setPasscode('');
    }
  };

  // Handle Assigning a New Test
  const handleAssignTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || selectedProblemIds.length === 0) return;

    assignTest({
      title: testTitle.trim(),
      description: testDescription.trim(),
      targetTrack,
      targetBatch,
      subjectCode,
      problemIds: selectedProblemIds,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      dueDate,
      createdBy: 'Dr. Auggie (Faculty Admin)',
      totalAssignedCount: students.filter((s) => targetTrack === 'all' || s.track === targetTrack).length || 6,
    });

    setTestTitle('');
    setTestDescription('');
    setSelectedProblemIds([]);
    setTestCreatedSuccess(true);
    setTimeout(() => setTestCreatedSuccess(false), 3500);
  };

  // Handle Manual Student Registration (Future Auth test)
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    registerStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      registrationNumber: newStudentRegNo.trim() || `REG-${Date.now().toString().slice(-4)}`,
      track: newStudentTrack,
      batch: newStudentBatch,
      status: 'online',
      currentActivity: 'Just onboarded & exploring curriculum roadmap',
      lastActive: 'Just now',
      solvedProblemIds: [],
      completedLessons: [],
      quizScores: {},
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentRegNo('');
    setStudentCreatedSuccess(true);
    setTimeout(() => setStudentCreatedSuccess(false), 3500);
  };

  const toggleProblemSelection = (id: string) => {
    setSelectedProblemIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Filter students
  const filteredStudents = students.filter((std) => {
    const matchesQuery = 
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrack = trackFilter === 'all' || std.track === trackFilter;
    const matchesStatus = statusFilter === 'all' || std.status === statusFilter;
    const studentApproval = std.approvalStatus || 'approved';
    const matchesApproval = approvalFilter === 'all' || studentApproval === approvalFilter;

    return matchesQuery && matchesTrack && matchesStatus && matchesApproval;
  });

  // KPI calculations
  const totalStudentsCount = students.length;
  const pendingStudentsCount = students.filter((s) => s.approvalStatus === 'pending').length;
  const onlineStudentsCount = students.filter((s) => s.status === 'online').length;
  const totalProblemsSolvedCohort = students.reduce((acc, curr) => acc + curr.totalSolved, 0);
  const activeTestsCount = assignedTests.length;

  // Filter problems for test creator
  const availableProblemsForTest = PROBLEMS.filter((p) => {
    const matchesTrack = targetTrack === 'all' || (p.track || 'global') === targetTrack;
    const matchesSearch = 
      p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
      p.topicTags.some((t) => t.toLowerCase().includes(problemSearch.toLowerCase()));
    return matchesTrack && matchesSearch;
  });

  // ─────────────────────────────────────────────
  // 1. LOCKED VIEW: Admin Passcode Login Gate
  // ─────────────────────────────────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-8 shadow-xl dark:shadow-2xl relative transition-colors">
          <div className="text-center space-y-3">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 shadow-sm mb-1">
              <Lock className="h-7 w-7" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
              <span>FACULTY RESTRICTED ACCESS</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Faculty & Admin Command Center
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Live cohort intelligence, student approvals, practice analytics, and curriculum assessment management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Faculty Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode (e.g. admin123)"
                  autoFocus
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition font-mono"
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {authError && (
                <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium animate-in fade-in">
                  Invalid passcode. Try <code className="text-rose-600 dark:text-rose-300 font-bold font-mono">admin123</code>.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Unlock className="h-4 w-4" />
              <span>Unlock Admin Command Center</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Default testing key: <code className="text-purple-600 dark:text-purple-300 font-mono font-bold">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 2. UNLOCKED VIEW: Full Admin Command Center
  // ─────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Admin Session Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Faculty Admin Command Center</span>
            </div>
            <span className="text-slate-400 text-xs hidden sm:inline">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs hidden sm:inline font-mono">LIVE ROSTER ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cohort Tracking & Test Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time visibility into what students are practicing, live cohort metrics, and curriculum assessment distribution.
          </p>
        </div>

        {/* Admin Session Badge, Live Sync, & Lock Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Manual Cohort Sync Button */}
          <button
            onClick={handleManualSync}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm cursor-pointer"
            title="Force refresh & sync live cohort activity across tabs"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-purple-600 dark:text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live Data'}</span>
          </button>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
            <div className="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-600/30 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center font-bold text-purple-700 dark:text-purple-200 text-[11px]">
              {(user?.name || 'Dr. Auggie')
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'DA'}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{user?.name || 'Dr. Auggie'}</div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400">{user?.batch || 'Head of CSE Faculty'}</div>
            </div>
            <button
              onClick={() => setIsAdminProfileModalOpen(true)}
              className="ml-1 p-1 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
              title="Edit Admin Faculty Profile"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/50 transition cursor-pointer"
            title="Lock and exit admin session"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock Session</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalStudentsCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Across LPU & Global Tracks</div>
        </div>

        {/* Live Active Online */}
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-2 transition-colors">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span>Online Right Now</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-300">{onlineStudentsCount}</div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">Active in roadmap & problems</div>
        </div>

        {/* Active Assigned Tests */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Assigned Tests</span>
            <FileText className="h-4 w-4 text-brand-500 dark:text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeTestsCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Published to cohort batches</div>
        </div>

        {/* Total Solved Across Cohort */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Cohort Problem Solves</span>
            <BarChart3 className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalProblemsSolvedCohort}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Cumulative verified submissions</div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'students'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Live Student Tracking & Roster</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-200">
            {students.length}
          </span>
          {pendingStudentsCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 animate-pulse">
              {pendingStudentsCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('assign-test')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'assign-test'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Assign & Manage Tests</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {assignedTests.length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('onboard-student')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'onboard-student'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          <span>Enroll Student to Roster</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
            Manual
          </span>
        </button>
      </div>

      {/* Toast Alert Message Banner */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between shadow-lg animate-in fade-in ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
            : toastMessage.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
        }`}>
          <div className="flex items-center gap-2.5 font-medium">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE STUDENT TRACKING & ROSTER
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Pending Registrations Attention Banner */}
          {pendingStudentsCount > 0 && (
            <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 via-amber-100/40 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm dark:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span>{pendingStudentsCount} Student Registration{pendingStudentsCount > 1 ? 's' : ''} Awaiting Approval</span>
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-200/80 mt-0.5">
                    Newly registered students cannot log in until verified. You can approve or disapprove requests below.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setApprovalFilter('pending')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition shrink-0 cursor-pointer"
              >
                Filter Pending ({pendingStudentsCount}) ➔
              </button>
            </div>
          )}

          {/* Live Activity Stream Banner */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 space-y-3 shadow-sm dark:shadow-md transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>Real-Time Activity Pulse (Live Student Tracking)</span>
            </div>
            
            {students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.slice(0, 3).map((std) => (
                  <div 
                    key={std.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs transition-colors"
                  >
                    <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                      std.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{std.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{std.lastActive}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {std.currentActivity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time Pulse Standby · Live student actions stream here as registered learners solve problems.</span>
                </div>
                <button
                  onClick={() => setActiveTab('onboard-student')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline shrink-0"
                >
                  Enroll Student ➔
                </button>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student by name, email, or registration number..."
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold text-slate-900 dark:text-white">{filteredStudents.length}</span> of {students.length} students
              </div>
            </div>

            {/* Multi-Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Approval Filter */}
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5 text-xs">
                <button
                  onClick={() => setApprovalFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    approvalFilter === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  All Verification
                </button>
                <button
                  onClick={() => setApprovalFilter('pending')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition ${
                    approvalFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300'
                  }`}
                >
                  <span>Pending</span>
                  {pendingStudentsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-200 font-extrabold text-[9px]">
                      {pendingStudentsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setApprovalFilter('approved')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    approvalFilter === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setApprovalFilter('disapproved')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    approvalFilter === 'disapproved' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Disapproved
                </button>
              </div>

              {/* Portal Track Filter */}
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5 text-xs">
                <button
                  onClick={() => setTrackFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    trackFilter === 'all' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  All Tracks
                </button>
                <button
                  onClick={() => setTrackFilter('lpu')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    trackFilter === 'lpu' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  🎓 LPU C++
                </button>
                <button
                  onClick={() => setTrackFilter('global')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    trackFilter === 'global' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  🌐 Global DSA
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-1 rounded-lg font-medium transition ${
                    statusFilter === 'all' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-2 py-1 rounded-lg font-medium transition ${
                    statusFilter === 'online' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Online
                </button>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-xl transition-colors">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Track & Institution</th>
                  <th className="py-3.5 px-4">Approval Status</th>
                  <th className="py-3.5 px-4">Live Activity</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Tests</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center">
                        <div className="max-w-md mx-auto space-y-3 px-4">
                          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                            <Users className="h-6 w-6" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Cohort Roster · Standby</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            No dummy accounts exist. Real students will appear here as soon as they register on the Student Portal. You can also provision learners directly.
                          </p>
                          <button
                            onClick={() => setActiveTab('onboard-student')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>Enroll First Student</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-500 italic">
                        No students found matching your filters.
                      </td>
                    </tr>
                  )
                ) : (
                  filteredStudents.map((std) => {
                    const maxCatalogue = std.track === 'lpu' ? 82 : 182;
                    const progressPct = Math.round((std.totalSolved / maxCatalogue) * 100);
                    const approval = std.approvalStatus || 'approved';

                    return (
                      <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                        {/* Student Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
                                {std.name[0]}
                              </div>
                              <span 
                                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-950 ${
                                  std.status === 'online'
                                    ? 'bg-emerald-500'
                                    : std.status === 'idle'
                                    ? 'bg-amber-400'
                                    : 'bg-slate-400 dark:bg-slate-500'
                                }`} 
                                title={`Status: ${std.status}`}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{std.email}</div>
                              <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold">Reg: {std.registrationNumber}</div>
                            </div>
                          </div>
                        </td>

                        {/* Track & Batch */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            std.track === 'lpu'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                              : 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30'
                          }`}>
                            {std.track === 'lpu' ? <GraduationCap className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                            <span>{std.track === 'lpu' ? 'LPU C++' : 'Global DSA'}</span>
                          </span>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{std.batch}</div>
                        </td>

                        {/* Approval Status */}
                        <td className="py-3 px-4">
                          {approval === 'pending' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Pending Review</span>
                            </span>
                          ) : approval === 'disapproved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40">
                              <X className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                              <span>Disapproved</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Approved</span>
                            </span>
                          )}
                        </td>

                        {/* Real-time Activity */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex items-start gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                              std.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'
                            }`} />
                            <div className="min-w-0">
                              <div className="text-slate-800 dark:text-slate-200 font-medium truncate">{std.currentActivity}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Last active: {std.lastActive}</div>
                            </div>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="py-3 px-4 min-w-[130px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white">{std.totalSolved} solved</span>
                            <span className="text-slate-500 dark:text-slate-400">{progressPct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {std.completedLessons.length} lessons finished
                          </div>
                        </td>

                        {/* Test Submissions */}
                        <td className="py-3 px-4">
                          <div className="text-slate-900 dark:text-white font-semibold">
                            {Object.keys(std.assignedTestSubmissions || {}).length} Submitted
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Approve / Disapprove Actions */}
                            {approval === 'pending' ? (
                              <>
                                <button
                                  onClick={() => {
                                    approveStudent(std.id);
                                    setToastMessage({ text: `Approved student account for ${std.name}!`, type: 'success' });
                                    setTimeout(() => setToastMessage(null), 3500);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm transition cursor-pointer"
                                  title="Approve student registration"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => {
                                    disapproveStudent(std.id);
                                    setToastMessage({ text: `Disapproved registration request for ${std.name}.`, type: 'error' });
                                    setTimeout(() => setToastMessage(null), 3500);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-[11px] font-semibold transition cursor-pointer"
                                  title="Disapprove student registration"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Disapprove</span>
                                </button>
                              </>
                            ) : approval === 'disapproved' ? (
                              <button
                                onClick={() => {
                                  approveStudent(std.id);
                                  setToastMessage({ text: `Re-approved student account for ${std.name}!`, type: 'success' });
                                  setTimeout(() => setToastMessage(null), 3500);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-600/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-[11px] font-bold transition cursor-pointer"
                                title="Re-approve student account"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Re-Approve</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  disapproveStudent(std.id);
                                  setToastMessage({ text: `Suspended access for ${std.name}.`, type: 'info' });
                                  setTimeout(() => setToastMessage(null), 3500);
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800/40 text-[11px] font-medium transition cursor-pointer"
                                title="Disapprove/suspend student account"
                              >
                                Disapprove
                              </button>
                            )}

                            {/* Edit Student Profile Button */}
                            <button
                              onClick={() => setStudentToEdit(std)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-800/60 transition cursor-pointer"
                              title={`Edit ${std.name}'s profile`}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            {/* View Dossier Button */}
                            <button
                              onClick={() => setSelectedStudentId(std.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                              title="View student dossier"
                            >
                              Dossier ↗
                            </button>

                            {/* Delete Student Button */}
                            <button
                              onClick={() => setStudentToDelete(std)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800/60 transition cursor-pointer"
                              title={`Delete ${std.name} permanently`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: ASSIGN & MANAGE TESTS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'assign-test' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create & Assign Test Form */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assign New Curriculum Test</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Distribute assessments to student batches</p>
              </div>
              {testCreatedSuccess && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-500/40 text-xs font-bold animate-in fade-in">
                  ✓ Test Assigned to Batch!
                </span>
              )}
            </div>

            <form onSubmit={handleAssignTest} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Test Title
                </label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. CSE205 Midterm Evaluation: Stacks, Queues & Trees"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Exam Instructions
                </label>
                <textarea
                  rows={2}
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="e.g. Mandatory 60-min continuous evaluation test for Unit 3 Linked Lists."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Track
                  </label>
                  <select
                    value={targetTrack}
                    onChange={(e) => setTargetTrack(e.target.value as 'all' | 'global' | 'lpu')}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="lpu">🎓 LPU Academic Portal</option>
                    <option value="global">🌐 Global DSA Track</option>
                    <option value="all">All Cohorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject Code
                  </label>
                  <select
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="CSE205">CSE205 (Data Structures)</option>
                    <option value="CSE202">CSE202 (OOP C++)</option>
                    <option value="DSA-GLOBAL">DSA (Global Track)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Batch
                  </label>
                  <input
                    type="text"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    placeholder="e.g. LPU CSE Section K22-A"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Problem Selection Picker */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Select Test Questions ({selectedProblemIds.length} Selected)
                  </label>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">From Canonical Bank</span>
                </div>

                <input
                  type="text"
                  value={problemSearch}
                  onChange={(e) => setProblemSearch(e.target.value)}
                  placeholder="Filter problems to include in test..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />

                <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2">
                  {availableProblemsForTest.slice(0, 30).map((p) => {
                    const isSelected = selectedProblemIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProblemSelection(p.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                          isSelected
                            ? 'bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-500/40'
                            : 'bg-white hover:bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-transparent'
                        }`}
                      >
                        <div className="truncate mr-2 font-medium">{p.title}</div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{p.difficulty}</span>
                          <span className={`h-4 w-4 rounded-md flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-purple-600 text-white font-bold' : 'border border-slate-300 dark:border-slate-700'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={selectedProblemIds.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Publish Test to {targetBatch}</span>
              </button>
            </form>
          </div>

          {/* Active Assigned Tests List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Assigned Tests</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tests published to students</p>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{assignedTests.length} Live Tests</span>
            </div>

            <div className="space-y-3">
              {assignedTests.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                          {t.subjectCode || 'EXAM'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.description}</p>
                    </div>

                    <button
                      onClick={() => deleteAssignedTest(t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                      title="Delete test"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                      <span>{t.durationMinutes} mins</span>
                    </span>
                    <span>&bull;</span>
                    <span>Total Marks: {t.totalMarks}</span>
                    <span>&bull;</span>
                    <span>Due: {t.dueDate}</span>
                    <span>&bull;</span>
                    <span className="text-purple-600 dark:text-purple-300 font-medium">Batch: {t.targetBatch}</span>
                  </div>

                  {/* Submission Rate Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Student Submissions:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {t.submissionsCount} / {t.totalAssignedCount} submitted
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${Math.round((t.submissionsCount / t.totalAssignedCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: DIRECT STUDENT ENROLLMENT & PROVISIONING
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'onboard-student' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 space-y-6 max-w-3xl mx-auto shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-bold">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Direct Student Enrollment</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Register, verify, and provision new student accounts directly into the active cohort roster.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
            <p>
              Students who self-register on the <strong>Student Portal</strong> will appear automatically in the Live Roster for instant review and telemetry tracking. You can also provision learners directly here with their university registration credentials.
            </p>
          </div>

          <form onSubmit={handleRegisterStudent} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. vikram.s@lpu.in"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Registration / Roll No
                </label>
                <input
                  type="text"
                  value={newStudentRegNo}
                  onChange={(e) => setNewStudentRegNo(e.target.value)}
                  placeholder="e.g. 12104882"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Portal Track
                </label>
                <select
                  value={newStudentTrack}
                  onChange={(e) => setNewStudentTrack(e.target.value as 'lpu' | 'global')}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="lpu">🎓 LPU Academic Portal</option>
                  <option value="global">🌐 Global DSA Track</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Class / Cohort Batch
                </label>
                <input
                  type="text"
                  value={newStudentBatch}
                  onChange={(e) => setNewStudentBatch(e.target.value)}
                  placeholder="e.g. CSE-K22-B"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Enroll Student to Active Roster</span>
              </button>

              {studentCreatedSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">
                  ✓ Student enrolled and live on roster!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STUDENT DOSSIER DRILLDOWN MODAL (ALL USER INFORMATION)
         ───────────────────────────────────────────────────────────── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                    <span 
                      className={`h-2.5 w-2.5 rounded-full ${
                        selectedStudent.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`} 
                      title={`Status: ${selectedStudent.status}`}
                    />
                    {selectedStudent.approvalStatus === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                        Pending Verification
                      </span>
                    )}
                    {selectedStudent.approvalStatus === 'disapproved' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                        Disapproved
                      </span>
                    )}
                    {(selectedStudent.approvalStatus === 'approved' || !selectedStudent.approvalStatus) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                        Approved
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    ID: {selectedStudent.id} • Reg: {selectedStudent.registrationNumber} • {selectedStudent.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dossier Navigation Tabs */}
            <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1 bg-white dark:bg-slate-900 shrink-0">
              <button
                onClick={() => setDossierTab('profile')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition ${
                  dossierTab === 'profile'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Profile & Telemetry
              </button>
              <button
                onClick={() => setDossierTab('problems')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  dossierTab === 'problems'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Solved Problems</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
                  {selectedStudent.totalSolved}
                </span>
              </button>
              <button
                onClick={() => setDossierTab('lessons')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  dossierTab === 'lessons'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Lessons</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
                  {selectedStudent.completedLessons?.length || 0}
                </span>
              </button>
              <button
                onClick={() => setDossierTab('quizzes')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  dossierTab === 'quizzes'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Quizzes</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
                  {Object.keys(selectedStudent.quizScores || {}).length}
                </span>
              </button>
              <button
                onClick={() => setDossierTab('tests')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  dossierTab === 'tests'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Tests</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
                  {Object.keys(selectedStudent.assignedTestSubmissions || {}).length}
                </span>
              </button>
            </div>

            {/* Dossier Body Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* TAB 1: PROFILE & TELEMETRY */}
              {dossierTab === 'profile' && (
                <div className="space-y-4">
                  {/* Real-time Activity Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
                      <Activity className="h-3.5 w-3.5" />
                      <span>Live Heartbeat Telemetry</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedStudent.currentActivity}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Last active heartbeat: {selectedStudent.lastActive}</div>
                  </div>

                  {/* Comprehensive User Information Grid */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
                      Full Academic & Identity Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Full Name</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedStudent.name}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Student Email</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">{selectedStudent.email}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Registration / Roll No</span>
                        <div className="font-bold text-purple-600 dark:text-purple-400 mt-0.5 font-mono">{selectedStudent.registrationNumber}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Institution / University</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedStudent.university || (selectedStudent.track === 'lpu' ? 'Lovely Professional University (LPU)' : 'Global Student Cohort')}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Class Batch & Section</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedStudent.batch}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Current Semester</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">Semester {selectedStudent.semester || 3}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Enrolled Learning Track</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedStudent.track === 'lpu' ? '🎓 LPU Academic C++ Portal (CSE202/205)' : '🌐 Global DSA Roadmap (Language Agnostic)'}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Registration Date</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                          {selectedStudent.joinedAt ? new Date(selectedStudent.joinedAt).toLocaleString() : 'Recent Active'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.totalSolved}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">DSA Solved</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.completedLessons?.length || 0}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Lessons Done</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{Object.keys(selectedStudent.quizScores || {}).length}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Quizzes Taken</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{Object.keys(selectedStudent.assignedTestSubmissions || {}).length}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tests Submitted</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SOLVED PROBLEMS */}
              {dossierTab === 'problems' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 font-mono">
                      Solved Problem Submissions ({selectedStudent.solvedProblemIds?.length || 0})
                    </h4>
                  </div>

                  {selectedStudent.solvedProblemIds && selectedStudent.solvedProblemIds.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      {selectedStudent.solvedProblemIds.map((pId) => {
                        const matched = PROBLEMS.find((p) => p.id === pId);
                        const title = matched?.title || pId;
                        const difficulty = matched?.difficulty || 'Medium';
                        const platform = matched?.platform || 'LeetCode';

                        return (
                          <div key={pId} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="font-semibold text-slate-900 dark:text-white truncate">{title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1 pl-6">
                                <span className="font-mono">ID: {pId}</span>
                                <span>•</span>
                                <span>{platform}</span>
                                {matched?.topicTags && matched.topicTags.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>#{matched.topicTags[0]}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                String(difficulty).toLowerCase() === 'easy'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : String(difficulty).toLowerCase() === 'hard'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                                {difficulty}
                              </span>
                              {matched?.externalUrl && (
                                <a
                                  href={matched.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-slate-400 hover:text-purple-600"
                                  title="View on platform"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 italic">
                      No DSA problems recorded as solved yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: COMPLETED LESSONS */}
              {dossierTab === 'lessons' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 font-mono">
                    Curriculum Lessons Completed ({selectedStudent.completedLessons?.length || 0})
                  </h4>

                  {selectedStudent.completedLessons && selectedStudent.completedLessons.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      {selectedStudent.completedLessons.map((lessonId) => (
                        <div key={lessonId} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
                          <div className="flex items-center gap-2 min-w-0">
                            <BookOpen className="h-4 w-4 text-brand-500 shrink-0" />
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white capitalize">
                                {lessonId.replace(/-/g, ' ')}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                Lesson ID: {lessonId}
                              </div>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Completed
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 italic">
                      No curriculum lessons completed yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: INTERACTIVE QUIZZES */}
              {dossierTab === 'quizzes' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 font-mono">
                    Quiz Assessment Scores ({Object.keys(selectedStudent.quizScores || {}).length})
                  </h4>

                  {selectedStudent.quizScores && Object.keys(selectedStudent.quizScores).length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      {Object.entries(selectedStudent.quizScores).map(([quizId, q]) => {
                        const pct = Math.round((q.score / (q.total || 1)) * 100);
                        return (
                          <div key={quizId} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white capitalize">
                                {quizId.replace(/-/g, ' ')}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                Taken on: {new Date(q.date).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {q.score} / {q.total}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pct >= 80
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : pct >= 50
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 italic">
                      No interactive quizzes attempted yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ASSIGNED TESTS */}
              {dossierTab === 'tests' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 font-mono">
                    Assigned Coursework Tests ({Object.keys(selectedStudent.assignedTestSubmissions || {}).length})
                  </h4>

                  {selectedStudent.assignedTestSubmissions && Object.keys(selectedStudent.assignedTestSubmissions).length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      {Object.entries(selectedStudent.assignedTestSubmissions).map(([testId, sub]) => {
                        const pct = Math.round((sub.score / (sub.total || 1)) * 100);
                        return (
                          <div key={testId} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white font-mono">
                                Test: {testId}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                Submitted on: {new Date(sub.submittedAt).toLocaleString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {sub.score} / {sub.total} marks
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pct >= 80
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : pct >= 50
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 italic">
                      No assigned coursework tests submitted yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions Footer: Approve, Disapprove, Edit, Delete */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
              <div className="flex items-center gap-2">
                {selectedStudent.approvalStatus !== 'approved' ? (
                  <button
                    onClick={() => {
                      approveStudent(selectedStudent.id);
                      setToastMessage({ text: `Approved student ${selectedStudent.name}`, type: 'success' });
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve Student</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      disapproveStudent(selectedStudent.id);
                      setToastMessage({ text: `Disapproved student ${selectedStudent.name}`, type: 'info' });
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/50 font-bold text-xs transition cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Disapprove Student</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const student = selectedStudent;
                    setStudentToEdit(student);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800/50 font-bold text-xs transition cursor-pointer"
                  title="Edit student profile details"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const student = selectedStudent;
                  setSelectedStudentId(null);
                  setStudentToDelete(student);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-600/20 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 font-bold text-xs transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete User</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DELETE STUDENT CONFIRMATION MODAL
         ───────────────────────────────────────────────────────────── */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Student Account?</h3>
                <p className="text-xs text-rose-600 dark:text-rose-300/80">Permanent destructive action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete student <span className="font-bold text-slate-900 dark:text-white">{studentToDelete.name}</span> (<code className="text-purple-600 dark:text-purple-300 font-medium">{studentToDelete.email}</code>)?
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <div>• Registration No: <span className="text-slate-900 dark:text-slate-200 font-mono font-medium">{studentToDelete.registrationNumber}</span></div>
              <div>• Problems Solved: <span className="text-slate-900 dark:text-slate-200 font-bold">{studentToDelete.totalSolved}</span></div>
              <div>• If currently logged in, this user will be immediately logged out.</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const name = studentToDelete.name;
                  deleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                  setToastMessage({ text: `Permanently deleted student ${name}`, type: 'error' });
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Yes, Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FLOATING TOAST NOTIFICATION
         ───────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl text-xs font-semibold text-slate-900 dark:text-white animate-in slide-in-from-bottom-3">
          {toastMessage.type === 'success' && <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />}
          {toastMessage.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Edit Admin Faculty Profile Modal */}
      <EditProfileModal
        isOpen={isAdminProfileModalOpen}
        onClose={() => setIsAdminProfileModalOpen(false)}
        mode="admin-self"
        onSuccess={(msg) => {
          setToastMessage({ text: msg, type: 'success' });
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      {/* Edit Student Record Modal (Admin Mode) */}
      <EditProfileModal
        isOpen={!!studentToEdit}
        onClose={() => setStudentToEdit(null)}
        mode="admin-student"
        student={studentToEdit}
        onSuccess={(msg) => {
          setToastMessage({ text: msg, type: 'success' });
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />
    </div>
  );
};
