// src/services/login.js
import api from './api';

// Function for logging in with email and password
export async function loginUser(email, password) {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { access_token } = response.data;
        // Store access token in localStorage
        localStorage.setItem('access_token', access_token);
        // Set default Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        console.log('User logged in successfully');
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Function for OAuth login with Google
export function loginWithGoogle() {
    // Redirect to OAuth endpoint for Google login
    window.location.href = 'http://localhost:8000/auth/login/google';
}

// Function to handle OAuth callback and store tokens
export async function handleOAuthCallback() {
    try {
        // Since the access token isn't included in the redirect,
        // call the refresh endpoint to get a new access token
        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;
        // Store access token in localStorage
        localStorage.setItem('access_token', access_token);
        // Set default Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        console.log('OAuth login successful');
        return response.data;
    } catch (error) {
        console.error('OAuth callback handling error:', error);
        throw error;
    }
}
