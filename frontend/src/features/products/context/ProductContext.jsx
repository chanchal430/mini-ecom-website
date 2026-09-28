import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../api/product.api";
import { useToast } from "../../../shared/context/ToastContext";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllProductsApi();
      const list = res?.data?.products || res?.data?.product || [];
      setProducts(list);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load products";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (formData) => {
    const res = await createProductApi(formData);
    const newProduct = res?.data?.product;
    if (newProduct) {
      setProducts((prev) => [newProduct, ...prev]);
    }
    addToast({ message: "Product created successfully!", type: "success" });
    return res;
  };

  const updateProduct = async (id, formData) => {
    const res = await updateProductApi(id, formData);
    const updatedProduct = res?.data?.product;
    if (updatedProduct) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updatedProduct : p))
      );
    }
    addToast({ message: "Product updated successfully!", type: "success" });
    return res;
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      addToast({ message: "Product deleted successfully", type: "success" });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete product";
      addToast({ message: msg, type: "error" });
      return false;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export default ProductContext;
