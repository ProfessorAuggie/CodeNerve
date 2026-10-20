import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProblemProgress, ProblemStatus, UserRole, UserProfile, StudentRecord, AssignedTest } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  loadStudentData,
  registerStudentRemote,
  saveProblemProgress,
  saveQuizScore,
  setBookmark,
  setLessonCompletion,
  signInStudent,
} from '../lib/supabaseData';

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

  // Guest Task Guard & Auth Modal
  isAuthModalOpen: boolean;
  authModalAction: string;
  openAuthModal: (actionText?: string) => void;
  closeAuthModal: () => void;

  // Student Authentication Actions
  loginStudent: (identifier: string, password?: string) => { success: boolean; message: string; student?: StudentRecord };
  loginStudentRemote: (identifier: string, password: string) => Promise<{ success: boolean; message: string; profile?: UserProfile }>;
  restoreRemoteSession: () => Promise<void>;
  logoutStudent: () => void;
  logoutStudentRemote: () => Promise<void>;

  // Admin Actions
  authenticateAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  assignTest: (test: Omit<AssignedTest, 'id' | 'createdAt' | 'submissionsCount'>) => void;
  deleteAssignedTest: (testId: string) => void;
  approveStudent: (studentId: string) => void;
  disapproveStudent: (studentId: string) => void;
  deleteStudent: (studentId: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateStudentByAdmin: (studentId: string, updates: Partial<StudentRecord>) => void;
  registerStudent: (
    student: Omit<StudentRecord, 'id' | 'joinedAt' | 'totalSolved' | 'completedLessons' | 'quizScores' | 'status' | 'currentActivity' | 'lastActive' | 'solvedProblemIds'> & {
      status?: 'online' | 'idle' | 'offline';
      currentActivity?: string;
      lastActive?: string;
      solvedProblemIds?: string[];
      completedLessons?: string[];
      quizScores?: Record<string, { score: number; total: number; date: string }>;
    },
    autoLogin?: boolean
  ) => StudentRecord;
  registerStudentRemote: (input: {
    name: string;
    email: string;
    password: string;
    registrationNumber: string;
    batch: string;
    track: 'global' | 'lpu';
  }) => Promise<{ name: string }>;
}

const INITIAL_STUDENTS: StudentRecord[] = [];

const INITIAL_ASSIGNED_TESTS: AssignedTest[] = [];

const defaultUser: UserProfile = {
  id: 'guest',
  name: 'Guest Learner',
  email: '',
  role: 'student',
  university: 'CodeNerve Explorer',
  semester: 1,
  registrationNumber: '',
  batch: 'Independent Study',
  track: 'global',
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
      isStudentAuthenticated: false,
      problemProgress: {},
      bookmarks: [],
      completedLessons: [],
      quizScores: {},
      customProblemSets: [],
      isAuthModalOpen: false,
      authModalAction: '',
      openAuthModal: (actionText = 'perform interactive learning tasks') =>
        set({ isAuthModalOpen: true, authModalAction: actionText }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

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

      updateProblemStatus: (problemId, status, notes, submissionUrl) => {
        if (!get().isStudentAuthenticated || get().user.id === 'guest') {
          get().openAuthModal('mark questions completed or track DSA progress');
          return;
        }
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

          if (isSupabaseConfigured && state.user.id !== 'guest') {
            const progress = newProgressMap[problemId];
            void saveProblemProgress(state.user.id, progress).catch((error: unknown) => {
              console.error('Failed to save problem progress to Supabase.', error);
            });
          }

          return {
            problemProgress: newProgressMap,
            students: updatedStudents,
          };
        });
      },

      toggleBookmark: (problemId) => {
        if (!get().isStudentAuthenticated || get().user.id === 'guest') {
          get().openAuthModal('bookmark problems for revision');
          return;
        }
        set((state) => {
          const list = state.bookmarks || [];
          const isBookmarked = list.includes(problemId);
          if (isSupabaseConfigured && state.user.id !== 'guest') {
            void setBookmark(state.user.id, problemId, !isBookmarked).catch((error: unknown) => {
              console.error('Failed to save bookmark to Supabase.', error);
            });
          }
          return {
            bookmarks: isBookmarked
              ? list.filter((id) => id !== problemId)
              : [...list, problemId],
          };
        });
      },

      markLessonComplete: (lessonId, completed = true) => {
        if (!get().isStudentAuthenticated || get().user.id === 'guest') {
          get().openAuthModal('mark curriculum lessons completed');
          return;
        }
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

          if (isSupabaseConfigured && state.user.id !== 'guest') {
            void setLessonCompletion(state.user.id, lessonId, completed).catch((error: unknown) => {
              console.error('Failed to save lesson progress to Supabase.', error);
            });
          }

          return {
            completedLessons: nextList,
            students: updatedStudents,
          };
        });
      },

      saveQuizResult: (quizId, score, total) => {
        if (!get().isStudentAuthenticated || get().user.id === 'guest') {
          get().openAuthModal('save quiz results and assessment scores');
          return;
        }
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

          if (isSupabaseConfigured && state.user.id !== 'guest') {
            void saveQuizScore(state.user.id, quizId, score, total).catch((error: unknown) => {
              console.error('Failed to save quiz score to Supabase.', error);
            });
          }

          return {
            quizScores: newQuizScores,
            students: updatedStudents,
          };
        });
      },

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

      recordAssignedTestSubmission: (testId: string, score: number, total: number) => {
        if (!get().isStudentAuthenticated || get().user.id === 'guest') {
          get().openAuthModal('submit assigned tests and coursework');
          return;
        }
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
        });
      },

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

      addCustomProblemSet: (setInfo) => {
        if (!get().isStudentAuthenticated || get().user.id === 'guest') {
          get().openAuthModal('create custom problem sets');
          return;
        }
        set((state) => ({
          customProblemSets: [
            ...(state.customProblemSets || []),
            {
              ...setInfo,
              id: `set-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

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
            message: `No student record found matching "${identifier}". Please check your details or create a new student account.`,
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

      loginStudentRemote: async (identifier, password) => {
        if (!isSupabaseConfigured) {
          console.warn('Supabase is not configured; using the legacy in-memory login fallback.');
          const legacyResult = get().loginStudent(identifier, password);
          if (!legacyResult.success || !legacyResult.student) return legacyResult;
          const student = legacyResult.student;
          return {
            success: true,
            message: legacyResult.message,
            profile: {
              id: student.id,
              name: student.name,
              email: student.email,
              role: 'student',
              university: student.university || 'CodeNerve Explorer',
              semester: student.semester || 1,
              registrationNumber: student.registrationNumber,
              batch: student.batch,
              track: student.track,
              avatar: student.avatar,
              approvalStatus: student.approvalStatus,
            },
          };
        }
        const result = await signInStudent(identifier, password);
        if (!result.success || !result.profile) return result;

        const data = await loadStudentData(result.profile.id);
        set({
          user: result.profile,
          isStudentAuthenticated: true,
          activePortal: result.profile.track || 'global',
          hasChosenTrack: true,
          problemProgress: data.problemProgress,
          bookmarks: data.bookmarks,
          completedLessons: data.completedLessons,
          quizScores: data.quizScores,
        });
        return result;
      },

      restoreRemoteSession: async () => {
        if (!isSupabaseConfigured || !supabase) return;
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session?.user) return;

        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        if (profileError) throw profileError;
        const profile = {
          ...profileRow,
          id: String(profileRow.id),
          role: profileRow.role as UserRole,
          semester: Number(profileRow.semester),
          registrationNumber: profileRow.registration_number ?? undefined,
          approvalStatus: profileRow.approval_status,
        } as UserProfile;
        const studentData = await loadStudentData(profile.id);
        set({
          user: profile,
          isStudentAuthenticated: true,
          activePortal: profile.track || 'global',
          hasChosenTrack: true,
          ...studentData,
        });
      },

      logoutStudent: () => {
        broadcastCohortSync();
        set({
          isStudentAuthenticated: false,
          user: defaultUser,
          problemProgress: {},
          bookmarks: [],
          completedLessons: [],
          quizScores: {},
        });
      },

      logoutStudentRemote: async () => {
        if (supabase) {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        }
        get().logoutStudent();
      },

      // Admin Authentication Actions
      authenticateAdmin: (passcode) => {
        const cleaned = passcode.trim().toLowerCase();
        if (cleaned === 'admin123' || cleaned === 'faculty' || cleaned === 'admin' || cleaned === 'codenerve') {
          set((state) => ({
            isAdminAuthenticated: true,
            user: {
              id: 'admin-001',
              name: state.user.role === 'admin' && state.user.name !== 'Alex Rivera' ? state.user.name : 'Dr. Auggie',
              email: state.user.role === 'admin' && state.user.email !== 'alex.rivera@lpu.in' ? state.user.email : 'auggie.hod@lpu.in',
              role: 'admin',
              university: state.user.role === 'admin' ? state.user.university : 'Lovely Professional University (LPU)',
              semester: 0,
              registrationNumber: state.user.role === 'admin' && state.user.registrationNumber !== '12104921' ? state.user.registrationNumber : 'FAC-1001',
              batch: state.user.role === 'admin' && state.user.batch !== 'LPU B.Tech CSE (CSE202/205)' ? state.user.batch : 'Head of CSE Faculty',
              track: 'lpu',
              approvalStatus: 'approved',
            },
          }));
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

      updateUserProfile: (updates: Partial<UserProfile>) => {
        set((state) => {
          const updatedUser: UserProfile = { ...state.user, ...updates };
          const isStudent = updatedUser.role === 'student' && updatedUser.id !== 'guest';

          let updatedStudents = state.students || [];
          if (isStudent) {
            const currentUserId = state.user?.id;
            const currentRegNo = state.user?.registrationNumber;
            const currentEmail = state.user?.email?.toLowerCase();

            updatedStudents = updatedStudents.map((s) => {
              const matches =
                s.id === currentUserId ||
                (currentRegNo && s.registrationNumber === currentRegNo) ||
                (currentEmail && s.email && s.email.toLowerCase() === currentEmail);

              if (matches) {
                return {
                  ...s,
                  name: updates.name !== undefined ? updates.name : s.name,
                  email: updates.email !== undefined ? updates.email : s.email,
                  registrationNumber: updates.registrationNumber !== undefined ? updates.registrationNumber : s.registrationNumber,
                  track: updates.track !== undefined ? updates.track : s.track,
                  batch: updates.batch !== undefined ? updates.batch : s.batch,
                  avatar: updates.avatar !== undefined ? updates.avatar : s.avatar,
                  approvalStatus: updates.approvalStatus !== undefined ? updates.approvalStatus : s.approvalStatus,
                  currentActivity: 'Updated profile details',
                  lastActive: 'Just now',
                  status: 'online' as const,
                };
              }
              return s;
            });
          }

          broadcastCohortSync();

          return {
            user: updatedUser,
            students: updatedStudents,
            ...(updates.track ? { activePortal: updates.track } : {}),
          };
        });
      },

      updateStudentByAdmin: (studentId: string, updates: Partial<StudentRecord>) => {
        set((state) => {
          const updatedStudents = (state.students || []).map((s) => {
            if (s.id === studentId) {
              return {
                ...s,
                ...updates,
              };
            }
            return s;
          });

          // If the edited student is the current active student, keep their session synced
          const isCurrentActive =
            state.user.id === studentId ||
            (state.user.registrationNumber &&
              state.students.find((s) => s.id === studentId)?.registrationNumber === state.user.registrationNumber);

          let updatedUser = state.user;
          if (isCurrentActive && state.user.role === 'student') {
            updatedUser = {
              ...state.user,
              ...(updates.name !== undefined ? { name: updates.name } : {}),
              ...(updates.email !== undefined ? { email: updates.email } : {}),
              ...(updates.registrationNumber !== undefined ? { registrationNumber: updates.registrationNumber } : {}),
              ...(updates.batch !== undefined ? { batch: updates.batch } : {}),
              ...(updates.track !== undefined ? { track: updates.track } : {}),
              ...(updates.avatar !== undefined ? { avatar: updates.avatar } : {}),
              ...(updates.approvalStatus !== undefined ? { approvalStatus: updates.approvalStatus } : {}),
            };
          }

          broadcastCohortSync();

          return {
            students: updatedStudents,
            user: updatedUser,
            ...(isCurrentActive && updates.track ? { activePortal: updates.track } : {}),
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

      registerStudentRemote: async (input) => {
        if (!isSupabaseConfigured) {
          console.warn('Supabase is not configured; using the legacy in-memory registration fallback.');
          const student = get().registerStudent({
            name: input.name,
            email: input.email,
            registrationNumber: input.registrationNumber,
            batch: input.batch,
            track: input.track,
            approvalStatus: 'pending',
          }, false);
          return { name: student.name };
        }
        return registerStudentRemote(input);
      },
    }),
    {
      name: 'codenerve_preferences_v3',
      partialize: (state) => ({
        theme: state.theme,
        activePortal: state.activePortal,
        hasChosenTrack: state.hasChosenTrack,
      }),
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
    if (event.key === 'codenerve_preferences_v3') {
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
