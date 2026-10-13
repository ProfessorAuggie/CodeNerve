import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDifficulty(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return difficulty;
  }
}

export function getDifficultyColor(difficulty: string): { bg: string; text: string; border: string } {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'medium':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'hard':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
  }
}

export function getStatusBadge(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case 'SOLVED':
      return { label: 'Solved', bg: 'bg-emerald-500/15', text: 'text-emerald-400' };
    case 'ATTEMPTED':
      return { label: 'Attempted', bg: 'bg-amber-500/15', text: 'text-amber-400' };
    case 'REVISION_NEEDED':
      return { label: 'Revise', bg: 'bg-purple-500/15', text: 'text-purple-400' };
    default:
      return { label: 'Todo', bg: 'bg-slate-800', text: 'text-slate-400' };
  }
}
