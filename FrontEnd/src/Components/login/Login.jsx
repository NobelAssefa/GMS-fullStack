import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    InputAdornment,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../Services/api';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../Redux/slices/authSlice';
import './login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const response = await authService.login(formData.email, formData.password);
            dispatch(loginSuccess(response));
            
            // Get the redirect path from location state or default to home
            const from = location.state?.from?.pathname || '/home';
            navigate(from, { replace: true });
        } catch (err) {
            dispatch(loginFailure(err.message || 'Login failed. Please check your credentials.'));
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <Typography variant="h1" className="welcome-text">
                    Welcome Back!
                </Typography>
                <Typography variant="body1" className="welcome-subtitle">
                    Welcome to Guest Management System
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <TextField
                        fullWidth
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        fullWidth
                        name="password"
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        variant="outlined"
                        required
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showPassword ? <VisibilityOff style={{ cursor: 'pointer' }} onClick={() => setShowPassword(false)} /> 
                                                : <Visibility style={{ cursor: 'pointer' }} onClick={() => setShowPassword(true)} />}
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        className="submit-btn"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
