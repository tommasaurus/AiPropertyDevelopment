import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,  // Important: This ensures cookies (JWT) are sent with requests
});

// Function to refresh access token (if needed)
async function refreshAccessToken() {
    try {
        const response = await axios.post('/auth/token/refresh', {}, { withCredentials: true });
        return response.data.access_token;
    } catch (error) {
        console.error('Unable to refresh access token:', error);
        throw new Error('Unable to refresh access token');
    }
}

// Axios request interceptor
api.interceptors.request.use(
    async (config) => {
        // No need to manually attach Authorization header since the cookie will be automatically sent
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios response interceptor to handle token expiration and auto-refresh
api.interceptors.response.use(
    (response) => response,  // Return response if successful
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`; // Optional if needed for manual token management
                return api(originalRequest);  // Retry the original request
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return Promise.reject(error);  // Reject original error if refresh fails
            }
        }
        return Promise.reject(error);
    }
);

export default api;
