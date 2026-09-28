import api from "../../../config/api";

export const registerApi = async ({ name, email, password, confirmPassword, role }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    confirmPassword,
    role,
  });
  return response.data;
};

export const loginApi = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const refreshApi = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
