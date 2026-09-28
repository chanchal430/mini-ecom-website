import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import { PageLoader } from "../shared/components/Loader";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
