import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Snackbar,
    Alert,
    FormControlLabel,
    Switch,
    Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import userService from '../../Services/userService';
import './NewUser.css';
import api, { authService } from '../../Services/api';

const NewUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '+251',
        role_id: '',
        department_id: '',
        password: '',
        confirmPassword: '',
        status: true,
        is_Admin: false,
        profilePicture: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        // Fetch roles and departments
        const fetchData = async () => {
            try {
                console.log("trying to fetch roles and departments ");
                
                const [rolesData, departmentsData] = await Promise.all([
                    userService.getRoles(),
                    userService.getDepartments()
                ]);
                setRoles(rolesData);
                setDepartments(departmentsData);
            } catch (error) {
                showSnackbar('Failed to load roles and departments', 'error');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'file') {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showSnackbar('Image size should be less than 5MB', 'error');
                    return;
                }
                if (!file.type.startsWith('image/')) {
                    showSnackbar('Please upload an image file', 'error');
                    return;
                }
                setFormData(prev => ({
                    ...prev,
                    profilePicture: file
                }));
                // Create preview URL
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));

            // Update selectedRole when role changes
            if (name === 'role_id') {
                const role = roles.find(r => r._id === value);
                setSelectedRole(role);
                // Clear department if new role is not DIRECTOR
                if (role?.roleName !== 'DIRECTOR') {
                    setFormData(prev => ({
                        ...prev,
                        department_id: '',
                        [name]: value
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        [name]: value
                    }));
                }
            }
        }
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.role_id) newErrors.role_id = 'Role is required';
        if (selectedRole?.roleName === 'DIRECTOR' && !formData.department_id) {
            newErrors.department_id = 'Department is required for Director role';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Create FormData object to send multipart/form-data
            const formDataToSend = new FormData();
            
            // Add all user data fields
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('role_id', formData.role_id);
            formDataToSend.append('department_id', formData.department_id);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('is_Admin', formData.is_Admin);

            // Add the profile picture if it exists
            if (formData.profilePicture) {
                formDataToSend.append('avatar', formData.profilePicture);
            }

            // Register user with FormData
            const response = await api.post('/auth/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showSnackbar('User created successfully');
            setTimeout(() => {
                navigate('/user');
            }, 1500); // Navigate after 1.5 seconds
        } catch (error) {
            console.error('Registration error:', error);
            showSnackbar(error.message || 'Failed to create user', 'error');
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton 
                        onClick={() => navigate('/user')}
                        sx={{ mr: 2 }}
                        aria-label="back"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">
                        Add New User
                    </Typography>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Profile Picture Upload */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={previewUrl}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        border: '2px solid #eee'
                                    }}
                                />
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="profile-picture"
                                    name="profilePicture"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="profile-picture">
                                    <IconButton
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: 'white',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <AddPhotoAlternateIcon />
                                    </IconButton>
                                </label>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.role_id} disabled={loading}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    label="Role"
                                    required
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role._id} value={role._id}>
                                            {role.roleName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.role_id && (
                                    <Typography color="error" variant="caption">
                                        {errors.role_id}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        {selectedRole?.roleName === 'DIRECTOR' && (
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.department_id} disabled={loading}>
                                    <InputLabel>Department</InputLabel>
                                    <Select
                                        name="department_id"
                                        value={formData.department_id}
                                        onChange={handleChange}
                                        label="Department"
                                        required
                                    >
                                        {departments.map((dept) => (
                                            <MenuItem key={dept._id} value={dept._id}>
                                                {dept.departmentName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.department_id && (
                                        <Typography color="error" variant="caption">
                                            {errors.department_id}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.status}
                                        onChange={handleChange}
                                        name="status"
                                        disabled={loading}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_Admin}
                                        onChange={handleChange}
                                        name="is_Admin"
                                        disabled={loading}
                                    />
                                }
                                label="Admin Access"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/users')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create User'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default NewUser; 