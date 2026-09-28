import { Link } from "react-router";
import LoginForm from "../components/LoginForm";
import { ShoppingBag } from "lucide-react";

export const Login = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-purple-500/5 transition-colors">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 items-center justify-center text-white mb-4 shadow-lg shadow-purple-600/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign in to access your products and orders
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-500 transition">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
