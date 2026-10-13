import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

// Integrated AlgoNerve modules
import { HomePage as AlgoNerveHomePage } from './algonerve/pages/HomePage';
import { VisualizerPage as AlgoNerveVisualizerPage } from './algonerve/pages/VisualizerPage';
import { DocumentationPage as AlgoNerveDocPage } from './algonerve/pages/DocumentationPage';
import { InteractiveConsole } from './algonerve/controls/InteractiveConsole';

export const App: React.FC = () => {
  const location = useLocation();

  // Full-screen focused mode for algorithm visualizer player
  const isFullScreenVisualizer = location.pathname.startsWith('/visualize/') && location.pathname !== '/visualize';

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

          {/* AlgoNerve Integrated Routes */}
          <Route path="/visualize" element={<AlgoNerveHomePage />} />
          <Route path="/visualize/:id" element={<AlgoNerveVisualizerPage />} />
          <Route path="/documentation" element={<AlgoNerveDocPage />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Interactive Global Algo Console Modal */}
      <InteractiveConsole />

      {/* Global Footer (hidden only on full-screen visualizer player) */}
      {!isFullScreenVisualizer && <Footer />}
    </div>
  );
};
