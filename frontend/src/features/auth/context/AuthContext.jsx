import { createContext, useState, useEffect, useCallback } from "react";
import { loginApi, registerApi, logoutApi, refreshApi, getMeApi } from "../api/auth.api";
import { setAuthToken } from "../../../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyAuth = (token, userData) => {
    setAuthToken(token);
    setTokenState(token);
    if (userData) {
      setUser(userData);
    }
  };

  const clearAuth = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  // Check auth on startup via refresh-token and getMe
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const refreshRes = await refreshApi();
      if (refreshRes?.accessToken) {
        applyAuth(refreshRes.accessToken, refreshRes.data?.user);
        // Ensure full user profile is loaded
        try {
          const meRes = await getMeApi();
          if (meRes?.data?.user) {
            setUser(meRes.data.user);
          }
        } catch {
          // Keep user from refreshRes if getMe fails
        }
      }
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async ({ email, password }) => {
    const data = await loginApi({ email, password });
    if (data?.accessToken && data?.data?.user) {
      applyAuth(data.accessToken, data.data.user);
    }
    return data;
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuth();
    }
  };

  const isSeller = user?.role === "seller";
  const isAuthenticated = Boolean(user && accessToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated,
        isSeller,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
