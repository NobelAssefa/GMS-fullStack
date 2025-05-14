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
    FormControlLabel,
    Switch,
    Avatar,
    IconButton,
    Alert,
    CircularProgress,
    Snackbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import userService from '../../Services/userService';

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role_id: '',
        department_id: '',
        status: true,
        is_Admin: false,
        avatar: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, rolesData, departmentsData] = await Promise.all([
                    userService.getUser(id),
                    userService.getRoles(),
                    userService.getDepartments()
                ]);

                setFormData({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    role_id: userData.role_id?._id || '',
                    department_id: userData.department_id?._id || '',
                    status: userData.status ?? true,
                    is_Admin: userData.is_Admin ?? false,
                });
                setPreviewUrl(userData.avatar || null);
                setRoles(rolesData);
                setDepartments(departmentsData);
                setError('');
            } catch (err) {
                setError('Failed to load user data');
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'file') {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    setError('Image size should be less than 5MB');
                    return;
                }
                if (!file.type.startsWith('image/')) {
                    setError('Please upload an image file');
                    return;
                }
                setFormData(prev => ({
                    ...prev,
                    avatar: file
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await userService.updateUser(id, formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/user');
            }, 1500); // Navigate after 1.5 seconds
        } catch (err) {
            setError(err.message || 'Failed to update user');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Snackbar
                open={success}
                autoHideDuration={1500}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    User updated successfully!
                </Alert>
            </Snackbar>

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
                        Edit User
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

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
                                >
                                    {formData.fullName?.charAt(0)}
                                </Avatar>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="profile-picture"
                                    name="avatar"
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
                                required
                                disabled={saving}
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
                                required
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required disabled={saving}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    label="Role"
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role._id} value={role._id}>
                                            {role.roleName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required disabled={saving}>
                                <InputLabel>Department</InputLabel>
                                <Select
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                    label="Department"
                                >
                                    {departments.map((dept) => (
                                        <MenuItem key={dept._id} value={dept._id}>
                                            {dept.departmentName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.status}
                                        onChange={handleChange}
                                        name="status"
                                        disabled={saving}
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
                                        disabled={saving}
                                    />
                                }
                                label="Admin Access"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/user')}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default EditUser; 