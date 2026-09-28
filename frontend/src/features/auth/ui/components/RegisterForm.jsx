import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../../../shared/context/ToastContext";
import { FieldError, AlertBanner } from "../../../../shared/components/ErrorMessage";
import { User, Mail, Lock, CheckCircle2, Loader2, Store, ShoppingBag } from "lucide-react";

export const RegisterForm = () => {
  const { register: registerAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const selectedRole = watch("role");
  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await registerAuth(data);
      addToast({
        message: "Account created successfully! Please sign in.",
        type: "success",
      });
      navigate("/login");
    } catch (err) {
      const responseData = err.response?.data;
      const msg = responseData?.message || "Registration failed";
      setServerError({
        message: msg,
        errors: Array.isArray(responseData?.errors) ? responseData.errors : [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AlertBanner message={serverError?.message} errors={serverError?.errors} />

      {/* Role Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              selectedRole === "user"
                ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/20"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            }`}
          >
            <input
              type="radio"
              value="user"
              {...register("role")}
              className="sr-only"
            />
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold leading-none">Customer</p>
              <p className="text-[11px] text-slate-500 mt-1">Browse & buy</p>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              selectedRole === "seller"
                ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/20"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            }`}
          >
            <input
              type="radio"
              value="seller"
              {...register("role")}
              className="sr-only"
            />
            <Store className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold leading-none">Seller</p>
              <p className="text-[11px] text-slate-500 mt-1">Manage products</p>
            </div>
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="John Doe"
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be between 2 and 50 characters",
              },
              maxLength: {
                value: 50,
                message: "Name must be less than 50 characters",
              },
            })}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
              errors.name
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            }`}
          />
        </div>
        <FieldError error={errors.name} />
      </div>

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
            placeholder="Min 8 chars, 1 upper, 1 lower, 1 num, 1 symbol"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                message:
                  "Password must contain uppercase, lowercase, number, and special character",
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

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <input
            type="password"
            placeholder="Re-enter your password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === passwordValue || "Passwords do not match",
            })}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
              errors.confirmPassword
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            }`}
          />
        </div>
        <FieldError error={errors.confirmPassword} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-3 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
