import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ProductProvider } from "./features/products/context/ProductContext";
import { ToastProvider } from "./shared/context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <RouterProvider router={router} />
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
