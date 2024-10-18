import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://your-api-url.com',  // Replace with your actual API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to check token expiration and refresh the access token if needed
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const isExpired = checkIfTokenExpired(accessToken); // Function to check token expiration

        if (isExpired && refreshToken) {
            // Refresh the access token if expired
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                localStorage.setItem('access_token', newAccessToken);
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error('Refresh token failed', error);
                // Optionally handle failed refresh token here (e.g., redirect to login)
            }
        } else if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to check if the token has expired
function checkIfTokenExpired(token) {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
}

// Function to refresh the access token
async function refreshAccessToken(refreshToken) {
    const response = await api.post('/refresh-token', {
        refresh_token: refreshToken,
    });
    return response.data.access_token;
}

export default api;
