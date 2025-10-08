// src/api.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const  
api = axios.create({ baseURL: BASE });

// token auto attach
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  // FormData? -> Content-Type remove (browser will set boundary)
  const isForm = typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isForm && config.headers) {
    // @ts-ignore
    delete config.headers["Content-Type"];
    // @ts-ignore
    delete config.headers.post?.["Content-Type"];
    // @ts-ignore
    delete config.headers.common?.["Content-Type"];
  }
  return config;
});
