'use client';

import React from 'react';
import { useNavigate } from '../../lib/router';
import { 
  Globe, 
  GraduationCap, 
  Code2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  X, 
  Compass 
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface TrackSelectionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const TrackSelectionModal: React.FC<TrackSelectionModalProps> = ({ 
  isOpen: propIsOpen, 
  onClose: propOnClose 
}) => {
  const navigate = useNavigate();
  const { 
    hasChosenTrack, 
    showTrackModal, 
    chooseTrack, 
    closeTrackModal,
    activePortal
  } = useUserStore();

  // Show if prop is passed or if user hasn't chosen track or explicitly requested modal
  const isVisible = propIsOpen !== undefined ? propIsOpen : (!hasChosenTrack || showTrackModal);

  if (!isVisible) return null;

  const handleSelect = (track: 'global' | 'lpu') => {
    chooseTrack(track);
    if (propOnClose) propOnClose();
    else closeTrackModal();

    if (track === 'global') {
      navigate('/roadmap');
    } else {
      navigate('/lpu');
    }
  };

  const handleClose = () => {
    if (propOnClose) propOnClose();
    else closeTrackModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={hasChosenTrack ? handleClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-[#07090f] p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
        {/* Close Button if already chosen before */}
        {hasChosenTrack && (
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
            <span>Welcome to CodeNerve</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Choose Your Learning Journey
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Select your track to tailor your roadmap, coding problems, and curriculum. You can switch tracks anytime from the top navigation bar.
          </p>
        </div>

        {/* 2 Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Global DSA Track (Language Agnostic) */}
          <div
            onClick={() => handleSelect('global')}
            className={`group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
              activePortal === 'global' && hasChosenTrack
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 shadow-md ring-1 ring-brand-500/50'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:border-brand-400 dark:hover:border-brand-500/60 hover:shadow-lg'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm">
                  <Globe className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 uppercase tracking-wider">
                  Generic &bull; Any Language
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition flex items-center gap-2">
                  <span>Global DSA Track</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Universal, language-agnostic Data Structures & Algorithms path. Solve problems in <strong>Python, Java, C++, JavaScript, Go</strong>, or any language of your choice.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span>18-Node interactive flowchart with prerequisite hover tracing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span>Curated LeetCode & GFG interview problems (Python, Java, C++, JS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span>Step-by-step AlgoNerve algorithmic animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span>Tailored for competitive coders & technical interview preparation</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('global');
              }}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition flex items-center justify-center gap-2"
            >
              <Compass className="h-4 w-4" />
              <span>Launch Global DSA Track</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Option 2: LPU Academic Portal (C++ Oriented) */}
          <div
            onClick={() => handleSelect('lpu')}
            className={`group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
              activePortal === 'lpu' && hasChosenTrack
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/50'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:shadow-lg'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 uppercase tracking-wider">
                  LPU CSE &bull; C++ Dedicated
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition flex items-center gap-2">
                  <span>LPU Academic Portal</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Dedicated university curriculum tailored for Lovely Professional University. Fully structured in <strong>modern C++ (CSE202 OOP & CSE205 Data Structures)</strong>.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Official LPU B.Tech CSE unit-by-unit syllabus breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Deep C++ focus: pointers, dynamic memory, classes & STL containers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Comprehensive Topic Checklist: all units from official CSE202 & CSE205 syllabi</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Interactive academic prerequisite flowchart & problem tracking</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('lpu');
              }}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2"
            >
              <Code2 className="h-4 w-4" />
              <span>Launch LPU C++ Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-center">
          <p className="text-xs text-slate-500">
            You can effortlessly toggle between <strong>Global DSA</strong> and <strong>LPU Portal</strong> anytime using the switcher in the header.
          </p>
        </div>
      </div>
    </div>
  );
};
