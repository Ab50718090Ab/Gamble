import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// 🔥 FIXED INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // only handle 401 once
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // 🔥 FIX: ensure cookie-based refresh works properly
                await api.post("/api/user/refresh-token");

                // retry original request after refresh
                return api(originalRequest);

            } catch (err) {
                console.error("Token refresh failed:", err);

                // optional: force logout cleanup
                localStorage.removeItem("user");

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;