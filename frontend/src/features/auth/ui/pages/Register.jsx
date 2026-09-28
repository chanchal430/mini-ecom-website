import { Link } from "react-router";
import RegisterForm from "../components/RegisterForm";
import { Sparkles } from "lucide-react";

export const Register = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-purple-500/5 transition-colors">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 items-center justify-center text-white mb-4 shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose Customer or Seller mode to get started
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
