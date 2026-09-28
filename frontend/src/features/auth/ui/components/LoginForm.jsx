import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../../../shared/context/ToastContext";
import { FieldError, AlertBanner } from "../../../../shared/components/ErrorMessage";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export const LoginForm = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const res = await login(data);
      const user = res?.data?.user;
      addToast({
        message: `Welcome back, ${user?.name || "User"}!`,
        type: "success",
      });

      // Role-based routing
      if (user?.role === "seller") {
        navigate("/seller", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      const responseData = err.response?.data;
      const msg = responseData?.message || "Invalid Email or Password";
      setServerError({
        message: msg,
        errors: Array.isArray(responseData?.errors) ? responseData.errors : [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AlertBanner message={serverError?.message} errors={serverError?.errors} />

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Please enter a valid email address",
              },
            })}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
              errors.email
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            }`}
          />
        </div>
        <FieldError error={errors.email} />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
              errors.password
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            }`}
          />
        </div>
        <FieldError error={errors.password} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
