import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Search 
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { PROBLEMS } from '../data/problems';

export const TeacherPage: React.FC = () => {
  const { customProblemSets, addCustomProblemSet, deleteCustomProblemSet } = useUserStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const toggleProblemSelection = (id: string) => {
    setSelectedProblemIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedProblemIds.length === 0) return;

    addCustomProblemSet({
      title,
      description,
      problemIds: selectedProblemIds,
    });

    setTitle('');
    setDescription('');
    setSelectedProblemIds([]);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const filteredProblems = PROBLEMS.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topicTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Mode Header */}
      <div className="rounded-2xl border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Instructor & Curriculum Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curate Problem Sets & Assignments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build custom assignments, homework problem sets, and syllabus bundles for university batches.
          </p>
        </div>
      </div>

      {/* Grid: Create Form on Left, Created Sets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Set Form */}
        <form
          onSubmit={handleCreateSet}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Create New Assignment Set</h2>
            {successMessage && (
              <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
                Assignment created!
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CSE205 Week 3: Linked Lists & Recursion"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mandatory submission for Section K22. Complete before next lab session."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Problems ({selectedProblemIds.length} chosen)
              </label>
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter problems..."
                  className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2 space-y-1">
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblemIds.includes(prob.id);
                return (
                  <div
                    key={prob.id}
                    onClick={() => toggleProblemSelection(prob.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-purple-950/40 text-purple-200 border border-purple-500/40'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${
                          isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                      <span className="font-medium truncate max-w-xs">{prob.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      {prob.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || selectedProblemIds.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create & Publish Assignment Set</span>
          </button>
        </form>

        {/* Existing Sets */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Active Assignment Sets</h2>
            <span className="text-xs text-slate-400">{customProblemSets.length} sets published</span>
          </div>

          <div className="space-y-3">
            {customProblemSets.map((set) => (
              <div
                key={set.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{set.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{set.description}</p>
                  </div>
                  <button
                    onClick={() => deleteCustomProblemSet(set.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                    title="Delete assignment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  {set.problemIds.map((id) => {
                    const prob = PROBLEMS.find((p) => p.id === id);
                    return (
                      <span
                        key={id}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {prob?.title || id}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
