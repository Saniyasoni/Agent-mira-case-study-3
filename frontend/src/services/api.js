import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Get all properties with optional filters
export const getProperties = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.location) params.append("location", filters.location);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);
  if (filters.search) params.append("search", filters.search);

  const res = await api.get(`/properties?${params.toString()}`);
  return res.data;
};

// Chat with NLP
export const chatWithNLP = async (message) => {
  const res = await api.post("/properties/chat", { message });
  return res.data;
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};

// Get unique locations
export const getLocations = async () => {
  const res = await api.get("/properties/locations/list");
  return res.data;
};

// Save a property
export const saveProperty = async (property) => {
  const res = await api.post("/saved", property);
  return res.data;
};

// Get saved properties
export const getSavedProperties = async () => {
  const res = await api.get("/saved");
  return res.data;
};

// Remove a saved property
export const removeSavedProperty = async (id) => {
  const res = await api.delete(`/saved/${id}`);
  return res.data;
};

export default api;
