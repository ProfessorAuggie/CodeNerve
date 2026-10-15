// ───── Core Types ─────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ProblemStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED' | 'REVISION_NEEDED';

export type Platform = 'leetcode' | 'geeksforgeeks' | 'codechef' | 'codeforces' | 'hackerrank' | 'hackerearth';

export type UserRole = 'student' | 'teacher' | 'admin';

export type ApprovalStatus = 'approved' | 'pending' | 'disapproved';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  semester: number;
  avatar?: string;
  registrationNumber?: string;
  batch?: string;
  track?: 'global' | 'lpu';
  approvalStatus?: ApprovalStatus;
}

// ───── University Hierarchy ─────

export interface University {
  id: string;
  name: string;
  shortName: string;
}

export interface PracticalExperiment {
  title: string;
  description: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  universityId: string;
  semester: number;
  credits?: { lecture: number; tutorial: number; practical: number; total: number };
  description: string;
  courseOutcomes?: string[];
  textbooks?: string[];
  references?: string[];
  practicals?: PracticalExperiment[];
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
  subtopics?: string[];
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

// ───── Admin & Student Monitoring Types ─────

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  avatar?: string;
  university?: string;
  semester?: number;
  track: 'global' | 'lpu';
  batch: string; // e.g. "LPU B.Tech CSE (CSE205)", "Global DSA Cohort"
  joinedAt: string;
  status: 'online' | 'idle' | 'offline';
  currentActivity: string; // e.g. "Solving: Two Sum (Hash Map)", "Attempting: CSE205 Midterm Test"
  lastActive: string;
  solvedProblemIds: string[];
  totalSolved: number;
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  assignedTestSubmissions?: Record<string, { score: number; total: number; submittedAt: string }>;
  approvalStatus?: ApprovalStatus;
}

export interface AssignedTest {
  id: string;
  title: string;
  description: string;
  targetTrack: 'all' | 'global' | 'lpu';
  targetBatch: string;
  subjectCode?: string;
  problemIds: string[];
  durationMinutes: number;
  totalMarks: number;
  dueDate: string;
  createdAt: string;
  createdBy: string;
  submissionsCount: number;
  totalAssignedCount: number;
}
