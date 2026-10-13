import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { RouteLoadingFallback } from './components/common/RouteLoadingFallback';

// CodeNerve route-level code splitting
const HomePage = React.lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const RoadmapPage = React.lazy(() => import('./pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage })));
const ProblemsPage = React.lazy(() => import('./pages/ProblemsPage').then((m) => ({ default: m.ProblemsPage })));
const LpuPortalPage = React.lazy(() => import('./pages/LpuPortalPage').then((m) => ({ default: m.LpuPortalPage })));
const LessonPage = React.lazy(() => import('./pages/LessonPage').then((m) => ({ default: m.LessonPage })));
const QuizPage = React.lazy(() => import('./pages/QuizPage').then((m) => ({ default: m.QuizPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const TeacherPage = React.lazy(() => import('./pages/TeacherPage').then((m) => ({ default: m.TeacherPage })));

// External AlgoNerve Redirect component
const AlgoNerveRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const targetUrl = id ? `https://algonerve.vercel.app/visualize/${id}` : 'https://algonerve.vercel.app';

  useEffect(() => {
    window.location.href = targetUrl;
  }, [targetUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      <h2 className="text-lg font-bold text-white">Opening AlgoNerve Visualizer...</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        Redirecting to the official AlgoNerve interactive algorithm player at <code className="text-brand-300">{targetUrl}</code>.
      </p>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition mt-2"
      >
        Open in New Tab Now ↗
      </a>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200">
      {/* Top Navbar with Single-Source-of-Truth Portal Switcher */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <ErrorBoundary sectionName="Page View">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Main Landing Page */}
              <Route path="/" element={<HomePage />} />

              {/* Roadmaps */}
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/roadmap/:pathId" element={<RoadmapPage />} />

              {/* Problem Catalogue */}
              <Route path="/problems" element={<ProblemsPage />} />

              {/* Academic LPU University Portal */}
              <Route path="/university" element={<LpuPortalPage />} />
              <Route path="/lpu" element={<LpuPortalPage />} />

              {/* Interactive Lesson Views */}
              <Route path="/lesson/:lessonId" element={<LessonPage />} />

              {/* Assessment Quizzes */}
              <Route path="/quizzes" element={<QuizPage />} />

              {/* Student Analytics & Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Teacher Assignment Portal */}
              <Route path="/teacher" element={<TeacherPage />} />

              {/* AlgoNerve Redirect Routes */}
              <Route path="/visualize" element={<AlgoNerveRedirect />} />
              <Route path="/visualize/:id" element={<AlgoNerveRedirect />} />
              <Route path="/documentation" element={<AlgoNerveRedirect />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
