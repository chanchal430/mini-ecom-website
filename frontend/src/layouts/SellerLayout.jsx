import { Outlet } from "react-router";
import Sidebar from "../shared/components/Sidebar";
import ToastContainer from "../shared/components/Toast";

export const SellerLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellerLayout;
