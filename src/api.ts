// src/api.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "https://api.wattmatrix.io";

export const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,  // agar cookies/jwt chahiye
});
