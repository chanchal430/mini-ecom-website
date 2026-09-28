import { useProductContext } from "../context/ProductContext";

export const useProducts = () => {
  const context = useProductContext();

  return {
    products: context.products,
    loading: context.loading,
    error: context.error,
    refresh: context.fetchProducts,
    createProduct: context.createProduct,
    updateProduct: context.updateProduct,
    deleteProduct: context.deleteProduct,
  };
};

export default useProducts;
