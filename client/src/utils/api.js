import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// ==========================
// Request Interceptor
// ==========================
api.interceptors.request.use(
  (config) => {
    // 👉 Future: token header add করতে পারো
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// Response Interceptor
// ==========================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔍 Auth routes check (IMPORTANT)
    const isAuthRoute =
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/register") ||
      originalRequest?.url?.includes("/refresh-token");

    // 🔥 Handle 401 (Token Expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Refreshing token...");

        await api.post("/api/user/refresh-token");

        console.log("✅ Token refreshed");

        // 🔁 Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // 👉 Optional: logout redirect
        // window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // ❌ Other errors
    return Promise.reject(error);
  }
);

export default api;