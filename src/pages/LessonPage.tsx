import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { LESSONS, getLessonById } from '../data/lessons';
import { PROBLEMS } from '../data/problems';
import { useUserStore } from '../store/userStore';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = getLessonById(lessonId || '') || LESSONS[0];
  const { completedLessons, markLessonComplete } = useUserStore();

  const isCompleted = completedLessons.includes(lesson.id);

  const relatedProblems = lesson.relatedProblemIds
    .map((id) => PROBLEMS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/university"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Syllabus & Roadmaps</span>
      </Link>

      {/* Lesson Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Interactive Lesson
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lesson.title}
            </h1>
          </div>

          <button
            onClick={() => markLessonComplete(lesson.id, !isCompleted)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>

        {/* Complexity and Prereqs */}
        {lesson.complexity && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              ⏱ Time: <strong className="text-white">{lesson.complexity.time}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              💾 Space: <strong className="text-white">{lesson.complexity.space}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Learning Objectives */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Learning Objectives
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand-400 font-bold mt-0.5">•</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lesson Body Content */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Core Concepts & Intuition
        </h3>
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {lesson.content}
        </div>
      </div>

      {/* AlgoNerve Visualizer Banner */}
      {lesson.relatedVisualizerId && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/60 via-indigo-950/40 to-slate-900 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive AlgoNerve Module</span>
            </span>
            <h4 className="text-lg font-bold text-white">Watch this algorithm in action</h4>
            <p className="text-xs text-slate-400">
              Step through execution with real-time stack traces, pointers, and visual arrays.
            </p>
          </div>
          <Link
            to={`/visualize/${lesson.relatedVisualizerId}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition shrink-0"
          >
            <span>Launch Visualizer</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Code Examples */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Code Implementations</h3>
        {lesson.codeExamples.map((ex, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">{ex.title}</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {ex.language}
              </span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{ex.code}</code>
            </pre>
            {ex.explanation && (
              <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400">
                💡 {ex.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Related Problems */}
      {relatedProblems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Practice Problems for this Topic</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedProblems.map((prob) => prob && (
              <a
                key={prob.id}
                href={prob.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{prob.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {prob.platform} &bull; {prob.difficulty}
                  </div>
                </div>
                <Terminal className="h-4 w-4 text-emerald-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
