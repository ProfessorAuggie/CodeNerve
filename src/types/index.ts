// ───── Core Types ─────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ProblemStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED' | 'REVISION_NEEDED';

export type Platform = 'leetcode' | 'geeksforgeeks' | 'codechef' | 'codeforces' | 'hackerrank' | 'hackerearth';

export type UserRole = 'student' | 'teacher' | 'admin';

// ───── University Hierarchy ─────

export interface University {
  id: string;
  name: string;
  shortName: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  universityId: string;
  semester: number;
  description: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  subjectId: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  unitId: string;
  description: string;
  prerequisites: string[];
  order: number;
  lessonId?: string;
  visualizerId?: string;
  problemIds: string[];
}

// ───── Lessons ─────

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  objectives: string[];
  prerequisites: string[];
  content: string; // Markdown content
  codeExamples: CodeExample[];
  complexity?: { time: string; space: string };
  relatedVisualizerId?: string;
  relatedProblemIds: string[];
  topicIds: string[];
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation?: string;
}

// ───── Problems ─────

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  platform: Platform;
  externalUrl: string;
  difficulty: Difficulty;
  topicTags: string[];
  track?: 'global' | 'lpu';
  problemType?: string;
  estimatedTime?: number; // minutes
  prerequisites: string[];
  isActive: boolean;
  lastVerified?: string;
  sourceAttribution?: string;
  learningPathIds: string[];
  syllabusUnitIds: string[];
}

// ───── Problem Progress ─────

export interface ProblemProgress {
  problemId: string;
  status: ProblemStatus;
  firstAttempted?: string;
  solvedAt?: string;
  lastUpdated: string;
  notes?: string;
  submissionUrl?: string;
}

// ───── Learning Paths ─────

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'dsa_roadmap' | 'cpp_path' | 'interview_prep' | 'university';
  groups: LearningPathGroup[];
}

export interface LearningPathGroup {
  id: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  prerequisites: string[]; // other group IDs
  items: LearningPathItem[];
}

export interface LearningPathItem {
  id: string;
  type: 'lesson' | 'problem' | 'visualization' | 'quiz';
  referenceId: string;
  order: number;
  isRequired: boolean;
}

// ───── Quizzes ─────

export interface Quiz {
  id: string;
  title: string;
  topicId: string;
  questions: QuizQuestion[];
  timeLimit?: number; // minutes
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'short_answer' | 'code_trace';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: Difficulty;
  codeSnippet?: string;
}

// ───── Algorithm Visualizer Mapping ─────

export interface VisualizerMapping {
  id: string;
  algorithmId: string; // AlgoNerve algorithm ID
  topicIds: string[];
  label: string;
  description: string;
}
