import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../Services/api';
import { loginSuccess, loginFailure } from '../Redux/slices/authSlice';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log('Current path:', location.pathname);
            console.log('Current auth state:', { isAuthenticated, user });

            // Skip auth check if we're on the login page
            if (location.pathname === '/login') {
                console.log('On login page, skipping auth check');
                return;
            }

            // If we're already authenticated according to Redux state, don't check again
            if (isAuthenticated && user) {
                console.log('Already authenticated, skipping auth check');
                return;
            }

            // If we're not authenticated and not on login page, check auth status
            console.log('Checking authentication status...');
            try {
                const response = await authService.checkAuth();
                console.log('Auth check response:', response);
                
                if (response.isAuthenticated) {
                    console.log('User is authenticated, updating state');
                    dispatch(loginSuccess(response.user));
                } else {
                    console.log('User is not authenticated, redirecting to login');
                    dispatch(loginFailure('Not authenticated'));
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                dispatch(loginFailure('Not authenticated'));
                navigate('/login', { replace: true });
            }
        };

        checkAuthStatus();
    }, [dispatch, navigate, location.pathname, isAuthenticated, user]);

    return children;
};

export default AuthProvider; 