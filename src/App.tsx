import React, { useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// CodeNerve core pages
import { HomePage } from './pages/HomePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { UniversityPage } from './pages/UniversityPage';
import { LessonPage } from './pages/LessonPage';
import { QuizPage } from './pages/QuizPage';
import { DashboardPage } from './pages/DashboardPage';
import { TeacherPage } from './pages/TeacherPage';

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
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* Roadmaps */}
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmap/:pathId" element={<RoadmapPage />} />

          {/* Problem Catalogue */}
          <Route path="/problems" element={<ProblemsPage />} />

          {/* Academic University Syllabus */}
          <Route path="/university" element={<UniversityPage />} />

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
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
