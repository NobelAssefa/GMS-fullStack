import React, { useState } from 'react';
import './guestRegistration.css';
import GuestForm from '../../Components/guestForm/GuestForm';
import { Alert, Snackbar } from '@mui/material';
import guestService from '../../Services/guestService';

export default function GuestRegistrationPage() {
    const [feedback, setFeedback] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleGuestSubmit = async (formData) => {
        try {
            console.log('Form data received:', formData); // Debug log

            // Transform form data to match backend model
            const guestData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                is_vip: formData.isVip,
                profileImage: formData.profileImage,
                
            };

            console.log('Transformed guest data:', guestData); // Debug log

            const response = await guestService.registerGuest(guestData);
            console.log('Registration response:', response); // Debug log
            
            setFeedback({
                open: true,
                message: 'Guest registered successfully! You can register another guest.',
                severity: 'success'
            });

        } catch (error) {
            console.error('Registration error:', error);
            setFeedback({
                open: true,
                message: error.message || 'Failed to register guest. Please try again.',
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