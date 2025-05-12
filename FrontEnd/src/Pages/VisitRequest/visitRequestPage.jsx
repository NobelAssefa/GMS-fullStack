import React, { useState } from 'react';
import './visitRequest.css';
import VisitRequestForm from '../../Components/visitRequestForm/VisitRequestForm';
import { Alert, Snackbar } from '@mui/material';
import { createVisitRequest } from '../../Services/visitService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function VisitRequestPage() {
    const [feedback, setFeedback] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleVisitSubmit = async (formData) => {
        try {
            const payload = { ...formData, user_id: user?._id };
            const response = await createVisitRequest(payload);
            setFeedback({
                open: true,
                message: 'Visit request submitted successfully!',
                severity: 'success'
            });
            return response; // Return the response to the form component
        } catch (error) {
            console.error('Visit request error:', error, error.response?.data);
            setFeedback({
                open: true,
                message: error.response?.data?.message || error.message || 'Failed to submit visit request. Please try again.',
                severity: 'error'
            });
            throw error; // Re-throw the error to be handled by the form
        }
    };

    const handleCloseFeedback = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setFeedback({ ...feedback, open: false });
    };

    return (
        <div className="visit-request-page">
            <div className="page-header">
                <h1>Visit Request</h1>
                <p>Submit a new visit request</p>
            </div>

            <VisitRequestForm onSubmit={handleVisitSubmit} />
            
            <Snackbar 
                open={feedback.open} 
                autoHideDuration={6000} 
                onClose={handleCloseFeedback}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseFeedback} 
                    severity={feedback.severity}
                    sx={{ width: '100%' }}
                >
                    {feedback.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
