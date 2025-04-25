import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const navigate = useNavigate();
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
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

                <form onSubmit={handleSubmit} className="login-form">
                    <TextField
                        fullWidth
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        name="password"
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        variant="outlined"
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
                    >
                        SIGN IN
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
