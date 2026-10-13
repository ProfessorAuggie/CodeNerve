import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Clock
} from 'lucide-react';
import { QUIZZES, getQuizById } from '../data/quizzes';
import { useUserStore } from '../store/userStore';

export const QuizPage: React.FC = () => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(QUIZZES[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { saveQuizResult, quizScores } = useUserStore();
  const currentQuiz = getQuizById(selectedQuizId) || QUIZZES[0];
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleFinishQuiz = () => {
    setIsSubmitted(true);
    // calculate score
    let score = 0;
    currentQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    saveQuizResult(currentQuiz.id, score, currentQuiz.questions.length);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  // Calculate score if submitted
  let currentScore = 0;
  if (isSubmitted) {
    currentQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) currentScore++;
    });
  }

  const pastScore = quizScores[currentQuiz.id];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Quiz Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Interactive Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Knowledge Verification Quizzes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test your algorithmic reasoning, C++ semantics, and complexity analysis.
          </p>
        </div>

        {/* Quiz Selector */}
        <div className="flex items-center gap-2">
          {QUIZZES.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setSelectedQuizId(q.id);
                handleResetQuiz();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                selectedQuizId === q.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {q.title.split(' ')[0]} Quiz
            </button>
          ))}
        </div>
      </div>

      {/* Past Score Banner */}
      {pastScore && !isSubmitted && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Previous score: <strong className="text-white">{pastScore.score} / {pastScore.total}</strong></span>
          </div>
          <span className="text-slate-500">Taken {new Date(pastScore.date).toLocaleDateString()}</span>
        </div>
      )}

      {/* Quiz Runner */}
      {!isSubmitted ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-6">
          {/* Progress and Question Counter */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
            <span className="font-semibold text-white">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>{currentQuiz.timeLimit} mins limit</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Code Snippet if present */}
            {currentQuestion.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* Options List */}
            {currentQuestion.options && (
              <div className="space-y-2 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQuestion.id, opt)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-purple-400 bg-purple-500' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
            >
              Previous
            </button>

            {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(currentQuiz.questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition"
              >
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Summary Screen */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl space-y-8">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mx-auto">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-brand-400">
              {currentScore} / {currentQuiz.questions.length} Correct
            </div>
            <p className="text-xs text-slate-400">
              {Math.round((currentScore / currentQuiz.questions.length) * 100)}% Mastery Score
            </p>
          </div>

          {/* Breakdown per question */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Review Answers</h4>
            {currentQuiz.questions.map((q, idx) => {
              const studentAnswer = selectedAnswers[q.id];
              const isCorrect = studentAnswer === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-900/40'
                      : 'bg-rose-950/20 border-rose-900/40'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        Your answer: <span className={isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>{studentAnswer || 'Not answered'}</span>
                      </div>
                      {!isCorrect && (
                        <div className="text-xs text-emerald-400 mt-0.5">
                          Correct answer: <span className="font-semibold">{q.correctAnswer}</span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        💡 {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
