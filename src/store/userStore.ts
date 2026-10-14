import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProblemProgress, ProblemStatus, UserRole, UserProfile, StudentRecord, AssignedTest } from '../types';

interface CustomProblemSet {
  id: string;
  title: string;
  description: string;
  problemIds: string[];
  createdAt: string;
}

interface UserState {
  user: UserProfile;
  problemProgress: Record<string, ProblemProgress>;
  bookmarks: string[];
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  customProblemSets: CustomProblemSet[];
  
  theme: 'dark' | 'light' | 'system';
  activePortal: 'global' | 'lpu';
  hasChosenTrack: boolean;
  showTrackModal: boolean;

  // Admin & Student Tracking State
  students: StudentRecord[];
  assignedTests: AssignedTest[];
  isAdminAuthenticated: boolean;
  isStudentAuthenticated: boolean;
  
  // Actions
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleTheme: () => void;
  setActivePortal: (portal: 'global' | 'lpu') => void;
  chooseTrack: (track: 'global' | 'lpu') => void;
  openTrackModal: () => void;
  closeTrackModal: () => void;
  setUser: (user: Partial<UserProfile>) => void;
  setRole: (role: UserRole) => void;
  updateProblemStatus: (problemId: string, status: ProblemStatus, notes?: string, submissionUrl?: string) => void;
  toggleBookmark: (problemId: string) => void;
  markLessonComplete: (lessonId: string, completed?: boolean) => void;
  saveQuizResult: (quizId: string, score: number, total: number) => void;
  addCustomProblemSet: (set: Omit<CustomProblemSet, 'id' | 'createdAt'>) => void;
  deleteCustomProblemSet: (id: string) => void;
  resetProgress: () => void;
  updateStudentActivity: (activity: string) => void;
  recordAssignedTestSubmission: (testId: string, score: number, total: number) => void;
  syncCohortData: () => void;

  // Student Authentication Actions
  loginStudent: (identifier: string, password?: string) => { success: boolean; message: string; student?: StudentRecord };
  quickLoginStudent: (studentId: string) => boolean;
  logoutStudent: () => void;

  // Admin Actions
  authenticateAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  assignTest: (test: Omit<AssignedTest, 'id' | 'createdAt' | 'submissionsCount'>) => void;
  deleteAssignedTest: (testId: string) => void;
  approveStudent: (studentId: string) => void;
  disapproveStudent: (studentId: string) => void;
  deleteStudent: (studentId: string) => void;
  registerStudent: (
    student: Omit<StudentRecord, 'id' | 'joinedAt' | 'totalSolved' | 'completedLessons' | 'quizScores'> & {
      completedLessons?: string[];
      quizScores?: Record<string, { score: number; total: number; date: string }>;
    },
    autoLogin?: boolean
  ) => StudentRecord;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'std-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@lpu.in',
    registrationNumber: '12104921',
    track: 'lpu',
    batch: 'LPU B.Tech CSE (CSE202/205)',
    joinedAt: '2026-08-15T09:00:00Z',
    status: 'online',
    currentActivity: 'Practicing: CSE205 Midterm Lab (BST Traversal & Balance)',
    lastActive: 'Just now',
    solvedProblemIds: ['p-lpu-205-01', 'p-lpu-205-02', 'p-lpu-205-03', 'p-lpu-205-04', 'p-cpp-classes-1', 'p-cpp-constructors-1'],
    totalSolved: 42,
    completedLessons: ['cse205-u1-t1', 'cse202-u1-t1'],
    quizScores: {
      'quiz-cpp-oop-basics': { score: 5, total: 5, date: '2026-10-12T14:30:00Z' },
      'quiz-dsa-arrays-sorting': { score: 4, total: 4, date: '2026-10-13T10:15:00Z' },
    },
    assignedTestSubmissions: {
      'test-midterm-01': { score: 92, total: 100, submittedAt: '2026-10-13T16:00:00Z' },
    },
    approvalStatus: 'approved',
  },
  {
    id: 'std-102',
    name: 'Priya Sharma',
    email: 'priya.s@gmail.com',
    registrationNumber: 'GLB-2026-88',
    track: 'global',
    batch: 'Global DSA Cohort 2026',
    joinedAt: '2026-08-20T11:30:00Z',
    status: 'online',
    currentActivity: 'Solving: Two Sum (Hash Map O(n)) - DSA 130 Sheet',
    lastActive: '2m ago',
    solvedProblemIds: ['p-dsa-two-sum-1', 'p-dsa-3sum-1', 'p-dsa-container-water-1', 'p-dsa-binary-search-1'],
    totalSolved: 94,
    completedLessons: ['lesson-dsa-binary-search', 'lesson-dsa-arrays'],
    quizScores: {
      'quiz-dsa-arrays-sorting': { score: 4, total: 4, date: '2026-10-11T12:00:00Z' },
    },
    assignedTestSubmissions: {
      'test-global-sprint-01': { score: 98, total: 100, submittedAt: '2026-10-12T18:00:00Z' },
    },
    approvalStatus: 'approved',
  },
  {
    id: 'std-103',
    name: 'Rohan Verma',
    email: 'rohan.v@lpu.in',
    registrationNumber: '12108842',
    track: 'lpu',
    batch: 'LPU B.Tech CSE Section K22-A',
    joinedAt: '2026-08-16T10:00:00Z',
    status: 'idle',
    currentActivity: 'Viewing AlgoNerve Visualizer: Singly Linked List Reversal',
    lastActive: '14m ago',
    solvedProblemIds: ['p-lpu-205-01', 'p-lpu-205-02', 'p-cpp-classes-1'],
    totalSolved: 28,
    completedLessons: ['cse205-u1-t1'],
    quizScores: {
      'quiz-cpp-oop-basics': { score: 3, total: 5, date: '2026-10-10T09:30:00Z' },
    },
    approvalStatus: 'approved',
  },
  {
    id: 'std-104',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@lpu.in',
    registrationNumber: '12109433',
    track: 'lpu',
    batch: 'LPU B.Tech CSE Section K22-B',
    joinedAt: '2026-08-18T14:20:00Z',
    status: 'online',
    currentActivity: 'Attempting: Pure Virtual Functions & Dynamic Polymorphism in C++',
    lastActive: 'Just now',
    solvedProblemIds: ['p-lpu-205-05', 'p-lpu-205-06', 'p-cpp-virtual-functions-1', 'p-cpp-abstract-classes-1'],
    totalSolved: 58,
    completedLessons: ['cse202-u1-t1'],
    quizScores: {
      'quiz-cpp-oop-basics': { score: 5, total: 5, date: '2026-10-13T11:45:00Z' },
    },
    assignedTestSubmissions: {
      'test-midterm-01': { score: 95, total: 100, submittedAt: '2026-10-13T16:20:00Z' },
    },
    approvalStatus: 'approved',
  },
  {
    id: 'std-105',
    name: 'Sahil Kumar',
    email: 'sahil.code@outlook.com',
    registrationNumber: 'GLB-2026-102',
    track: 'global',
    batch: 'Global DSA Cohort 2026',
    joinedAt: '2026-09-01T08:10:00Z',
    status: 'offline',
    currentActivity: 'Last solved: LRU Cache (Doubly Linked List + Hash Map)',
    lastActive: '3h ago',
    solvedProblemIds: ['p-dsa-lru-cache-1', 'p-dsa-two-sum-1'],
    totalSolved: 71,
    completedLessons: [],
    quizScores: {},
    approvalStatus: 'approved',
  },
  {
    id: 'std-106',
    name: 'Devika Nair',
    email: 'devika.n@lpu.in',
    registrationNumber: '12110294',
    track: 'lpu',
    batch: 'LPU B.Tech CSE Section K22-A',
    joinedAt: '2026-08-25T16:00:00Z',
    status: 'online',
    currentActivity: 'Solving: CSE205 Circular Queue Using Arrays (Unit 3)',
    lastActive: '5m ago',
    solvedProblemIds: ['p-lpu-205-07', 'p-lpu-205-08', 'p-cpp-operator-overloading-1'],
    totalSolved: 36,
    completedLessons: ['cse205-u1-t1'],
    quizScores: {
      'quiz-dsa-arrays-sorting': { score: 4, total: 4, date: '2026-10-12T15:20:00Z' },
    },
    approvalStatus: 'approved',
  },
];

const INITIAL_ASSIGNED_TESTS: AssignedTest[] = [
  {
    id: 'test-midterm-01',
    title: 'CSE205 Data Structures Practical Readiness Evaluation',
    description: 'Mandatory practical evaluation test covering Array ADTs, Linked Lists, and Stack/Queue real-world practical implementations in C++.',
    targetTrack: 'lpu',
    targetBatch: 'LPU B.Tech CSE (CSE202/205)',
    subjectCode: 'CSE205',
    problemIds: ['p-lpu-205-01', 'p-lpu-205-02', 'p-lpu-205-05', 'p-lpu-205-07'],
    durationMinutes: 60,
    totalMarks: 100,
    dueDate: '2026-10-20',
    createdAt: '2026-10-10T10:00:00Z',
    createdBy: 'Dr. Auggie (HOD CSE Faculty)',
    submissionsCount: 4,
    totalAssignedCount: 6,
  },
  {
    id: 'test-global-sprint-01',
    title: 'Global DSA 130 Speed Challenge: Two Pointers & Hashing',
    description: 'Timed assessment on Two Sum, 3Sum, Container With Most Water, and Trapping Rain Water patterns.',
    targetTrack: 'global',
    targetBatch: 'Global DSA Cohort 2026',
    subjectCode: 'DSA-130',
    problemIds: ['p-dsa-two-sum-1', 'p-dsa-3sum-1', 'p-dsa-container-water-1', 'p-dsa-trapping-rain-water-1'],
    durationMinutes: 45,
    totalMarks: 100,
    dueDate: '2026-10-22',
    createdAt: '2026-10-12T14:00:00Z',
    createdBy: 'Dr. Auggie (Algorithm Lead)',
    submissionsCount: 2,
    totalAssignedCount: 4,
  },
];

const defaultUser: UserProfile = {
  id: 'std-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@lpu.in',
  role: 'student',
  university: 'Lovely Professional University (LPU)',
  semester: 3,
  registrationNumber: '12104921',
  batch: 'LPU B.Tech CSE (CSE202/205)',
  track: 'lpu',
  approvalStatus: 'approved',
};

// Cross-tab real-time sync broadcaster channel
const cohortChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('codenerve_cohort_sync')
    : null;

export const broadcastCohortSync = () => {
  if (cohortChannel) {
    try {
      cohortChannel.postMessage({ type: 'SYNC_STORE', timestamp: Date.now() });
    } catch {
      // Ignore
    }
  }
};

/**
 * Reconciles student roster entries with store problemProgress and completed modules.
 * Guarantees that any active or registered student's solved count, progress list,
 * and online activity match actual problem store data.
 */
export function reconcileAllStudents(
  students: StudentRecord[],
  user: UserProfile,
  problemProgress: Record<string, ProblemProgress>,
  completedLessons: string[] = [],
  quizScores: Record<string, { score: number; total: number; date: string }> = {}
): StudentRecord[] {
  const allSolvedIds = Object.values(problemProgress || {})
    .filter((p) => p.status === 'SOLVED')
    .map((p) => p.problemId);

  const isStudentActive = user && user.role === 'student' && user.id !== 'guest';

  let foundActive = false;

  let updated = (students || []).map((s) => {
    const isThisUser =
      isStudentActive &&
      (s.id === user.id ||
        (user.registrationNumber && s.registrationNumber === user.registrationNumber) ||
        (user.email && s.email && s.email.toLowerCase() === user.email.toLowerCase()));

    if (isThisUser) {
      foundActive = true;
    }

    let mergedSolved = s.solvedProblemIds ? [...s.solvedProblemIds] : [];
    if (isThisUser) {
      mergedSolved = Array.from(new Set([...mergedSolved, ...allSolvedIds]));
    }

    const totalSolved = Math.max(s.totalSolved || 0, mergedSolved.length);

    let mergedLessons = s.completedLessons ? [...s.completedLessons] : [];
    if (isThisUser) {
      mergedLessons = Array.from(new Set([...mergedLessons, ...completedLessons]));
    }

    let mergedQuizzes = s.quizScores ? { ...s.quizScores } : {};
    if (isThisUser) {
      mergedQuizzes = { ...mergedQuizzes, ...quizScores };
    }

    let currentActivity = s.currentActivity || 'Active learner';
    if (s.approvalStatus === 'approved' && currentActivity.toLowerCase().includes('pending')) {
      currentActivity = isThisUser
        ? 'Active learner · Solving DSA problems & roadmaps'
        : 'Account approved by faculty';
    }

    return {
      ...s,
      solvedProblemIds: mergedSolved,
      totalSolved,
      completedLessons: mergedLessons,
      quizScores: mergedQuizzes,
      currentActivity: isThisUser ? currentActivity : s.currentActivity,
      status: isThisUser ? ('online' as const) : s.status,
      lastActive: isThisUser ? 'Just now' : s.lastActive,
    };
  });

  if (isStudentActive && !foundActive) {
    const newStudent: StudentRecord = {
      id: user.id || `std-${Date.now()}`,
      name: user.name || 'Student',
      email: user.email || '',
      registrationNumber: user.registrationNumber || `REG-${Date.now().toString().slice(-6)}`,
      track: user.track || 'global',
      batch: user.batch || (user.track === 'lpu' ? 'LPU B.Tech CSE' : 'Global Student Cohort'),
      joinedAt: new Date().toISOString(),
      status: 'online',
      currentActivity: 'Active learner · Solving DSA problems & roadmaps',
      lastActive: 'Just now',
      solvedProblemIds: allSolvedIds,
      totalSolved: allSolvedIds.length,
      completedLessons: completedLessons || [],
      quizScores: quizScores || {},
      approvalStatus: user.approvalStatus || 'approved',
    };
    updated = [newStudent, ...updated];
  }

  return updated;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      hasChosenTrack: true,
      showTrackModal: false,
      students: INITIAL_STUDENTS,
      assignedTests: INITIAL_ASSIGNED_TESTS,
      isAdminAuthenticated: false,
      isStudentAuthenticated: true,
      problemProgress: {
        'p-dsa-array-traversal-1': {
          problemId: 'p-dsa-array-traversal-1',
          status: 'SOLVED',
          lastUpdated: new Date().toISOString(),
          solvedAt: new Date().toISOString(),
          notes: 'Standard linear scan keeping track of max_val.',
        },
        'p-dsa-bubble-sort-1': {
          problemId: 'p-dsa-bubble-sort-1',
          status: 'SOLVED',
          lastUpdated: new Date().toISOString(),
          solvedAt: new Date().toISOString(),
        },
        'p-dsa-binary-search-1': {
          problemId: 'p-dsa-binary-search-1',
          status: 'ATTEMPTED',
          lastUpdated: new Date().toISOString(),
          notes: 'Beware of integer overflow with mid = low + (high - low) / 2.',
        },
        'p-dsa-ll-reverse-1': {
          problemId: 'p-dsa-ll-reverse-1',
          status: 'REVISION_NEEDED',
          lastUpdated: new Date().toISOString(),
          notes: 'Practice 3-pointer iterative vs recursive approach before midterms!',
        },
      },
      bookmarks: ['p-dsa-ll-reverse-1', 'p-dsa-dijkstra-1', 'p-cpp-constructors-1'],
      completedLessons: ['cse205-u1-t1', 'cse202-u1-t1'],
      quizScores: {
        'quiz-cpp-oop-basics': { score: 4, total: 5, date: new Date().toISOString() },
      },
      customProblemSets: [
        {
          id: 'set-midterm-prep',
          title: 'CSE205 Midterm Essential DSA',
          description: 'Top array, linked list and sorting problems for end-term exams.',
          problemIds: ['p-dsa-array-traversal-1', 'p-dsa-bubble-sort-1', 'p-dsa-ll-reverse-1', 'p-dsa-binary-search-1'],
          createdAt: new Date().toISOString(),
        },
      ],

      theme: 'dark',
      activePortal: 'global',

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.classList.toggle('dark', isDark);
          document.documentElement.classList.toggle('light', !isDark);
          document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        }
      },

      toggleTheme: () => {
        set((state) => {
          const isDarkNow = typeof document !== 'undefined'
            ? document.documentElement.classList.contains('dark')
            : state.theme === 'dark';
          const next = isDarkNow ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
            document.documentElement.classList.toggle('light', next === 'light');
            document.documentElement.style.colorScheme = next;
          }
          return { theme: next };
        });
      },

      setActivePortal: (portal) => set({ activePortal: portal }),

      chooseTrack: (track) => set({ activePortal: track, hasChosenTrack: true, showTrackModal: false }),

      openTrackModal: () => set({ showTrackModal: true }),

      closeTrackModal: () => set({ showTrackModal: false }),

      setUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      setRole: (role) =>
        set((state) => ({ user: { ...state.user, role } })),

      updateProblemStatus: (problemId, status, notes, submissionUrl) =>
        set((state) => {
          const progressMap = state.problemProgress || {};
          const current = progressMap[problemId];
          const isNowSolved = status === 'SOLVED';
          const newProgressMap = {
            ...progressMap,
            [problemId]: {
              problemId,
              status,
              firstAttempted: current?.firstAttempted || new Date().toISOString(),
              solvedAt: isNowSolved ? (current?.solvedAt || new Date().toISOString()) : current?.solvedAt,
              lastUpdated: new Date().toISOString(),
              notes: notes !== undefined ? notes : current?.notes,
              submissionUrl: submissionUrl !== undefined ? submissionUrl : current?.submissionUrl,
            },
          };

          const allSolvedIds = Object.values(newProgressMap)
            .filter((p) => p.status === 'SOLVED')
            .map((p) => p.problemId);

          const currentUserId = state.user?.id;
          const currentRegNo = state.user?.registrationNumber;
          const currentEmail = state.user?.email?.toLowerCase();

          const updatedStudents = (state.students || []).map((s) => {
            const matches =
              s.id === currentUserId ||
              (currentRegNo && s.registrationNumber === currentRegNo) ||
              (currentEmail && s.email && s.email.toLowerCase() === currentEmail);

            if (matches) {
              const activityText = isNowSolved
                ? `Solved problem: ${problemId}`
                : status === 'ATTEMPTED'
                ? `Attempting problem: ${problemId}`
                : `Reviewing problem: ${problemId}`;

              return {
                ...s,
                solvedProblemIds: allSolvedIds,
                totalSolved: allSolvedIds.length,
                currentActivity: activityText,
                lastActive: 'Just now',
                status: 'online' as const,
              };
            }
            return s;
          });

          broadcastCohortSync();

          return {
            problemProgress: newProgressMap,
            students: updatedStudents,
          };
        }),

      toggleBookmark: (problemId) =>
        set((state) => {
          const list = state.bookmarks || [];
          const isBookmarked = list.includes(problemId);
          return {
            bookmarks: isBookmarked
              ? list.filter((id) => id !== problemId)
              : [...list, problemId],
          };
        }),

      markLessonComplete: (lessonId, completed = true) =>
        set((state) => {
          const list = state.completedLessons || [];
          const exists = list.includes(lessonId);
          let nextList = list;
          if (completed && !exists) {
            nextList = [...list, lessonId];
          } else if (!completed && exists) {
            nextList = list.filter((id) => id !== lessonId);
          }

          const currentUserId = state.user?.id;
          const currentRegNo = state.user?.registrationNumber;
          const currentEmail = state.user?.email?.toLowerCase();

          const updatedStudents = (state.students || []).map((s) => {
            const matches =
              s.id === currentUserId ||
              (currentRegNo && s.registrationNumber === currentRegNo) ||
              (currentEmail && s.email && s.email.toLowerCase() === currentEmail);

            if (matches) {
              return {
                ...s,
                completedLessons: nextList,
                currentActivity: completed ? `Completed curriculum lesson: ${lessonId}` : `Revisiting lesson: ${lessonId}`,
                lastActive: 'Just now',
                status: 'online' as const,
              };
            }
            return s;
          });

          broadcastCohortSync();

          return {
            completedLessons: nextList,
            students: updatedStudents,
          };
        }),

      saveQuizResult: (quizId, score, total) =>
        set((state) => {
          const newQuizScores = {
            ...(state.quizScores || {}),
            [quizId]: { score, total, date: new Date().toISOString() },
          };
          const currentUserId = state.user?.id;
          const currentRegNo = state.user?.registrationNumber;
          const currentEmail = state.user?.email?.toLowerCase();

          const updatedStudents = (state.students || []).map((s) => {
            const matches =
              s.id === currentUserId ||
              (currentRegNo && s.registrationNumber === currentRegNo) ||
              (currentEmail && s.email && s.email.toLowerCase() === currentEmail);

            if (matches) {
              return {
                ...s,
                quizScores: newQuizScores,
                currentActivity: `Completed quiz ${quizId} with score ${score}/${total}`,
                lastActive: 'Just now',
                status: 'online' as const,
              };
            }
            return s;
          });

          broadcastCohortSync();

          return {
            quizScores: newQuizScores,
            students: updatedStudents,
          };
        }),

      updateStudentActivity: (activity: string) =>
        set((state) => {
          const currentUserId = state.user?.id;
          const currentRegNo = state.user?.registrationNumber;
          const currentEmail = state.user?.email?.toLowerCase();
          if (!currentUserId || currentUserId === 'guest') return state;

          const updatedStudents = (state.students || []).map((s) => {
            const matches =
              s.id === currentUserId ||
              (currentRegNo && s.registrationNumber === currentRegNo) ||
              (currentEmail && s.email && s.email.toLowerCase() === currentEmail);

            if (matches) {
              return {
                ...s,
                currentActivity: activity,
                lastActive: 'Just now',
                status: 'online' as const,
              };
            }
            return s;
          });

          broadcastCohortSync();

          return { students: updatedStudents };
        }),

      recordAssignedTestSubmission: (testId: string, score: number, total: number) =>
        set((state) => {
          const currentUserId = state.user?.id;
          const currentRegNo = state.user?.registrationNumber;
          const currentEmail = state.user?.email?.toLowerCase();
          const nowIso = new Date().toISOString();

          const updatedStudents = (state.students || []).map((s) => {
            const matches =
              s.id === currentUserId ||
              (currentRegNo && s.registrationNumber === currentRegNo) ||
              (currentEmail && s.email && s.email.toLowerCase() === currentEmail);

            if (matches) {
              const subs = s.assignedTestSubmissions ? { ...s.assignedTestSubmissions } : {};
              subs[testId] = { score, total, submittedAt: nowIso };
              return {
                ...s,
                assignedTestSubmissions: subs,
                currentActivity: `Submitted test ${testId} (${score}/${total} marks)`,
                lastActive: 'Just now',
                status: 'online' as const,
              };
            }
            return s;
          });

          const updatedTests = (state.assignedTests || []).map((t) => {
            if (t.id === testId) {
              return { ...t, submissionsCount: (t.submissionsCount || 0) + 1 };
            }
            return t;
          });

          broadcastCohortSync();

          return {
            students: updatedStudents,
            assignedTests: updatedTests,
          };
        }),

      syncCohortData: () => {
        set((state) => {
          const updatedStudents = reconcileAllStudents(
            state.students || [],
            state.user,
            state.problemProgress || {},
            state.completedLessons || [],
            state.quizScores || {}
          );
          return { students: updatedStudents };
        });
        broadcastCohortSync();
      },

      addCustomProblemSet: (setInfo) =>
        set((state) => ({
          customProblemSets: [
            ...(state.customProblemSets || []),
            {
              ...setInfo,
              id: `set-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteCustomProblemSet: (id) =>
        set((state) => ({
          customProblemSets: (state.customProblemSets || []).filter((s) => s.id !== id),
        })),

      resetProgress: () =>
        set({
          problemProgress: {},
          bookmarks: [],
          completedLessons: [],
          quizScores: {},
        }),

      // Student Authentication Actions
      loginStudent: (identifier: string, _password?: string) => {
        const clean = identifier.trim().toLowerCase();
        if (!clean) {
          return { success: false, message: 'Please enter your Registration Number or Student Email.' };
        }
        const currentStudents = get().students;
        const found = currentStudents.find(
          (s) =>
            s.email.toLowerCase() === clean ||
            s.registrationNumber.toLowerCase() === clean ||
            s.name.toLowerCase() === clean ||
            s.id.toLowerCase() === clean
        );

        if (!found) {
          return {
            success: false,
            message: `No student record found matching "${identifier}". Please check your details, sign up for a new account, or use one of the Quick Demo student accounts.`,
          };
        }

        // Approval Check: If student is pending or disapproved, block login
        if (found.approvalStatus === 'pending') {
          return {
            success: false,
            message: `Your registration request for "${found.name}" is currently PENDING administrator approval. Please wait for an administrator to review and approve your account.`,
          };
        }

        if (found.approvalStatus === 'disapproved') {
          return {
            success: false,
            message: `Your registration request for "${found.name}" was DISAPPROVED by the administrator. Please contact your faculty coordinator.`,
          };
        }

        const userProfile: UserProfile = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: 'student',
          university: found.track === 'lpu' ? 'Lovely Professional University (LPU)' : 'Global Student Cohort',
          semester: 3,
          registrationNumber: found.registrationNumber,
          batch: found.batch,
          track: found.track,
          avatar: found.avatar,
          approvalStatus: found.approvalStatus || 'approved',
        };

        set((state) => {
          const updatedProgress = { ...state.problemProgress };

          // 1. Seed any solved problems from student record into active problemProgress
          if (found.solvedProblemIds && found.solvedProblemIds.length > 0) {
            found.solvedProblemIds.forEach((pid) => {
              if (!updatedProgress[pid]) {
                updatedProgress[pid] = {
                  problemId: pid,
                  status: 'SOLVED',
                  lastUpdated: new Date().toISOString(),
                  solvedAt: new Date().toISOString(),
                };
              }
            });
          }

          // 2. Collect all solved problems in active problemProgress and sync back to student record
          const allSolvedIds = Object.values(updatedProgress)
            .filter((p) => p.status === 'SOLVED')
            .map((p) => p.problemId);

          const updatedStudents = state.students.map((s) => {
            const matches =
              s.id === found.id ||
              s.registrationNumber === found.registrationNumber ||
              (s.email && found.email && s.email.toLowerCase() === found.email.toLowerCase());

            if (matches) {
              return {
                ...s,
                solvedProblemIds: allSolvedIds,
                totalSolved: allSolvedIds.length,
                completedLessons: Array.from(new Set([...(s.completedLessons || []), ...(state.completedLessons || [])])),
                status: 'online' as const,
                lastActive: 'Just now',
                currentActivity: `Active in ${found.track === 'lpu' ? 'LPU Portal' : 'Global DSA Track'}`,
              };
            }
            return s;
          });

          broadcastCohortSync();

          return {
            user: userProfile,
            isStudentAuthenticated: true,
            activePortal: found.track,
            hasChosenTrack: true,
            problemProgress: updatedProgress,
            students: updatedStudents,
          };
        });

        return {
          success: true,
          message: `Welcome back, ${found.name}! Signed in successfully to ${found.track === 'lpu' ? 'LPU Portal' : 'Global DSA Track'}.`,
          student: found,
        };
      },

      quickLoginStudent: (studentId: string) => {
        const student = get().students.find((s) => s.id === studentId);
        if (student) {
          const res = get().loginStudent(student.registrationNumber);
          return res.success;
        }
        return false;
      },

      logoutStudent: () => {
        broadcastCohortSync();
        set({
          isStudentAuthenticated: false,
          user: {
            id: 'guest',
            name: 'Guest Student',
            email: '',
            role: 'student',
            university: 'Not Logged In',
            semester: 1,
          },
        });
      },

      // Admin Authentication Actions
      authenticateAdmin: (passcode) => {
        const cleaned = passcode.trim().toLowerCase();
        if (cleaned === 'admin123' || cleaned === 'faculty' || cleaned === 'admin' || cleaned === 'codenerve') {
          set({ isAdminAuthenticated: true, user: { ...defaultUser, role: 'admin' } });
          return true;
        }
        return false;
      },

      logoutAdmin: () =>
        set({ isAdminAuthenticated: false, user: { ...defaultUser, role: 'student' } }),

      // Admin Test Assignment Action
      assignTest: (testData) =>
        set((state) => {
          const newTest: AssignedTest = {
            ...testData,
            id: `test-${Date.now()}`,
            createdAt: new Date().toISOString(),
            submissionsCount: 0,
          };
          broadcastCohortSync();
          return {
            assignedTests: [newTest, ...(state.assignedTests || [])],
          };
        }),

      deleteAssignedTest: (testId) =>
        set((state) => {
          broadcastCohortSync();
          return {
            assignedTests: (state.assignedTests || []).filter((t) => t.id !== testId),
          };
        }),

      // Admin Student Approval & Management Actions
      approveStudent: (studentId: string) => {
        set((state) => {
          const updatedStudents = (state.students || []).map((s) => {
            if (s.id === studentId) {
              const currentAct = s.currentActivity || '';
              const newAct = currentAct.toLowerCase().includes('pending')
                ? 'Account approved by faculty · Ready for coursework'
                : currentAct;
              return {
                ...s,
                approvalStatus: 'approved' as const,
                currentActivity: newAct,
              };
            }
            return s;
          });
          const updatedUser =
            state.user.id === studentId
              ? { ...state.user, approvalStatus: 'approved' as const }
              : state.user;

          broadcastCohortSync();

          return { students: updatedStudents, user: updatedUser };
        });
      },

      disapproveStudent: (studentId: string) => {
        set((state) => {
          const isCurrent = state.user.id === studentId;
          const updatedStudents = (state.students || []).map((s) =>
            s.id === studentId ? { ...s, approvalStatus: 'disapproved' as const } : s
          );
          broadcastCohortSync();
          return {
            students: updatedStudents,
            ...(isCurrent
              ? {
                  isStudentAuthenticated: false,
                  user: {
                    id: 'guest',
                    name: 'Guest Student',
                    email: '',
                    role: 'student' as const,
                    university: 'Not Logged In',
                    semester: 1,
                  },
                }
              : {}),
          };
        });
      },

      deleteStudent: (studentId: string) => {
        set((state) => {
          const isCurrent = state.user.id === studentId;
          const updatedStudents = (state.students || []).filter((s) => s.id !== studentId);
          broadcastCohortSync();
          return {
            students: updatedStudents,
            ...(isCurrent
              ? {
                  isStudentAuthenticated: false,
                  user: {
                    id: 'guest',
                    name: 'Guest Student',
                    email: '',
                    role: 'student' as const,
                    university: 'Not Logged In',
                    semester: 1,
                  },
                }
              : {}),
          };
        });
      },

      // Student Registration (also connects to Admin Live Roster)
      registerStudent: (studentData, autoLogin = false) => {
        const approvalStatus = studentData.approvalStatus || 'pending';

        // Inherit current solved problems if any exist in the local session
        const currentSolved = get().problemProgress
          ? Object.values(get().problemProgress)
              .filter((p) => p.status === 'SOLVED')
              .map((p) => p.problemId)
          : [];

        const solvedProblemIds =
          studentData.solvedProblemIds && studentData.solvedProblemIds.length > 0
            ? studentData.solvedProblemIds
            : currentSolved;

        const newStudent: StudentRecord = {
          ...studentData,
          id: `std-${Date.now()}`,
          joinedAt: new Date().toISOString(),
          solvedProblemIds,
          totalSolved: solvedProblemIds.length,
          status: 'online',
          currentActivity: approvalStatus === 'pending'
            ? 'Registration submitted (Pending Admin Approval)'
            : 'Just registered & started onboarding',
          lastActive: 'Just now',
          completedLessons: studentData.completedLessons || get().completedLessons || [],
          quizScores: studentData.quizScores || get().quizScores || {},
          approvalStatus,
        };

        set((state) => {
          const updatedStudents = [newStudent, ...(state.students || [])];
          broadcastCohortSync();

          // Only auto-login if explicitly requested AND student is approved
          if (!autoLogin || approvalStatus !== 'approved') {
            return { students: updatedStudents };
          }

          const userProfile: UserProfile = {
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email,
            role: 'student',
            university: newStudent.track === 'lpu' ? 'Lovely Professional University (LPU)' : 'Global Student Cohort',
            semester: 3,
            registrationNumber: newStudent.registrationNumber,
            batch: newStudent.batch,
            track: newStudent.track,
            avatar: newStudent.avatar,
            approvalStatus: 'approved',
          };

          return {
            students: updatedStudents,
            user: userProfile,
            isStudentAuthenticated: true,
            activePortal: newStudent.track,
            hasChosenTrack: true,
          };
        });

        return newStudent;
      },
    }),
    {
      name: 'codenerve_user_storage_v1',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          const theme = state.theme || 'system';
          const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.classList.toggle('dark', isDark);
          document.documentElement.classList.toggle('light', !isDark);
          document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

          // Auto-reconcile student roster entries upon rehydrate
          if (state.students && state.problemProgress) {
            state.students = reconcileAllStudents(
              state.students,
              state.user,
              state.problemProgress,
              state.completedLessons || [],
              state.quizScores || {}
            );
          }
        }
      },
    }
  )
);

// Cross-tab real-time cohort synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'codenerve_user_storage_v1') {
      try {
        useUserStore.persist.rehydrate();
        useUserStore.getState().syncCohortData();
      } catch {
        // Ignore
      }
    }
  });

  if (cohortChannel) {
    cohortChannel.onmessage = (msg) => {
      if (msg.data?.type === 'SYNC_STORE') {
        try {
          useUserStore.persist.rehydrate();
          useUserStore.getState().syncCohortData();
        } catch {
          // Ignore
        }
      }
    };
  }
}
