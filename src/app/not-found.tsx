import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 px-4 text-center font-sans">
      <h1 className="text-4xl font-serif font-bold text-[#020618] mb-2">Page Not Found</h1>
      <p className="text-slate-600 text-sm mb-6 max-w-md">
        The requested page or article could not be found.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
