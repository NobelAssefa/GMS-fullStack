import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../Services/api';
import { loginSuccess, loginFailure, logout } from '../Redux/slices/authSlice';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [initialAuthChecked, setInitialAuthChecked] = useState(false);
    const [sessionCheckInterval, setSessionCheckInterval] = useState(null);

    // Function to check authentication status
    const checkAuthStatus = async () => {
        console.log('Checking authentication status...');
        try {
            const response = await authService.checkAuth();
            console.log('Auth check response:', response);
            
            if (response.isAuthenticated) {
                console.log('User is authenticated, updating state');
                dispatch(loginSuccess(response.user));
            } else {
                console.log('User is not authenticated, redirecting to login');
                handleLogout(response.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            const errorMessage = error.message || 'Authentication check failed';
            handleLogout(errorMessage);
        }
    };

    // Function to handle logout
    const handleLogout = async (errorMessage = null) => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(logout());
            if (errorMessage) {
                dispatch(loginFailure(errorMessage));
            }
            if (location.pathname !== '/login') {
                navigate('/login', { 
                    replace: true,
                    state: { error: errorMessage }
                });
            }
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            // Skip auth check if we're on the login page
            if (location.pathname === '/login') {
                console.log('On login page, skipping auth check');
                setInitialAuthChecked(true);
                return;
            }

            // If we're already authenticated and it's not the initial check, skip
            if (isAuthenticated && initialAuthChecked) {
                console.log('Already authenticated and checked, skipping auth check');
                return;
            }

            await checkAuthStatus();
            setInitialAuthChecked(true);

            // Set up periodic session checks (every 5 minutes)
            if (!sessionCheckInterval) {
                const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);
                setSessionCheckInterval(interval);
            }
        };

        initializeAuth();

        // Cleanup interval on unmount
        return () => {
            if (sessionCheckInterval) {
                clearInterval(sessionCheckInterval);
            }
        };
    }, [location.pathname]);

    // Add event listeners for user activity
    useEffect(() => {
        if (isAuthenticated) {
            const resetSessionTimer = () => {
                // Reset the session check timer on user activity
                if (sessionCheckInterval) {
                    clearInterval(sessionCheckInterval);
                }
                const newInterval = setInterval(checkAuthStatus, 5 * 60 * 1000);
                setSessionCheckInterval(newInterval);
            };

            // Add event listeners for user activity
            window.addEventListener('mousemove', resetSessionTimer);
            window.addEventListener('keypress', resetSessionTimer);
            window.addEventListener('click', resetSessionTimer);

            return () => {
                window.removeEventListener('mousemove', resetSessionTimer);
                window.removeEventListener('keypress', resetSessionTimer);
                window.removeEventListener('click', resetSessionTimer);
                if (sessionCheckInterval) {
                    clearInterval(sessionCheckInterval);
                }
            };
        }
    }, [isAuthenticated, sessionCheckInterval]);

    // Only show loading state during initial authentication check
    if (!initialAuthChecked && !isAuthenticated && location.pathname !== '/login') {
        return <div style={{textAlign: 'center', marginTop: '2rem'}}>Checking authentication...</div>;
    }

    return children;
};

export default AuthProvider; 