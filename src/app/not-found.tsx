import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Page Not Found</h1>
      <p className="text-slate-400 max-w-md mb-6 text-xs sm:text-sm">
        The requested roadmap, problem, or portal view could not be located.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-lg shadow-brand-500/20"
      >
        Return to CodeNerve Home
      </Link>
    </div>
  );
}
