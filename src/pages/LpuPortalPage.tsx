import React, { useState, useEffect } from 'react';
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
  Users, 
  Compass 
} from 'lucide-react';
import { SUBJECTS, getSubjectById } from '../data/syllabus';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../data/visualizers';
import { PROBLEMS } from '../data/problems';
import { useUserStore } from '../store/userStore';
import { ProblemModal } from '../components/problems/ProblemModal';
import { LpuAcademicGraph } from '../components/roadmap/LpuAcademicGraph';
import { DsaMindMapGraph } from '../components/roadmap/DsaMindMapGraph';
import type { Problem } from '../types';

export const LpuPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mindmap' | 'syllabus' | 'flowchart' | 'assignments'>('mindmap');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cse205');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'cse205-u1': true,
    'cse202-u1': true,
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const { completedLessons, markLessonComplete, problemProgress, customProblemSets, updateStudentActivity } = useUserStore();
  const currentSubject = getSubjectById(selectedSubjectId) || SUBJECTS[0];

  useEffect(() => {
    updateStudentActivity(`Studying LPU Academic Portal · ${currentSubject.code.toUpperCase()}`);
  }, [currentSubject.code, updateStudentActivity]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* University Hero Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <GraduationCap className="h-4 w-4" />
              <span>Lovely Professional University &bull; School of Computer Science & Engineering</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              LPU B.Tech CSE Academic Portal
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              University-aligned study portal with structured syllabi for <strong className="text-white">CSE202</strong> (Object Oriented Programming) and <strong className="text-white">CSE205</strong> (Data Structures & Algorithms), complete with topic prerequisites, 114 curriculum checklist items, and faculty assignments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <Link
              to="/syllabus"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Dedicated Syllabus Page</span>
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
            <div className="text-xl font-bold text-emerald-400">114 Topics</div>
            <div className="text-xs text-slate-400">Official Syllabus Checklist</div>
          </div>
          <div>
            <div className="text-xl font-bold text-brand-400">82 Problems</div>
            <div className="text-xs text-slate-400">Curated C++ Problem Bank</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-400">{customProblemSets.length} Active</div>
            <div className="text-xs text-slate-400">Faculty Problem Sets</div>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <button
          onClick={() => setActiveTab('mindmap')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'mindmap'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4 text-emerald-200" />
          <span>LPU Syllabus Mind Map</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/20 text-white">
            Whimsical
          </span>
        </button>

        <button
          onClick={() => setActiveTab('syllabus')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'syllabus'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Curriculum Syllabi (CSE202 / CSE205)</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300">
            114 Topics
          </span>
        </button>

        <button
          onClick={() => setActiveTab('flowchart')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'flowchart'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Interactive Prerequisite Flowchart</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'assignments'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Faculty & Class Assignments ({customProblemSets.length})</span>
        </button>
      </div>

      {/* TAB -1: WHIMSICAL MIND MAP */}
      {activeTab === 'mindmap' && (
        <div className="space-y-3">
          <DsaMindMapGraph initialVariant="lpu" fitScreen={true} />
        </div>
      )}

      {/* TAB 0: INTERACTIVE PREREQUISITE FLOWCHART */}
      {activeTab === 'flowchart' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-emerald-500/30 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                <strong>LPU Academic Prerequisite Dependency Engine:</strong> Hover over any unit or topic to trace back the exact prerequisite foundations required by LPU examiners before that concept.
              </span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] hidden md:inline font-semibold">
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
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedSubjectId === sub.id
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Code2 className="h-4 w-4" />
                  <span>{sub.code}: {sub.name}</span>
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Semester {currentSubject.semester} &bull; LPU CSE Department
            </span>
          </div>

          {/* Units Accordion */}
          <div className="space-y-4">
            {currentSubject.units.map((unit) => {
              const isExpanded = !!expandedUnits[unit.id];

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden transition hover:border-slate-300 dark:hover:border-slate-700/80"
                >
                  {/* Unit Header */}
                  <button
                    type="button"
                    onClick={() => toggleUnit(unit.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm border border-emerald-500/20 shrink-0">
                        U{unit.number}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Unit {unit.number}: {unit.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {unit.topics.length} Primary Topics &bull; Includes theory, prerequisites, and coding implementations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {unit.topics.length} Topics
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Unit Topics Content */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 sm:px-6 divide-y divide-slate-100 dark:divide-slate-800/60 border-t border-slate-100 dark:border-slate-800/80">
                      {unit.topics.map((topic) => {
                        const isCompleted = completedLessons.includes(topic.id);
                        const matchedVis = VISUALIZER_MAPPINGS.find((v) =>
                          v.id.includes(topic.id) || topic.id.includes(v.id)
                        );
                        const topicProblems = PROBLEMS.filter((p) =>
                          p.topicTags.includes(topic.id) || (p.track === 'lpu' && p.topicTags.some((t) => topic.id.includes(t)))
                        ).slice(0, 3);

                        return (
                          <div
                            key={topic.id}
                            className="py-4 first:pt-3 last:pb-1 flex flex-col lg:flex-row lg:items-start justify-between gap-4"
                          >
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                              <button
                                type="button"
                                onClick={() => markLessonComplete(topic.id)}
                                className={`mt-0.5 min-w-[28px] min-h-[28px] rounded-lg border flex items-center justify-center shrink-0 transition ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-500 text-slate-400'
                                }`}
                                title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                                )}
                              </button>

                              <div className="space-y-1.5 flex-1 min-w-0">
                                <h4
                                  className={`text-sm sm:text-base font-bold ${
                                    isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {topic.title}
                                </h4>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                                  {topic.description}
                                </p>

                                {/* Prerequisites Chips */}
                                {topic.prerequisites && topic.prerequisites.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                      Prerequisites:
                                    </span>
                                    {topic.prerequisites.map((prereq, pIdx) => (
                                      <span
                                        key={pIdx}
                                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                                      >
                                        {prereq}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Visualizer & Problem Badges */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                              {matchedVis && (
                                <a
                                  href={getAlgoNerveUrl(matchedVis.algorithmId)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
                                  title={`Open ${matchedVis.label} on AlgoNerve (new tab)`}
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
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
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
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

      {/* TAB 3: FACULTY & CLASS ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Course Faculty Assignments</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Instructor-curated problem sets for lab practicals, homework submissions, and section cohorts.
              </p>
            </div>
            <Link
              to="/syllabus"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transition"
            >
              Explore Topic Checklist ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customProblemSets.map((set) => (
              <div
                key={set.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{set.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{set.description}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
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
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer text-xs transition"
                      >
                        <span className={isSolved ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white font-medium'}>
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
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
};
