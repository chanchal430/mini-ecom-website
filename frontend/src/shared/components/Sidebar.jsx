import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { LayoutDashboard, PlusCircle, ShoppingBag, Store, LogOut, ArrowLeft } from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard Overview",
      to: "/seller",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Add New Product",
      to: "/seller/products/create",
      icon: PlusCircle,
      end: false,
    },
    {
      label: "View Customer Store",
      to: "/products",
      icon: Store,
      end: false,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between p-4  h-screen overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2.5 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base leading-tight text-white">Seller Portal</h2>
            <p className="text-[11px] text-purple-400 font-medium">Merchant Console</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-600/40"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-300 font-bold text-xs">
            {user?.name?.[0]?.toUpperCase() || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
