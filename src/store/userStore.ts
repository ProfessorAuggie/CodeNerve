import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProblemProgress, ProblemStatus, UserRole } from '../types';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  semester: number;
  avatar?: string;
}

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
  
  activePortal: 'global' | 'lpu';
  hasChosenTrack: boolean;
  showTrackModal: boolean;
  
  // Actions
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
}

const defaultUser: UserProfile = {
  id: 'user-default-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@lpu.in',
  role: 'student',
  university: 'Lovely Professional University (LPU)',
  semester: 3,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      hasChosenTrack: false,
      showTrackModal: false,
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

      activePortal: 'global',

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
    }),
    {
      name: 'codenerve_user_storage_v1',
    }
  )
);
