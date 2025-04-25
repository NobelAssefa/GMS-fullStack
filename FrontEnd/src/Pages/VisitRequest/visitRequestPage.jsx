import React, { useState } from 'react';
import './visitRequest.css';
import VisitRequestForm from '../../Components/visitRequestForm/VisitRequestForm';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VisitRequestPage() {
    const [feedback, setFeedback] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    const handleVisitSubmit = async (formData) => {
        try {
            const response = await axios.post('/api/visits/request', formData);
            
            setFeedback({
                open: true,
                message: 'Visit request submitted successfully!',
                severity: 'success'
            });

            // Redirect to visits list after successful submission
            setTimeout(() => {
                navigate('/visits');
            }, 2000);

        } catch (error) {
            console.error('Visit request error:', error);
            setFeedback({
                open: true,
                message: error.response?.data?.message || 'Failed to submit visit request. Please try again.',
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
