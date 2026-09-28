import { Navigate, Outlet } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export const UserRoute = () => {
  const { isAuthenticated, isSeller, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={isSeller ? "/seller" : "/"} replace />;
  }

  return <Outlet />;
};

export default UserRoute;
