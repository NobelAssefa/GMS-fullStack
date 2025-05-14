import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Grid,
    Divider,
    TextField,
    Button,
    Tab,
    Tabs,
    IconButton,
    Dialog,
    Snackbar,
    Alert,
    Container,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useSelector } from 'react-redux';
import userService from '../../Services/userService';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Profile = () => {
    const theme = useTheme();
    const user = useSelector((state) => state.auth.user);
    const [tabValue, setTabValue] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    // Form states
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validatePasswordChange = () => {
        const newErrors = {};
        if (!passwordData.oldPassword) newErrors.oldPassword = 'Current password is required';
        if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
        if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordSubmit = async () => {
        if (!validatePasswordChange()) return;

        setLoading(true);
        try {
            await userService.changePassword({
                oldpassword: passwordData.oldPassword,
                password: passwordData.newPassword
            });
            setSnackbar({ open: true, message: 'Password changed successfully', severity: 'success' });
            setPasswordDialog(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Failed to change password', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            // Call update profile API
            await userService.updateProfile(profileData);
            setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
            setIsEditMode(false);
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Failed to update profile', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 4,
                px: 2
            }}
        >
            <Container maxWidth="lg">
                {/* Profile Header Card */}
                <Card 
                    elevation={3}
                    sx={{
                        mb: 3,
                        background: 'linear-gradient(to right, #006A71, #48A6A7)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'visible'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1
                        }}
                    >
                        <Avatar
                            src={user?.avatar}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid white',
                                boxShadow: theme.shadows[3]
                            }}
                        >
                            {user?.fullName?.charAt(0)}
                        </Avatar>
                    </Box>
                    <CardContent sx={{ pt: 10, pb: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>
                            {user?.fullName}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.8 }}>
                            {user?.role?.roleName}
                        </Typography>
                        {user?.department && (
                            <Typography sx={{ opacity: 0.8 }}>
                                {user.department.departmentName}
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Main Content Card */}
                <Card 
                    elevation={3}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <CardContent>
                        {/* Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{
                                    '& .MuiTab-root': {
                                        minHeight: 64,
                                        fontSize: '1rem'
                                    }
                                }}
                            >
                                <Tab 
                                    icon={<BadgeIcon />} 
                                    label="Profile Info" 
                                    sx={{ 
                                        '&.Mui-selected': {
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                />
                                <Tab 
                                    icon={<LockIcon />} 
                                    label="Security"
                                    sx={{ 
                                        '&.Mui-selected': {
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                />
                            </Tabs>
                        </Box>

                        {/* Profile Info Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                        <EmailIcon sx={{ mr: 2, mt: 2, color: theme.palette.primary.main }} />
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            disabled={!isEditMode}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                        <BadgeIcon sx={{ mr: 2, mt: 2, color: theme.palette.primary.main }} />
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleProfileChange}
                                            disabled={!isEditMode}
                                            error={!!errors.fullName}
                                            helperText={errors.fullName}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                        <PhoneIcon sx={{ mr: 2, mt: 2, color: theme.palette.primary.main }} />
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            disabled={!isEditMode}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                        {isEditMode ? (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setIsEditMode(false)}
                                                    disabled={loading}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        px: 4
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleUpdateProfile}
                                                    disabled={loading}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        px: 4,
                                                        background: 'linear-gradient(45deg, #48A6A7 30%, #9ACBD0 90%)',
                                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                                    }}
                                                >
                                                    Save Changes
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => setIsEditMode(true)}
                                                variant="contained"
                                                sx={{ 
                                                    borderRadius: 2,
                                                    px: 4,
                                                    background: 'linear-gradient(45deg, #48A6A7 30%, #9ACBD0 90%)',
                                                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                                }}
                                            >
                                                Edit Profile
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Security Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                p: 4,
                                textAlign: 'center'
                            }}>
                                <LockIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Password & Security
                                </Typography>
                                <Typography color="textSecondary" sx={{ mb: 3 }}>
                                    Manage your password and security settings
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<LockIcon />}
                                    onClick={() => setPasswordDialog(true)}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                    }}
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </TabPanel>
                    </CardContent>
                </Card>
            </Container>

            {/* Password Change Dialog */}
            <Dialog 
                open={passwordDialog} 
                onClose={() => setPasswordDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        Change Password
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Current Password"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.oldPassword}
                                helperText={errors.oldPassword}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setPasswordDialog(false)}
                                    disabled={loading}
                                    sx={{ borderRadius: 2, px: 3 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handlePasswordSubmit}
                                    disabled={loading}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                    }}
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
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

export default Profile; 