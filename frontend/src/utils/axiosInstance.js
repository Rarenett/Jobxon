import axios from 'axios';

const API_URL = "http://localhost:8000/api";

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accesstoken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshtoken');
                
                if (!refreshToken) {
                    // No refresh token, redirect to login
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Request new access token using refresh token
                const response = await axios.post(`${API_URL}/token/refresh/`, {
                    refresh: refreshToken
                });

                const newAccessToken = response.data.access;

                // Save new access token
                localStorage.setItem('accesstoken', newAccessToken);

                // Update the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Refresh token failed - logout user
                console.error('Token refresh failed:', refreshError);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
