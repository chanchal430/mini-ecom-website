import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { Link } from "react-router";
import { User, Mail, Shield, Store, ShoppingBag, LogOut } from "lucide-react";

export const Profile = () => {
  const { user, isSeller, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-purple-500/5 space-y-6">
        {/* Header Avatar */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-purple-600/30">
            {user?.name?.[0]?.toUpperCase() || <User className="w-10 h-10" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-purple-500" />
              {user?.email}
            </p>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 mt-2 border border-purple-200 dark:border-purple-800 capitalize">
              <Shield className="w-3.5 h-3.5" />
              Role: {user?.role || "User"}
            </span>
          </div>
        </div>

        {/* Dashboard Shortcut for Seller */}
        {isSeller ? (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-purple-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Seller Dashboard Access</h4>
                <p className="text-xs text-slate-500">Manage your product listings and inventory</p>
              </div>
            </div>
            <Link
              to="/seller"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-purple-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Customer Account</h4>
              <p className="text-xs text-slate-500">Browse and discover verified products in the marketplace</p>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
