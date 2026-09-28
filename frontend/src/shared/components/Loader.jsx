import { Loader2 } from "lucide-react";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-purple-600`} />
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="w-full h-52 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mt-3" />
    </div>
  );
};

export const PageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
};

export default Spinner;
