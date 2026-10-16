import { describe, it, expect } from 'vitest';
import { 
  PROBLEMS, 
  getProblemById, 
  getProblemsByDifficulty, 
  getProblemsByPlatform, 
  getProblemsByTopic, 
  getProblemsByIds,
  searchProblems,
  isProblemInTrack,
  getProblemsByTrack
} from '../data/problems';

describe('Problem Filtering & Catalogue Helpers', () => {
  it('retrieves problem by canonical ID', () => {
    const problem = getProblemById('p-dsa-ll-reverse-1');
    expect(problem).toBeDefined();
    expect(problem?.title).toBe('Reverse a Singly Linked List');
    expect(problem?.platform).toBe('leetcode');
    expect(problem?.difficulty).toBe('easy');
  });

  it('returns undefined for non-existent problem ID', () => {
    const problem = getProblemById('non-existent-problem-id-999');
    expect(problem).toBeUndefined();
  });

  it('filters problems by difficulty level (easy, medium, hard)', () => {
    const easyProblems = getProblemsByDifficulty('easy');
    const mediumProblems = getProblemsByDifficulty('medium');
    const hardProblems = getProblemsByDifficulty('hard');

    expect(easyProblems.length).toBeGreaterThan(0);
    expect(mediumProblems.length).toBeGreaterThan(0);
    expect(hardProblems.length).toBeGreaterThan(0);

    expect(easyProblems.every((p) => p.difficulty === 'easy')).toBe(true);
    expect(mediumProblems.every((p) => p.difficulty === 'medium')).toBe(true);
    expect(hardProblems.every((p) => p.difficulty === 'hard')).toBe(true);
  });

  it('filters problems by platform tag (leetcode, geeksforgeeks, hackerrank)', () => {
    const leetcodeProbs = getProblemsByPlatform('leetcode');
    const gfgProbs = getProblemsByPlatform('geeksforgeeks');
    const hrProbs = getProblemsByPlatform('hackerrank');

    expect(leetcodeProbs.length).toBeGreaterThan(0);
    expect(gfgProbs.length).toBeGreaterThan(0);
    expect(hrProbs.length).toBeGreaterThan(0);

    expect(leetcodeProbs.every((p) => p.platform === 'leetcode')).toBe(true);
    expect(gfgProbs.every((p) => p.platform === 'geeksforgeeks')).toBe(true);
    expect(hrProbs.every((p) => p.platform === 'hackerrank')).toBe(true);
  });

  it('filters problems by topic tags', () => {
    const graphProblems = getProblemsByTopic('graphs');
    expect(graphProblems.length).toBeGreaterThan(0);
    expect(graphProblems.every((p) => p.topicTags.includes('graphs'))).toBe(true);

    const dpProblems = getProblemsByTopic('dynamic-programming');
    expect(dpProblems.length).toBeGreaterThan(0);
    expect(dpProblems.every((p) => p.topicTags.includes('dynamic-programming'))).toBe(true);
  });

  it('searches problems by title, platform, or tags case-insensitively', () => {
    const searchBinary = searchProblems('binary');
    expect(searchBinary.length).toBeGreaterThan(0);
    expect(
      searchBinary.some(
        (p) =>
          p.title.toLowerCase().includes('binary') ||
          p.topicTags.some((t) => t.includes('binary'))
      )
    ).toBe(true);

    const searchCplusplus = searchProblems('destructors');
    expect(searchCplusplus.length).toBeGreaterThan(0);
    expect(searchCplusplus.every((p) => p.title.toLowerCase().includes('destructor'))).toBe(true);
  });

  it('handles empty results gracefully when queries do not match', () => {
    const emptySearch = searchProblems('nonexistent-gibberish-query-987654');
    expect(emptySearch).toEqual([]);

    const emptyTopic = getProblemsByTopic('quantum-computing-topic');
    expect(emptyTopic).toEqual([]);
  });

  it('batch resolves problem list by ID array maintaining order and filtering invalid entries', () => {
    const testIds = ['p-dsa-ll-reverse-1', 'invalid-id-xyz', 'p-dsa-bubble-sort-1'];
    const resolved = getProblemsByIds(testIds);

    expect(resolved.length).toBe(2);
    expect(resolved[0].id).toBe('p-dsa-ll-reverse-1');
    expect(resolved[1].id).toBe('p-dsa-bubble-sort-1');
  });

  it('validates combined multi-attribute filters', () => {
    // Medium + LeetCode + dynamic-programming
    const combined = PROBLEMS.filter(
      (p) =>
        p.isActive &&
        p.difficulty === 'medium' &&
        p.platform === 'leetcode' &&
        p.topicTags.includes('dynamic-programming')
    );

    expect(combined.length).toBeGreaterThan(0);
    expect(combined.every((p) => p.difficulty === 'medium' && p.platform === 'leetcode')).toBe(true);
  });

  it('supports dual-track problem mapping so Global covers all applicable DSA problems', () => {
    const globalProblems = getProblemsByTrack('global');
    const lpuProblems = getProblemsByTrack('lpu');

    // Both tracks have rich, justified catalogues
    expect(globalProblems.length).toBeGreaterThanOrEqual(280);
    expect(lpuProblems.length).toBeGreaterThanOrEqual(280);

    // Verify dual-track problems are included in both
    const dualTrackProblems = PROBLEMS.filter((p) => p.track === 'both');
    expect(dualTrackProblems.length).toBeGreaterThan(0);

    dualTrackProblems.forEach((p) => {
      expect(isProblemInTrack(p, 'global')).toBe(true);
      expect(isProblemInTrack(p, 'lpu')).toBe(true);
    });
  });
});
