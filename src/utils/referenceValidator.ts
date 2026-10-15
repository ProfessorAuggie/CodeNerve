import { PROBLEMS } from '../data/problems';
import { VISUALIZER_MAPPINGS } from '../data/visualizers';
import { LESSONS } from '../data/lessons';
import { SUBJECTS } from '../data/syllabus';
import { DSA_ROADMAP, CPP_PATH } from '../data/learningPaths';
import { CSE205_NODES, CSE202_NODES } from '../components/roadmap/LpuAcademicGraph';
import { GRAPH_NODES } from '../components/roadmap/DsaDependencyGraph';
import { GLOBAL_DSA_PATTERNS, LPU_ACADEMIC_PATTERNS } from '../data/dsaPatternsData';

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalProblems: number;
    totalVisualizers: number;
    totalLessons: number;
    totalSyllabusTopics: number;
    totalGraphNodes: number;
  };
}

/**
 * Validates cross-reference integrity across problems, visualizers, lessons,
 * syllabi, and interactive dependency graphs.
 */
export function validateReferences(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Set of valid canonical problem IDs
  const problemIdCounts = new Map<string, number>();
  for (const prob of PROBLEMS) {
    problemIdCounts.set(prob.id, (problemIdCounts.get(prob.id) || 0) + 1);
  }

  // 1. Check for Duplicate Problem IDs
  for (const [id, count] of problemIdCounts.entries()) {
    if (count > 1) {
      errors.push(`Duplicate canonical problem ID found: "${id}" appears ${count} times in PROBLEMS.`);
    }
  }

  const validProblemIds = new Set(problemIdCounts.keys());

  // 2. Check Problem URLs, Platforms, and Domain Consistency
  const validPlatforms = new Set(['leetcode', 'geeksforgeeks', 'codechef', 'codeforces', 'hackerrank', 'hackerearth']);
  const validDifficulties = new Set(['easy', 'medium', 'hard']);

  for (const prob of PROBLEMS) {
    if (!prob.externalUrl || !prob.externalUrl.startsWith('https://')) {
      errors.push(`Problem "${prob.id}" (${prob.title}) has invalid or missing externalUrl: "${prob.externalUrl}".`);
    }

    if (!validPlatforms.has(prob.platform)) {
      errors.push(`Problem "${prob.id}" has unsupported platform: "${prob.platform}".`);
    }

    if (!validDifficulties.has(prob.difficulty)) {
      errors.push(`Problem "${prob.id}" has invalid difficulty: "${prob.difficulty}".`);
    }

    // Platform domain consistency validation
    if (prob.platform === 'leetcode' && !prob.externalUrl.includes('leetcode.com')) {
      errors.push(`Problem "${prob.id}" platform is "leetcode" but URL does not match domain: "${prob.externalUrl}".`);
    } else if (prob.platform === 'geeksforgeeks' && !prob.externalUrl.includes('geeksforgeeks.org')) {
      errors.push(`Problem "${prob.id}" platform is "geeksforgeeks" but URL does not match domain: "${prob.externalUrl}".`);
    } else if (prob.platform === 'hackerrank' && !prob.externalUrl.includes('hackerrank.com')) {
      errors.push(`Problem "${prob.id}" platform is "hackerrank" but URL does not match domain: "${prob.externalUrl}".`);
    }
  }

  // 3. Check Canonical Linked-List Reversal identifier consistency
  const canonicalLlId = 'p-dsa-ll-reverse-1';
  if (!validProblemIds.has(canonicalLlId)) {
    errors.push(`Canonical linked-list reversal problem ID "${canonicalLlId}" missing from PROBLEMS.`);
  }

  // 4. Check Lesson-related Problem IDs
  for (const lesson of LESSONS) {
    for (const pId of lesson.relatedProblemIds) {
      if (!validProblemIds.has(pId)) {
        errors.push(`Lesson "${lesson.id}" references non-existent problem ID: "${pId}".`);
      }
    }
  }

  // 5. Check Syllabus Topic Problem IDs
  const validTopicIds = new Set<string>();
  let totalTopics = 0;
  for (const subject of SUBJECTS) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        totalTopics++;
        validTopicIds.add(topic.id);
        if (topic.problemIds) {
          for (const pId of topic.problemIds) {
            if (!validProblemIds.has(pId)) {
              errors.push(`Syllabus Topic "${topic.id}" (${topic.title}) references non-existent problem ID: "${pId}".`);
            }
          }
        }
      }
    }
  }

  // 6. Check Lesson topic IDs against valid syllabus topics
  for (const lesson of LESSONS) {
    for (const tId of lesson.topicIds) {
      if (!validTopicIds.has(tId)) {
        warnings.push(`Lesson "${lesson.id}" maps to topicId "${tId}" which is not found in SUBJECTS syllabus.`);
      }
    }
  }

  // 7. Check Learning Paths (DSA_ROADMAP & CPP_PATH)
  const paths = [DSA_ROADMAP, CPP_PATH];
  for (const path of paths) {
    for (const group of path.groups) {
      for (const item of group.items) {
        if (item.type === 'problem' && !validProblemIds.has(item.referenceId)) {
          errors.push(`Learning Path "${path.id}" group "${group.id}" references non-existent problem ID: "${item.referenceId}".`);
        }
      }
    }
  }

  // 8. Check Interactive Roadmap Graph Nodes (LPU CSE205, CSE202)
  const allLpuNodes = [...CSE205_NODES, ...CSE202_NODES];
  for (const node of allLpuNodes) {
    for (const pId of node.problemIds) {
      if (!validProblemIds.has(pId)) {
        errors.push(`LPU Node "${node.id}" (${node.title}) references non-existent problem ID: "${pId}".`);
      }
    }
  }

  // 9. Check Registered Visualizer IDs
  const registeredAlgoIds = new Set(VISUALIZER_MAPPINGS.map((v) => v.algorithmId));

  // Check LPU Nodes visualizer IDs
  for (const node of allLpuNodes) {
    if (node.visualizerId && !registeredAlgoIds.has(node.visualizerId)) {
      errors.push(`LPU Node "${node.id}" references unregistered visualizerId: "${node.visualizerId}".`);
    }
  }

  // Check DSA Dependency Flowchart Nodes visualizer IDs
  for (const node of GRAPH_NODES) {
    if (node.visualizerId && !registeredAlgoIds.has(node.visualizerId)) {
      errors.push(`DSA Graph Node "${node.id}" references unregistered visualizerId: "${node.visualizerId}".`);
    }
  }

  // Check Lesson visualizer IDs
  for (const lesson of LESSONS) {
    if (lesson.relatedVisualizerId && !registeredAlgoIds.has(lesson.relatedVisualizerId)) {
      errors.push(`Lesson "${lesson.id}" references unregistered visualizerId: "${lesson.relatedVisualizerId}".`);
    }
  }

  // Check Syllabus topic visualizer IDs
  for (const subject of SUBJECTS) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        if (topic.visualizerId && !registeredAlgoIds.has(topic.visualizerId)) {
          errors.push(`Syllabus Topic "${topic.id}" references unregistered visualizerId: "${topic.visualizerId}".`);
        }
      }
    }
  }

  // 10. Check Mind Map Pattern Nodes (Global & LPU Whimsical Tree)
  const allMindMapCategories = [...GLOBAL_DSA_PATTERNS, ...LPU_ACADEMIC_PATTERNS];
  for (const cat of allMindMapCategories) {
    for (const sub of cat.subPatterns) {
      for (const pat of sub.patterns) {
        for (const pId of pat.problemIds) {
          if (!validProblemIds.has(pId)) {
            errors.push(`Mind Map Pattern "${pat.id}" (${pat.title}) references non-existent problem ID: "${pId}".`);
          }
        }
        if (pat.visualizerId && !registeredAlgoIds.has(pat.visualizerId)) {
          errors.push(`Mind Map Pattern "${pat.id}" references unregistered visualizerId: "${pat.visualizerId}".`);
        }
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    metrics: {
      totalProblems: PROBLEMS.length,
      totalVisualizers: VISUALIZER_MAPPINGS.length,
      totalLessons: LESSONS.length,
      totalSyllabusTopics: totalTopics,
      totalGraphNodes: GRAPH_NODES.length + allLpuNodes.length,
    },
  };
}
