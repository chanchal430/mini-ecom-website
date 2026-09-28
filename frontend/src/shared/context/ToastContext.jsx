import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = "info", duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  

  const showComingSoon = useCallback((featureName = "This feature") => {
    addToast({
      message: `🚀 ${featureName} will come soon! We're building this for you.`,
      type: "coming-soon",
      duration: 4000,
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showComingSoon, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
