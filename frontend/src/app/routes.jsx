import { createBrowserRouter } from "react-router";

// Layouts
import UserLayout from "../layouts/UserLayout";
import SellerLayout from "../layouts/SellerLayout";

// Route Guards
import ProtectedRoute from "../routes/ProtectedRoute";
import SellerRoute from "../routes/SellerRoute";
import UserRoute from "../routes/UserRoute";

// Pages
import Home from "../pages/Home";
import Products from "../features/products/ui/pages/Products";
import ProductDetails from "../features/products/ui/pages/ProductDetails";
import Login from "../features/auth/ui/pages/Login";
import Register from "../features/auth/ui/pages/Register";
import Profile from "../features/users/ui/pages/Profile";
import SellerDashboard from "../pages/SellerDashboard";
import CreateProduct from "../features/products/ui/pages/CreateProduct";
import EditProduct from "../features/products/ui/pages/EditProduct";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      // Auth pages for guests (redirect logged-in users)
      {
        element: <UserRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      // Protected profile page for authenticated users
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  // Seller portal routes (Restricted to role === "seller")
  {
    path: "/seller",
    element: <SellerRoute />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          {
            index: true,
            element: <SellerDashboard />,
          },
          {
            path: "products/create",
            element: <CreateProduct />,
          },
          {
            path: "products/:id/edit",
            element: <EditProduct />,
          },
        ],
      },
    ],
  },
  // 404 Catch all
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
