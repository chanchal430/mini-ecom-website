import { AlertTriangle, AlertCircle } from "lucide-react";

export const FieldError = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{typeof error === "string" ? error : error.message}</span>
    </p>
  );
};

export const AlertBanner = ({ title = "Error", message, errors }) => {
  if (!message && (!errors || errors.length === 0)) return null;

  return (
    <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 text-rose-800 dark:text-rose-200 mb-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <div className="text-sm">
        {title && <h4 className="font-semibold">{title}</h4>}
        {message && <p className="mt-0.5">{message}</p>}
        {Array.isArray(errors) && errors.length > 0 && (
          <ul className="list-disc list-inside mt-2 space-y-0.5 text-xs text-rose-700 dark:text-rose-300">
            {errors.map((err, idx) => (
              <li key={idx}>
                {err.field ? <span className="font-medium capitalize">{err.field}: </span> : null}
                {err.message || err.msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
