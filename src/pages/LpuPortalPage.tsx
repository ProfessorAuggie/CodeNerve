import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Code2, 
  Award, 
  Calendar, 
  Users, 
  Compass 
} from 'lucide-react';
import { SUBJECTS, getSubjectById } from '../data/syllabus';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../data/visualizers';
import { PROBLEMS } from '../data/problems';
import { useUserStore } from '../store/userStore';
import { ProblemModal } from '../components/problems/ProblemModal';
import { LpuAcademicGraph } from '../components/roadmap/LpuAcademicGraph';
import type { Problem } from '../types';

export const LpuPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flowchart' | 'syllabus' | 'exams' | 'assignments'>('flowchart');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cse205');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'cse205-u1': true,
    'cse202-u1': true,
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const { completedLessons, markLessonComplete, problemProgress, customProblemSets } = useUserStore();
  const currentSubject = getSubjectById(selectedSubjectId) || SUBJECTS[0];

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  // Exam Preparation Modules
  const lpuExams = [
    {
      id: 'ca1-prep',
      title: 'Continuous Assessment 1 (CA-1) Review',
      subject: 'CSE205 Data Structures & Algorithms',
      topics: 'Arrays, Big-O Complexity, Bubble & Selection Sort',
      problemCount: 8,
      recommendedProblems: ['p-dsa-array-traversal-1', 'p-dsa-array-insert-1', 'p-dsa-bubble-sort-1', 'p-dsa-linear-search-1'],
    },
    {
      id: 'midterm-prep',
      title: 'Mid-Term Examination Essential Problem Set',
      subject: 'CSE205 & CSE202 Core Foundations',
      topics: 'Linked Lists, Stacks, Queues, Binary Search, C++ Pointers & Classes',
      problemCount: 14,
      recommendedProblems: ['p-dsa-ll-reverse-1', 'p-dsa-stack-valid-parens-1', 'p-dsa-queue-1', 'p-cpp-constructors-1', 'p-cpp-pointers-1'],
    },
    {
      id: 'ca2-prep',
      title: 'Continuous Assessment 2 (CA-2) Review',
      subject: 'CSE202 Object Oriented Programming',
      topics: 'Operator Overloading, Inheritance, Virtual Functions & Polymorphism',
      problemCount: 10,
      recommendedProblems: ['p-cpp-operator-overload-1', 'p-cpp-inheritance-1', 'p-cpp-polymorphism-1', 'p-cpp-virtual-destructor-1'],
    },
    {
      id: 'endterm-prep',
      title: 'End-Term Comprehensive Exam Bank',
      subject: 'All Units (CSE202 + CSE205)',
      topics: 'Trees, BST, Heaps, Graphs (Dijkstra, BFS, DFS), STL & Templates',
      problemCount: 20,
      recommendedProblems: ['p-dsa-tree-traversal-1', 'p-dsa-bst-insert-1', 'p-dsa-heap-kth-1', 'p-dsa-bfs-1', 'p-dsa-dijkstra-1', 'p-cpp-templates-1'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* University Hero Header */}
      <div className="rounded-2xl border border-indigo-900/50 bg-gradient-to-r from-[#0d1226] via-[#121936] to-[#0c0f1d] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <GraduationCap className="h-4 w-4" />
              <span>Lovely Professional University &bull; School of Computer Science & Engineering</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              LPU B.Tech CSE Academic Portal
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              University-aligned study portal with structured syllabi for <strong className="text-white">CSE202</strong> (Object Oriented Programming) and <strong className="text-white">CSE205</strong> (Data Structures & Algorithms), complete with topic prerequisites, exam sets, and faculty assignments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <Link
              to="/roadmap"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Compass className="h-4 w-4 text-brand-400" />
              <span>Switch to Global Track</span>
            </Link>

            <Link
              to="/quizzes"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 transition"
            >
              <Award className="h-4 w-4" />
              <span>Take CA Practice Quiz</span>
            </Link>
          </div>
        </div>

        {/* Portal Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div>
            <div className="text-xl font-bold text-white">12 Units</div>
            <div className="text-xs text-slate-400">Total Syllabus Units</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">38 Topics</div>
            <div className="text-xs text-slate-400">With Prerequisites Listed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-brand-400">4 Exam Hubs</div>
            <div className="text-xs text-slate-400">CA-1, CA-2, Midterm & Endterm</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-400">{customProblemSets.length} Active</div>
            <div className="text-xs text-slate-400">Faculty Problem Sets</div>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-800 pb-2.5">
        <button
          onClick={() => setActiveTab('flowchart')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'flowchart'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Interactive Prerequisite Flowchart</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300">
            Hover Trace
          </span>
        </button>

        <button
          onClick={() => setActiveTab('syllabus')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'syllabus'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Curriculum Syllabi (CSE202 / CSE205)</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'exams'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>CA & University Exam Banks</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'assignments'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Faculty & Class Assignments ({customProblemSets.length})</span>
        </button>
      </div>

      {/* TAB 0: INTERACTIVE PREREQUISITE FLOWCHART */}
      {activeTab === 'flowchart' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-900/40 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>
                <strong>LPU Academic Prerequisite Dependency Engine:</strong> Hover over any unit or topic to trace back the exact prerequisite foundations required by LPU examiners before that concept.
              </span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px] hidden md:inline">
              CSE205 &bull; CSE202 Syllabus
            </span>
          </div>

          <LpuAcademicGraph fitScreen={true} />
        </div>
      )}

      {/* TAB 1: CURRICULUM SYLLABI */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          {/* Subject Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedSubjectId === sub.id
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="h-4 w-4" />
                  <span>{sub.code}: {sub.name}</span>
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Semester {currentSubject.semester} &bull; LPU CSE Department
            </span>
          </div>

          {/* Units Accordion */}
          <div className="space-y-4">
            {currentSubject.units.map((unit) => {
              const isExpanded = !!expandedUnits[unit.id];
              const unitCompletedCount = unit.topics.filter((t) =>
                completedLessons.includes(t.id)
              ).length;

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-md overflow-hidden transition hover:border-slate-700/80"
                >
                  {/* Unit Header */}
                  <div
                    onClick={() => toggleUnit(unit.id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none bg-slate-900/90 hover:bg-slate-850 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-brand-400 font-bold text-sm border border-slate-700/60">
                        U{unit.number}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                          Unit {unit.number}
                        </span>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {unit.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs">
                        <span className="text-slate-400">Mastered: </span>
                        <span className="font-semibold text-white">
                          {unitCompletedCount}/{unit.topics.length}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Topics Breakdown */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 divide-y divide-slate-800/60 bg-slate-950/40">
                      {unit.topics.map((topic) => {
                        const isCompleted = completedLessons.includes(topic.id);
                        const matchedVis = VISUALIZER_MAPPINGS.find((v) =>
                          topic.visualizerId
                            ? v.algorithmId === topic.visualizerId || v.id === topic.visualizerId
                            : v.topicIds.includes(topic.id)
                        );
                        const topicProblems = topic.problemIds
                          .map((id) => PROBLEMS.find((p) => p.id === id))
                          .filter((p): p is Problem => !!p);

                        return (
                          <div
                            key={topic.id}
                            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/40 transition"
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => markLessonComplete(topic.id, !isCompleted)}
                                className={`mt-0.5 h-5 w-5 rounded-md flex items-center justify-center border transition shrink-0 ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                    : 'border-slate-700 bg-slate-800 text-slate-500 hover:border-slate-500'
                                }`}
                                title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                              >
                                {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                              </button>
                              <div>
                                <h4
                                  className={`text-sm font-semibold ${
                                    isCompleted ? 'text-slate-400 line-through' : 'text-white'
                                  }`}
                                >
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                                  {topic.description}
                                </p>

                                {/* Prerequisites Display */}
                                {topic.prerequisites && topic.prerequisites.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                      Prerequisites:
                                    </span>
                                    {topic.prerequisites.map((prereq, pIdx) => (
                                      <span
                                        key={pIdx}
                                        className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                                      >
                                        {prereq}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Visualizer, Lesson, Problems */}
                            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                              {matchedVis && (
                                <a
                                  href={getAlgoNerveUrl(matchedVis.algorithmId)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
                                  title={`Open ${matchedVis.label} on AlgoNerve (new tab)`}
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                                  <span>{matchedVis.label}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}

                              {topicProblems.map((prob) => {
                                const isSolved = problemProgress[prob.id]?.status === 'SOLVED';
                                return (
                                  <button
                                    key={prob.id}
                                    onClick={() => setSelectedProblem(prob)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                      isSolved
                                        ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    <Terminal className="h-3.5 w-3.5" />
                                    <span>{prob.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CA & UNIVERSITY EXAM BANKS */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lpuExams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    LPU Exam Prep
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{exam.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">{exam.subject}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                  {exam.problemCount} Qs
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <strong className="text-slate-200">Syllabus Scope:</strong> {exam.topics}
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold uppercase text-slate-400">
                  Essential Problems for this Exam:
                </span>
                <div className="space-y-1.5">
                  {exam.recommendedProblems.map((pId) => {
                    const prob = PROBLEMS.find((p) => p.id === pId);
                    if (!prob) return null;
                    const isSolved = problemProgress[prob.id]?.status === 'SOLVED';

                    return (
                      <div
                        key={prob.id}
                        onClick={() => setSelectedProblem(prob)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`h-4 w-4 ${isSolved ? 'text-emerald-400' : 'text-slate-600'}`}
                          />
                          <span className={isSolved ? 'line-through text-slate-500' : 'text-white'}>
                            {prob.title}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {prob.difficulty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FACULTY & CLASS ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-purple-950/20 border border-purple-800/40">
            <div>
              <h3 className="text-base font-bold text-white">Course Faculty Assignments</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instructor-curated problem sets for lab practicals, homework submissions, and section cohorts.
              </p>
            </div>
            <Link
              to="/teacher"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition"
            >
              Faculty Assignment Portal ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customProblemSets.map((set) => (
              <div
                key={set.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{set.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{set.description}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    {set.problemIds.length} Problems
                  </span>
                </div>

                <div className="space-y-1.5 pt-2">
                  {set.problemIds.map((pId) => {
                    const prob = PROBLEMS.find((p) => p.id === pId);
                    if (!prob) return null;
                    const isSolved = problemProgress[prob.id]?.status === 'SOLVED';

                    return (
                      <div
                        key={prob.id}
                        onClick={() => setSelectedProblem(prob)}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs"
                      >
                        <span className={isSolved ? 'line-through text-slate-500' : 'text-white'}>
                          {prob.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{prob.difficulty}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};
