import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Code2, 
  Search, 
  Compass, 
  FileText, 
  Layers, 
  Award,
  ListChecks,
  BookMarked,
  BookOpen
} from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { 
  SUBJECTS, 
  getSubjectById, 
  LPU_CHECKLIST_DATA,
} from '../data/syllabus';
import { VISUALIZER_MAPPINGS, getAlgoNerveUrl } from '../data/visualizers';
import { PROBLEMS, isProblemInTrack } from '../data/problems';
import { useUserStore } from '../store/userStore';
import { ProblemModal } from '../components/problems/ProblemModal';
import type { Problem } from '../types';

export const SyllabusPage: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<'cse202' | 'cse205'>('cse202');
  const [viewMode, setViewMode] = useState<'units' | 'checklist'>('units');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<number | 'all'>('all');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  // Expanded state for units accordion
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  const { completedLessons, markLessonComplete, problemProgress } = useUserStore();

  const currentSubject = getSubjectById(selectedSubjectId) || SUBJECTS[0];

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  // Filter checklist items for the selected subject
  const subjectChecklist = useMemo(() => {
    const targetCode = selectedSubjectId === 'cse202' ? 'CSE202' : 'CSE205';
    return LPU_CHECKLIST_DATA.filter((item) => {
      if (item.subjectCode !== targetCode) return false;
      if (selectedUnitFilter !== 'all' && item.unitNumber !== selectedUnitFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.subtopic.toLowerCase().includes(query) ||
          item.topicGroup.toLowerCase().includes(query) ||
          item.unitTitle.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedSubjectId, selectedUnitFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* University Header Hero */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <GraduationCap className="h-4 w-4" />
              <span>Official Academic Syllabus &bull; LPU School of Computer Science & Engineering</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex flex-wrap items-center gap-3">
              <span>Dedicated Syllabus & Topic Checklist</span>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Curriculum Aligned
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Official university curriculum for <strong className="text-white">CSE202 (Object Oriented Programming in C++)</strong> and <strong className="text-white">CSE205 (Data Structures & Algorithms)</strong>. Complete with course outcomes (CO1–CO6), textbooks, reference manuals, practical experiments, and unit-by-unit topic coverage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/roadmap"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition shadow-sm"
            >
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>Academic Roadmap Flowchart</span>
            </Link>
            <Link
              to="/problems"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 transition"
            >
              <Terminal className="h-4 w-4" />
              <span>University Problem Sets</span>
            </Link>
          </div>
        </div>

        {/* Subject Stats Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xl font-bold text-white">6 Units</div>
            <div className="text-xs text-slate-400">Total Academic Units</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xl font-bold text-emerald-400">
              {selectedSubjectId === 'cse202' ? '68 Subtopics' : '46 Subtopics'}
            </div>
            <div className="text-xs text-slate-400">Official Checklist Items</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xl font-bold text-indigo-400">4 Credits</div>
            <div className="text-xs text-slate-400">L: 3 &bull; T: 0 &bull; P: 2</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xl font-bold text-amber-400">6 Outcomes</div>
            <div className="text-xs text-slate-400">CO1 to CO6 Evaluated</div>
          </div>
        </div>
      </div>

      {/* Main Subject Switcher & View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        {/* Subject Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id as 'cse202' | 'cse205');
                setSelectedUnitFilter('all');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                selectedSubjectId === sub.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>{sub.code}: {sub.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-emerald-200">
                Sem {sub.semester}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Units Accordion vs Full Checklist Table */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('units')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'units'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Unit Deep Dive</span>
          </button>
          <button
            onClick={() => setViewMode('checklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'checklist'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListChecks className="h-3.5 w-3.5" />
            <span>Full Checklist Table ({selectedSubjectId === 'cse202' ? 68 : 46})</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: UNIT ACCORDION & DEEP DIVE */}
      {viewMode === 'units' && (
        <div className="space-y-6">
          {/* Course Details Collapsible Grid: Outcomes, Textbooks, Practicals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Course Outcomes */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Course Outcomes (CO1 - CO6)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
                {currentSubject.courseOutcomes?.map((co, idx) => (
                  <li key={idx} className="pt-2 first:pt-0 leading-relaxed flex items-start gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{co}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Textbooks & References */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <BookMarked className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Textbooks & References</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] font-bold uppercase text-brand-600 dark:text-brand-400 mb-1.5">Prescribed Textbook:</div>
                  {currentSubject.textbooks?.map((tb, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-200">
                      📖 {tb}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Reference Books:</div>
                  <div className="space-y-1.5">
                    {currentSubject.references?.map((ref, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
                        📚 {ref}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Experiments */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Lab / Practical Experiments ({currentSubject.practicals?.length || 0})</span>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {currentSubject.practicals?.map((exp, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">#{idx + 1}</span>
                    <span className="leading-snug">{typeof exp === 'string' ? exp : exp.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unit-by-Unit Accordion */}
          <div className="space-y-4">
            {currentSubject.units.map((unit) => {
              const isExpanded = !!expandedUnits[unit.id];
              return (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden transition-all"
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
                          p.topicTags.includes(topic.id) || (isProblemInTrack(p, 'lpu') && p.topicTags.some((t) => topic.id.includes(t)))
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

                                {/* Subtopics Checklist Box */}
                                {topic.subtopics && topic.subtopics.length > 0 && (
                                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 space-y-1.5">
                                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                      <FileText className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                      <span>Official Syllabus Subtopics ({topic.subtopics.length}):</span>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                                      {topic.subtopics.map((st, sIdx) => (
                                        <li key={sIdx} className="flex items-start gap-1.5">
                                          <span className="text-emerald-500 text-xs mt-0.5">&bull;</span>
                                          <span className="text-[11.5px] leading-snug">{st}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Visualizer, Lesson & Problem Badges */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                              {(() => {
                                const topicLesson = LESSONS.find((l) => l.topicIds.includes(topic.id));
                                const lessonTargetUrl = topicLesson ? `/lesson/${topicLesson.id}` : `/lesson/${topic.id}`;
                                return (
                                  <Link
                                    to={lessonTargetUrl}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition shadow-sm"
                                    title={topicLesson ? `Read interactive lesson: ${topicLesson.title}` : `Open curriculum guide for ${topic.title}`}
                                  >
                                    <BookOpen className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
                                    <span>Lesson</span>
                                  </Link>
                                );
                              })()}
                              {matchedVis && (
                                <a
                                  href={getAlgoNerveUrl(matchedVis.algorithmId)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition shadow-sm"
                                  title={`Open ${matchedVis.label} on AlgoNerve`}
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
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
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                                      isSolved
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
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

      {/* VIEW MODE 2: INTERACTIVE CHECKLIST TABLE */}
      {viewMode === 'checklist' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subtopics, units, or topic groups..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Unit Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold pr-1">Unit:</span>
              <button
                onClick={() => setSelectedUnitFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                  selectedUnitFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All (1–6)
              </button>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedUnitFilter(num)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition text-xs ${
                    selectedUnitFilter === num
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Unit {num}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm dark:shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">S.No</th>
                    <th className="py-3 px-4 w-24">Unit</th>
                    <th className="py-3 px-4 w-52">Topic Group</th>
                    <th className="py-3 px-4">Subtopic / Syllabus Concept</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {subjectChecklist.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                        No checklist topics found matching your search.
                      </td>
                    </tr>
                  ) : (
                    subjectChecklist.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-400 text-center">
                          {item.sno || idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          Unit {item.unitNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {item.topicGroup}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                          {item.subtopic}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
