import React, { useState } from 'react';
import './newDepartment.css';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import * as departmentService from '../../Services/departmentService';

export default function NewDepartment() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await departmentService.addDepartment({ departmentName: formData.name });
            setSnackbar({ open: true, message: 'Department added successfully', severity: 'success' });
            setTimeout(() => navigate('/department'), 1000);
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to add department', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/department');
    };

    return (
        <div className="new-department-container">
            <Paper elevation={3} className="new-department-header-card">
                <Typography variant="h3" className="new-department-title">
                    Add New Department
                </Typography>
                <Typography variant="subtitle1" className="new-department-subtitle">
                    Create a new department for your organization
                </Typography>
            </Paper>

            <Paper className="form-container">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Department Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-field"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                className="form-field"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="form-actions">
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    className="cancel-button"
                                    startIcon={<ArrowBackIcon />}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Department'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
} 