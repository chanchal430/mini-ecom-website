import api from "../../../config/api";

export const getAllProductsApi = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (formData) => {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProductApi = async (id, formData) => {
  // If formData is FormData instance
  const isFormData = typeof FormData !== "undefined" && formData instanceof FormData;

  const response = await api.put(`/products/${id}`, formData, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
