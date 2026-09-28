import { Outlet } from "react-router";
import Navbar from "../shared/components/Navbar";
import ToastContainer from "../shared/components/Toast";

export const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MiniEcom Platform. Sheryians Coding School Full-Stack Assignment.</p>
          <div className="flex items-center gap-6">
            <span>JWT Access + Refresh Tokens</span>
            <span>ImageKit Media Integration</span>
            <span>REST CRUD Architecture</span>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default UserLayout;
