import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LessonPage } from '../pages/LessonPage';
import { LESSONS, getLessonById } from '../data/lessons';
import { useUserStore } from '../store/userStore';

describe('LessonPage Component & Curriculum State Handling', () => {
  beforeEach(() => {
    useUserStore.getState().resetProgress();
  });

  const renderWithRoute = (initialPath: string) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders authored lesson content with full sections for a valid authored lesson', () => {
    const authoredLesson = LESSONS[0];
    renderWithRoute(`/lesson/${authoredLesson.id}`);

    // Main header title matches lesson title
    expect(screen.getByRole('heading', { level: 1, name: authoredLesson.title })).toBeInTheDocument();
    
    // Learning objectives are displayed
    expect(screen.getByText('Learning Objectives')).toBeInTheDocument();
    authoredLesson.objectives.forEach((obj) => {
      expect(screen.getByText(obj)).toBeInTheDocument();
    });

    // Core concepts header is present
    expect(screen.getByText('Core Concepts & Intuition')).toBeInTheDocument();

    // Code implementations header is present
    expect(screen.getByText('Code Implementations')).toBeInTheDocument();

    // Mark as complete button is present
    expect(screen.getByRole('button', { name: /Mark as Complete/i })).toBeInTheDocument();
  });

  it('renders curriculum development banner when topic exists in syllabus but lesson is unauthored', () => {
    // cse205-u1-t3 is a valid syllabus topic without an authored lesson markdown
    renderWithRoute('/lesson/cse205-u1-t3');

    expect(screen.getByText('Curriculum In Progress')).toBeInTheDocument();
    expect(screen.getByText(/This interactive lesson is currently under active curriculum development/i)).toBeInTheDocument();
    expect(screen.getByText('Foundational Prerequisites')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse Full Syllabus/i })).toBeInTheDocument();
  });

  it('renders 404 Lesson Not Found card when an unrecognized identifier is requested', () => {
    renderWithRoute('/lesson/nonexistent-invalid-lesson-999');

    expect(screen.getByRole('heading', { level: 1, name: 'Lesson Not Found' })).toBeInTheDocument();
    expect(screen.getByText('nonexistent-invalid-lesson-999')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /University Syllabus/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /DSA Roadmap/i })).toBeInTheDocument();
  });

  it('handles lesson completion toggling in the user store', () => {
    const lessonId = 'lesson-cpp-classes';
    const store = useUserStore.getState();

    expect(store.completedLessons).not.toContain(lessonId);
    store.markLessonComplete(lessonId, true);
    expect(useUserStore.getState().completedLessons).toContain(lessonId);
    store.markLessonComplete(lessonId, false);
    expect(useUserStore.getState().completedLessons).not.toContain(lessonId);
  });

  it('retrieves authored lesson by canonical ID', () => {
    const lesson = getLessonById('lesson-cpp-classes');
    expect(lesson).toBeDefined();
    expect(lesson?.title).toBe('Classes and Objects in C++');
  });
});
