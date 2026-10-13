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
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Compass,
  Construction,
  GraduationCap
} from 'lucide-react';
import { LESSONS, getLessonById } from '../data/lessons';
import { PROBLEMS } from '../data/problems';
import { SUBJECTS } from '../data/syllabus';
import { getAlgoNerveUrl } from '../data/visualizers';
import { useUserStore } from '../store/userStore';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const { completedLessons, markLessonComplete } = useUserStore();

  // Find if requested identifier corresponds to a syllabus topic under development
  const topicContext = React.useMemo(() => {
    if (lesson || !lessonId) return null;
    const cleanId = lessonId.replace(/^lesson-/, '');
    for (const subject of SUBJECTS) {
      for (const unit of subject.units) {
        for (const topic of unit.topics) {
          if (
            topic.id === lessonId || 
            topic.id === cleanId || 
            topic.lessonId === lessonId ||
            topic.lessonId === cleanId
          ) {
            return { subject, unit, topic };
          }
        }
      }
    }
    return null;
  }, [lesson, lessonId]);

  // Case 1: Lesson Under Development (valid syllabus topic, but content unauthored)
  if (!lesson && topicContext) {
    const { subject, unit, topic } = topicContext;
    const topicProblems = (topic.problemIds || [])
      .map((id) => PROBLEMS.find((p) => p.id === id))
      .filter((p): p is typeof PROBLEMS[0] => Boolean(p));

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/university"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Syllabus & Roadmaps</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
            <Construction className="h-3.5 w-3.5" />
            <span>Curriculum In Progress</span>
          </div>
        </div>

        {/* Development Banner Card */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <GraduationCap className="h-4 w-4" />
              <span>{subject.code} &bull; Unit {unit.number}: {unit.title}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {topic.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
              This interactive lesson is currently under active curriculum development by faculty. You can review prerequisites, solve mapped coding problems, and explore interactive algorithm visualizations while full lesson text and code walkthroughs are authored.
            </p>
          </div>

          {/* Prerequisites */}
          {topic.prerequisites && topic.prerequisites.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Foundational Prerequisites
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {topic.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AlgoNerve Visualizer if linked */}
          {topic.visualizerId && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/60 to-slate-900 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AlgoNerve Module Ready</span>
                </span>
                <h4 className="text-base font-bold text-white">Interactive simulation available</h4>
                <p className="text-xs text-slate-400">
                  Step through execution and data transformations in a dedicated visualizer tab.
                </p>
              </div>
              <a
                href={getAlgoNerveUrl(topic.visualizerId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition shrink-0"
              >
                <span>Launch Visualizer ↗</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Mapped Practice Problems */}
          {topicProblems.length > 0 ? (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>Associated Practice Problems ({topicProblems.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topicProblems.map((prob) => (
                  <a
                    key={prob.id}
                    href={prob.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-brand-300 transition">{prob.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {prob.platform} &bull; <span className="capitalize">{prob.difficulty}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-brand-400 transition" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No external problem sets mapped yet for this topic.</p>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <Link
              to="/university"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Browse Full Syllabus</span>
            </Link>
            <Link
              to="/roadmap"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>View DSA Roadmap</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Lesson Not Found (completely invalid ID)
  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Lesson Not Found</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            The requested lesson identifier <code className="text-rose-300 font-mono text-xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{lessonId}</code> does not exist in the curriculum repository.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/university"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-lg shadow-brand-500/20"
          >
            <BookOpen className="h-4 w-4" />
            <span>University Syllabus</span>
          </Link>
          <Link
            to="/roadmap"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
          >
            <Compass className="h-4 w-4" />
            <span>DSA Roadmap</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-medium transition"
          >
            <span>Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Case 3: Valid Lesson Exists
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
          <a
            href={getAlgoNerveUrl(lesson.relatedVisualizerId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition shrink-0"
          >
            <span>Launch in AlgoNerve</span>
            <ExternalLink className="h-4 w-4" />
          </a>
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
