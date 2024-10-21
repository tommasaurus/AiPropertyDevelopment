// api.js
import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken } from './token';

// Create Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Function to refresh access token
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await axios.post('/auth/token/refresh', {
            refresh_token: refreshToken,
        });
        setAccessToken(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        throw new Error('Unable to refresh access token');
    }
}

// Axios request interceptor
api.interceptors.request.use(async (config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Axios response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,  // Return response if successful
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);  // Retry the original request
        }
        return Promise.reject(error);
    }
);

export default api;
