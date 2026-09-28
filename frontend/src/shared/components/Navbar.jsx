import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { ShoppingBag, ShoppingCart, User, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const { showComingSoon } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              MiniEcom
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Curated Marketplace
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors hover:text-purple-600 ${
                isActive ? "text-purple-600 font-semibold" : "text-slate-600 dark:text-slate-300"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `transition-colors hover:text-purple-600 ${
                isActive ? "text-purple-600 font-semibold" : "text-slate-600 dark:text-slate-300"
              }`
            }
          >
            Explore Catalog
          </NavLink>
          {isSeller && (
            <Link
              to="/seller"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Seller Portal
            </Link>
          )}
        </nav>

        {/* Right action bar */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (triggers coming soon) */}
          <button
            onClick={() => showComingSoon("Shopping Cart")}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
              0
            </span>
          </button>

          {/* User state */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isSeller && (
                <Link
                  to="/seller/products/create"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-600/30 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Product
                </Link>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 font-semibold text-xs border border-purple-200 dark:border-purple-800">
                    {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 max-w-25 truncate">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-purple-600 font-medium capitalize">
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-600/30 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
