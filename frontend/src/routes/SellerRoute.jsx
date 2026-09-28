import { Navigate, Outlet } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import { PageLoader } from "../shared/components/Loader";

export const SellerRoute = () => {
  const { isAuthenticated, isSeller, loading } = useAuth();

  if (loading) {
    return <PageLoader text="Verifying seller credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isSeller) {
    // If authenticated customer tries to access seller portal, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
