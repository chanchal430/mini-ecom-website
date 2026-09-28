import { useToast } from "../context/ToastContext";
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isComingSoon = toast.type === "coming-soon";
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isComingSoon
                ? "bg-linear-to-r from-purple-900/90 to-indigo-900/90 text-white border-purple-500/50 backdrop-blur"
                : isSuccess
                ? "bg-emerald-900/90 text-emerald-100 border-emerald-500/50 backdrop-blur"
                : isError
                ? "bg-rose-900/90 text-rose-100 border-rose-500/50 backdrop-blur"
                : "bg-slate-900/90 text-slate-100 border-slate-700/50 backdrop-blur"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isComingSoon && <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isComingSoon && !isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400" />}
            </div>
            <div className="flex-1">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 cursor-pointer p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
