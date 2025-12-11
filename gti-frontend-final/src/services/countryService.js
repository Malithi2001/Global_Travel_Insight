import api from "./apiClient.js";

export async function searchCountry(countryName) {
  const res = await api.get("/api/search", { params: { q: countryName } });
  return res.data;
}

export async function getHistory() {
  const res = await api.get("/api/records");
  return res.data;
}

export async function getAdminOverview() {
  const res = await api.get("/api/admin/overview");
  return res.data;
}