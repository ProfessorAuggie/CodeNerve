import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../store/userStore';

describe('userStore (Zustand state management)', () => {
  beforeEach(() => {
    localStorage.clear();
    useUserStore.getState().resetProgress();
  });

  it('updates problem status to SOLVED and tracks solvedAt timestamp', () => {
    const store = useUserStore.getState();
    const testId = 'p-dsa-array-traversal-1';

    store.updateProblemStatus(testId, 'SOLVED', 'Solved using two pointers', 'https://leetcode.com/submissions/1');

    const updated = useUserStore.getState().problemProgress[testId];
    expect(updated).toBeDefined();
    expect(updated.status).toBe('SOLVED');
    expect(updated.notes).toBe('Solved using two pointers');
    expect(updated.submissionUrl).toBe('https://leetcode.com/submissions/1');
    expect(updated.solvedAt).toBeDefined();
    expect(typeof updated.solvedAt).toBe('string');
  });

  it('handles ATTEMPTED and REVISE states without marking solvedAt', () => {
    const store = useUserStore.getState();
    const testId = 'p-dsa-linear-search-1';

    store.updateProblemStatus(testId, 'ATTEMPTED', 'Hit time limit on large inputs');
    let progress = useUserStore.getState().problemProgress[testId];
    expect(progress.status).toBe('ATTEMPTED');
    expect(progress.notes).toBe('Hit time limit on large inputs');
    expect(progress.solvedAt).toBeUndefined();

    store.updateProblemStatus(testId, 'REVISION_NEEDED', 'Review edge cases for negative numbers');
    progress = useUserStore.getState().problemProgress[testId];
    expect(progress.status).toBe('REVISION_NEEDED');
    expect(progress.notes).toBe('Review edge cases for negative numbers');
  });

  it('maintains state isolation between different problem IDs', () => {
    const store = useUserStore.getState();
    const idA = 'p-dsa-bubble-sort-1';
    const idB = 'p-dsa-merge-sort-1';

    store.updateProblemStatus(idA, 'SOLVED', 'Note A');
    store.updateProblemStatus(idB, 'ATTEMPTED', 'Note B');

    const state = useUserStore.getState().problemProgress;
    expect(state[idA].status).toBe('SOLVED');
    expect(state[idA].notes).toBe('Note A');

    expect(state[idB].status).toBe('ATTEMPTED');
    expect(state[idB].notes).toBe('Note B');
  });

  it('toggles bookmarks accurately adding and removing IDs', () => {
    const store = useUserStore.getState();
    const problemId = 'p-dsa-bst-insert-1';

    // Remove if default exists, then test clean toggle
    if (useUserStore.getState().bookmarks.includes(problemId)) {
      store.toggleBookmark(problemId);
    }
    expect(useUserStore.getState().bookmarks).not.toContain(problemId);

    // Toggle on
    store.toggleBookmark(problemId);
    expect(useUserStore.getState().bookmarks).toContain(problemId);

    // Toggle off
    store.toggleBookmark(problemId);
    expect(useUserStore.getState().bookmarks).not.toContain(problemId);
  });

  it('handles track choice switching and modal controls', () => {
    const store = useUserStore.getState();

    store.chooseTrack('lpu');
    expect(useUserStore.getState().activePortal).toBe('lpu');
    expect(useUserStore.getState().hasChosenTrack).toBe(true);
    expect(useUserStore.getState().showTrackModal).toBe(false);

    store.chooseTrack('global');
    expect(useUserStore.getState().activePortal).toBe('global');
    expect(useUserStore.getState().hasChosenTrack).toBe(true);

    store.openTrackModal();
    expect(useUserStore.getState().showTrackModal).toBe(true);

    store.closeTrackModal();
    expect(useUserStore.getState().showTrackModal).toBe(false);
  });

  it('handles lesson completion toggles', () => {
    const store = useUserStore.getState();
    const lessonId = 'lesson-dsa-binary-search';

    store.markLessonComplete(lessonId, true);
    expect(useUserStore.getState().completedLessons).toContain(lessonId);

    store.markLessonComplete(lessonId, false);
    expect(useUserStore.getState().completedLessons).not.toContain(lessonId);
  });

  it('handles custom problem sets creation and deletion', () => {
    const store = useUserStore.getState();
    const initialCount = store.customProblemSets.length;

    store.addCustomProblemSet({
      title: 'Dynamic Programming Sprint',
      description: '1D and 2D interview patterns',
      problemIds: ['p-dsa-climbing-stairs-1', 'p-dsa-coin-change-1'],
    });

    const sets = useUserStore.getState().customProblemSets;
    expect(sets.length).toBe(initialCount + 1);
    const created = sets.find((s) => s.title === 'Dynamic Programming Sprint');
    expect(created).toBeDefined();

    if (created) {
      store.deleteCustomProblemSet(created.id);
      expect(useUserStore.getState().customProblemSets.some((s) => s.id === created.id)).toBe(false);
    }
  });

  it('handles corrupted localStorage payload gracefully on initialization', () => {
    // Inject corrupt JSON into storage
    localStorage.setItem('user-storage', 'CORRUPT_INVALID_JSON{{{');

    // Instantiation or access should not throw fatal exceptions
    expect(() => {
      const state = useUserStore.getState();
      expect(state.user).toBeDefined();
    }).not.toThrow();
  });
});
