import React, { useState } from 'react';
import './guestRegistration.css';
import GuestForm from '../../Components/guestForm/GuestForm';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import guestService from '../../Services/guestService';

export default function GuestRegistrationPage() {
    const [feedback, setFeedback] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    const handleGuestSubmit = async (formData) => {
        try {
            console.log('Form data received:', formData); // Debug log

            // Transform form data to match backend model
            const guestData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                is_vip: formData.isVip,
                has_car: formData.hasCar,
                profileImage: formData.profileImage,
                // Car details will be handled by the backend if has_car is true
                plateNumber: formData.hasCar ? formData.plateNumber : undefined,
                carModel: formData.hasCar ? formData.carModel : undefined,
                carColor: formData.hasCar ? formData.carColor : undefined,
                // Format items data
                items: Array.isArray(formData.items) ? formData.items.map(item => ({
                    name: typeof item === 'string' ? item : item.name,
                    description: typeof item === 'string' ? '' : (item.description || ''),
                    isChecked: typeof item === 'string' ? false : (item.isChecked || false)
                })) : []
            };

            console.log('Transformed guest data:', guestData); // Debug log

            const response = await guestService.registerGuest(guestData);
            console.log('Registration response:', response); // Debug log
            
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