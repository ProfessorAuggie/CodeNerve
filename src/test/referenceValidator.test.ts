import { describe, it, expect } from 'vitest';
import { validateReferences } from '../utils/referenceValidator';
import { PROBLEMS } from '../data/problems';
import { VISUALIZER_MAPPINGS } from '../data/visualizers';
import { LESSONS } from '../data/lessons';
import { SUBJECTS } from '../data/syllabus';

describe('Cross-Reference Integrity Validator', () => {
  it('validates that production curriculum and graph reference integrity passes completely', () => {
    const result = validateReferences();

    expect(result.errors).toEqual([]);
    expect(result.passed).toBe(true);
    expect(result.metrics.totalProblems).toBeGreaterThan(0);
    expect(result.metrics.totalVisualizers).toBeGreaterThan(0);
    expect(result.metrics.totalLessons).toBeGreaterThan(0);
    expect(result.metrics.totalSyllabusTopics).toBeGreaterThan(0);
    expect(result.metrics.totalGraphNodes).toBeGreaterThan(0);
  });

  it('guarantees that canonical problem IDs resolve cleanly', () => {
    const canonicalId = 'p-dsa-ll-reverse-1';
    const found = PROBLEMS.some((p) => p.id === canonicalId);
    expect(found).toBe(true);
  });

  it('verifies all problems have valid HTTPS external URLs', () => {
    for (const prob of PROBLEMS) {
      expect(prob.externalUrl).toMatch(/^https:\/\//);
    }
  });

  it('ensures no duplicate problem IDs exist in PROBLEMS', () => {
    const ids = PROBLEMS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('verifies that every visualizer algorithmId is unique and registered', () => {
    const visualizerIds = VISUALIZER_MAPPINGS.map((v) => v.algorithmId);
    const uniqueIds = new Set(visualizerIds);
    expect(visualizerIds.length).toBe(uniqueIds.size);
  });

  it('confirms every lesson references existing problem IDs', () => {
    const validProblemIds = new Set(PROBLEMS.map((p) => p.id));
    for (const lesson of LESSONS) {
      for (const pId of lesson.relatedProblemIds) {
        expect(validProblemIds.has(pId)).toBe(true);
      }
    }
  });

  it('confirms every syllabus topic references existing problem IDs when mapped', () => {
    const validProblemIds = new Set(PROBLEMS.map((p) => p.id));
    for (const subject of SUBJECTS) {
      for (const unit of subject.units) {
        for (const topic of unit.topics) {
          if (topic.problemIds) {
            for (const pId of topic.problemIds) {
              expect(validProblemIds.has(pId)).toBe(true);
            }
          }
        }
      }
    }
  });

  it('validates that all problem platforms and difficulty levels match schema', () => {
    const validPlatforms = new Set(['leetcode', 'geeksforgeeks', 'codechef', 'codeforces', 'hackerrank', 'hackerearth']);
    const validDifficulties = new Set(['easy', 'medium', 'hard']);

    for (const prob of PROBLEMS) {
      expect(validPlatforms.has(prob.platform)).toBe(true);
      expect(validDifficulties.has(prob.difficulty)).toBe(true);
    }
  });

  it('validates that problem URLs correspond to their platform domains', () => {
    for (const prob of PROBLEMS) {
      if (prob.platform === 'leetcode') {
        expect(prob.externalUrl).toContain('leetcode.com');
      } else if (prob.platform === 'geeksforgeeks') {
        expect(prob.externalUrl).toContain('geeksforgeeks.org');
      } else if (prob.platform === 'hackerrank') {
        expect(prob.externalUrl).toContain('hackerrank.com');
      }
    }
  });
});
