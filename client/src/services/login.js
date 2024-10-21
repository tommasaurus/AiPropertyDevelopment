// login.js
import api from './api';

// Function for logging in with email and password
export async function loginUser(email, password) {
    try {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        console.log('User logged in successfully');
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Function for OAuth login with Google
export async function loginWithGoogle() {
    try {
        // Redirect to OAuth endpoint for Google login
        window.location.href = 'http://localhost:8000/auth/login/google';
    } catch (error) {
        console.error('OAuth login error:', error);
        throw error;
    }
}

// Function to handle OAuth callback and store tokens
export async function handleOAuthCallback() {
    try {
        // Assuming the backend redirects with tokens in query params
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            console.log('OAuth login successful');
        } else {
            throw new Error('OAuth tokens not found in the response');
        }
    } catch (error) {
        console.error('OAuth callback handling error:', error);
        throw error;
    }
}
