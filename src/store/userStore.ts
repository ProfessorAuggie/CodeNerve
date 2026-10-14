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

  // Student Authentication Actions
  loginStudent: (identifier: string, password?: string) => { success: boolean; message: string; student?: StudentRecord };
  quickLoginStudent: (studentId: string) => boolean;
  logoutStudent: () => void;

  // Admin Actions
  authenticateAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  assignTest: (test: Omit<AssignedTest, 'id' | 'createdAt' | 'submissionsCount'>) => void;
  deleteAssignedTest: (testId: string) => void;
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
};

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
          const next = state.theme === 'dark' ? 'light' : 'dark';
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
          return {
            problemProgress: {
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
            },
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
          if (completed && !exists) {
            return { completedLessons: [...list, lessonId] };
          }
          if (!completed && exists) {
            return { completedLessons: list.filter((id) => id !== lessonId) };
          }
          return state;
        }),

      saveQuizResult: (quizId, score, total) =>
        set((state) => ({
          quizScores: {
            ...(state.quizScores || {}),
            [quizId]: { score, total, date: new Date().toISOString() },
          },
        })),

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
        };

        set((state) => {
          const updatedProgress = { ...state.problemProgress };
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

          const updatedStudents = state.students.map((s) =>
            s.id === found.id
              ? { ...s, status: 'online' as const, lastActive: 'Just now' }
              : s
          );

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
          return {
            assignedTests: [newTest, ...(state.assignedTests || [])],
          };
        }),

      deleteAssignedTest: (testId) =>
        set((state) => ({
          assignedTests: (state.assignedTests || []).filter((t) => t.id !== testId),
        })),

      // Student Registration (also connects to Admin Live Roster)
      registerStudent: (studentData, autoLogin = true) => {
        const newStudent: StudentRecord = {
          ...studentData,
          id: `std-${Date.now()}`,
          joinedAt: new Date().toISOString(),
          totalSolved: studentData.solvedProblemIds?.length || 0,
          status: 'online',
          currentActivity: 'Just registered & started onboarding',
          lastActive: 'Just now',
          completedLessons: studentData.completedLessons || [],
          quizScores: studentData.quizScores || {},
        };

        set((state) => {
          const updatedStudents = [newStudent, ...(state.students || [])];
          if (!autoLogin) {
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
    }
  )
);
