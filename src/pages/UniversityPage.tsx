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
  Code2
} from 'lucide-react';
import { SUBJECTS, getSubjectById } from '../data/syllabus';
import { VISUALIZER_MAPPINGS } from '../data/visualizers';
import { PROBLEMS } from '../data/problems';
import { useUserStore } from '../store/userStore';
import { ProblemModal } from '../components/problems/ProblemModal';
import type { Problem } from '../types';

export const UniversityPage: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cse205');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'cse205-u1': true,
    'cse202-u1': true,
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const { completedLessons, markLessonComplete, problemProgress } = useUserStore();

  const currentSubject = getSubjectById(selectedSubjectId) || SUBJECTS[0];

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Lovely Professional University (LPU)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Syllabus Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Directly mapped to LPU B.Tech Computer Science & Engineering syllabus. Every course unit connects to AlgoNerve visualizers, lessons, and exam practice problems.
          </p>
        </div>

        {/* Subject Switcher Buttons */}
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                selectedSubjectId === sub.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>{sub.code}: {sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subject Description */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
        <div>
          <span className="font-semibold text-white">{currentSubject.code} — {currentSubject.name}</span>
          <span className="text-slate-500 mx-2">|</span>
          <span className="text-slate-400">{currentSubject.description}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-semibold">
          Semester {currentSubject.semester}
        </span>
      </div>

      {/* Units Accordion */}
      <div className="space-y-4">
        {currentSubject.units.map((unit) => {
          const isExpanded = !!expandedUnits[unit.id];

          // Calculate completed topics in unit
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
                      topic.visualizerId ? v.algorithmId === topic.visualizerId || v.id === topic.visualizerId : v.topicIds.includes(topic.id)
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
                            <h4 className={`text-sm font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                              {topic.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                              {topic.description}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons: Visualizer, Lesson, Problems */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                          {matchedVis && (
                            <Link
                              to={`/visualize/${matchedVis.algorithmId}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
                            >
                              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                              <span>{matchedVis.label}</span>
                            </Link>
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

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};
