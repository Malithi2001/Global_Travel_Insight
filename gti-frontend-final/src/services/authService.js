import api from "./apiClient.js";

export async function signup(body) {
  const res = await api.post("/auth/signup", body);
  return res.data;
}

export async function login(body) {
  const res = await api.post("/auth/login", body);
  return res.data;
}

export async function verify2FA(body) {
  const res = await api.post("/auth/verify-2fa", body);
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function requestPasswordReset(email) {
  const res = await api.post("/auth/request-password-reset", { email });
  return res.data;
}

export async function resetPassword(token, password) {
  const res = await api.post("/auth/reset-password", { token, password });
  return res.data;
}