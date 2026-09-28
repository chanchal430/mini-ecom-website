import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        The page or resource you are looking for might have been moved or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition hover:bg-purple-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
