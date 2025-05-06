import React, { useState } from 'react';
import './newRole.css';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function NewRole() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement submit functionality
        console.log('Role submitted:', formData);
        navigate('/users');
    };

    const handleBack = () => {
        navigate('/users');
    };

    return (
        <div className="new-role-container">
            <Paper elevation={3} className="new-role-header-card">
                <Typography variant="h3" className="new-role-title">
                    Add New Role
                </Typography>
                <Typography variant="subtitle1" className="new-role-subtitle">
                    Create a new role for your system
                </Typography>
            </Paper>

            <Paper className="form-container">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Role Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-field"
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="form-actions">
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    className="cancel-button"
                                    startIcon={<ArrowBackIcon />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="submit-button"
                                >
                                    Add Role
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    );
} 