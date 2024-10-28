// src/components/RequireAuth.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const RequireAuth = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true; // To prevent state updates if component is unmounted

        async function checkAuth() {
            try {
                // Make a request to verify authentication
                await api.get('/auth/check');
                if (isMounted) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                if (isMounted) {
                    setIsAuthenticated(false);
                }
                // The api.js interceptor will handle token refresh and potential redirection
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children; // If authenticated, render the child component
};

export default RequireAuth;
