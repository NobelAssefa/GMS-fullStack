import React, { useState } from 'react';
import './guestRegistration.css';
import GuestForm from '../../Components/guestForm/GuestForm';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GuestRegistrationPage() {
    const [feedback, setFeedback] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    const handleGuestSubmit = async (formData) => {
        try {
            // Show loading state if needed
            const response = await axios.post('/api/guests/register', formData);
            
            setFeedback({
                open: true,
                message: 'Guest registered successfully!',
                severity: 'success'
            });

            // Redirect to guest list after successful registration
            setTimeout(() => {
                navigate('/guests');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            setFeedback({
                open: true,
                message: error.response?.data?.message || 'Failed to register guest. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseFeedback = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setFeedback({ ...feedback, open: false });
    };

    return (
        <div className="guest-registration-page">
            <div className="page-header">
                <h1>Register a Guest</h1>
                <p>Fill in the guest details to complete registration</p>
            </div>

            <GuestForm onSubmit={handleGuestSubmit} />

            <Snackbar
                open={feedback.open}
                autoHideDuration={6000}
                onClose={handleCloseFeedback}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseFeedback} 
                    severity={feedback.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {feedback.message}
                </Alert>
            </Snackbar>
        </div>
    );
} 