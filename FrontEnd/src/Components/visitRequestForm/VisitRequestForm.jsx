import React, { useState, useEffect } from 'react';
import './visitRequestForm.css';
import { Autocomplete, TextField, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Paper, Typography, Box, Button, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import guestService from '../../Services/guestService';
import { getAllDepartments } from '../../Services/departmentService';
import { useSelector } from 'react-redux';
import UserVisitRequestsTable from './UserVisitRequestsTable';

export default function VisitRequestForm({ onSubmit }) {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        guest: null,
        department: null,
        visitDate: null,
        dateRange: [null, null],
        durationType: 'single', // 'single' or 'range'
        hasCar: false,
        plateNumber: '',
        carModel: '',
        carColor: '',
        items: [],
        remark: ''
    });
    const [submittedVisit, setSubmittedVisit] = useState(null);
    const [submittedFormData, setSubmittedFormData] = useState(null); // Store the form data at submission
    const [guests, setGuests] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtherItemInput, setShowOtherItemInput] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const predefinedItems = ['Laptop', 'Phone', 'Tablet', 'Camera', 'Other'];

    useEffect(() => {
        async function fetchData() {
            try {
                const guestsData = await guestService.getAllGuests();
                let guestsArr = [];
                if (Array.isArray(guestsData)) {
                    guestsArr = guestsData;
                } else if (guestsData && Array.isArray(guestsData.guests)) {
                    guestsArr = guestsData.guests;
                }
                console.log('Fetched guests data:', guestsArr); // Debug log
                setGuests(guestsArr);

                const departmentsData = await getAllDepartments();
                setDepartments(departmentsData);

                // Only set department if user and departments are loaded
                if (user && user.department && departmentsData.length > 0) {
                    // Try to match by _id or departmentName
                    const userDept = departmentsData.find(
                        d =>
                            d._id === user.department._id ||
                            d._id === user.department ||
                            d.departmentName === user.department.departmentName ||
                            d.departmentName === user.department
                    );
                    if (!userDept) {
                        console.warn('Could not auto-select user department:', user.department, departmentsData);
                    }
                    setFormData(prev => ({ ...prev, department: userDept || null }));
                }
            } catch (err) {
                console.error('Failed to fetch guests or departments:', err);
            }
        }
        fetchData();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleToggleChange = (name) => (event) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: event.target.checked
        }));
    };

    const handleItemChange = (item) => (event) => {
        if (item === 'Other') {
            setShowOtherItemInput(event.target.checked);
            if (!event.target.checked) {
                setFormData(prevState => ({
                    ...prevState,
                    items: prevState.items.filter(i => predefinedItems.includes(i))
                }));
                setNewItem('');
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                items: event.target.checked
                    ? [...prevState.items, item]
                    : prevState.items.filter(i => i !== item)
            }));
        }
    };

    const handleAddNewItem = () => {
        if (newItem.trim() && !formData.items.includes(newItem.trim())) {
            setFormData(prevState => ({
                ...prevState,
                items: [...prevState.items, newItem.trim()]
            }));
            setNewItem('');
        }
    };

    const handleDurationTypeChange = (event) => {
        setFormData(prev => ({ ...prev, durationType: event.target.value, visitDate: null, dateRange: [null, null] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            let submitData = {
                guest_id: formData.guest?._id || formData.guest?.id,
                department_id: formData.department?._id || formData.department?.id,
                remark: formData.remark,
                car: formData.hasCar ? {
                    plateNumber: formData.plateNumber,
                    carModel: formData.carModel,
                    carColor: formData.carColor
                } : undefined,
                items: formData.items
            };
            if (formData.durationType === 'single') {
                submitData.visit_date = formData.visitDate;
                submitData.duration = 'single';
            } else {
                submitData.visit_date = formData.dateRange[0];
                submitData.duration = formData.dateRange[1];
            }
            const response = await onSubmit(submitData);
            setSubmittedVisit(response);
            setSubmittedFormData(formData);
            setShowSuccess(true);
            setShowPreviewDialog(true);
            
            // Reset form but keep department
            setFormData({
                guest: null,
                department: formData.department,
                visitDate: null,
                dateRange: [null, null],
                durationType: 'single',
                hasCar: false,
                plateNumber: '',
                carModel: '',
                carColor: '',
                items: [],
                remark: ''
            });
            setShowOtherItemInput(false);
            setNewItem('');
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = () => {
        if (!submittedVisit || !submittedFormData) return;

        const visitDetails = {
            'Visit Code': submittedVisit.unique_code,
            'Guest': submittedFormData.guest ? `${submittedFormData.guest.fullName} (${submittedFormData.guest.email})` : 'N/A',
            'Department': submittedFormData.department?.departmentName || 'N/A',
            'Visit Date': submittedFormData.durationType === 'single' 
                ? new Date(submittedFormData.visitDate).toLocaleDateString()
                : `${new Date(submittedFormData.dateRange[0]).toLocaleDateString()} - ${new Date(submittedFormData.dateRange[1]).toLocaleDateString()}`,
            'Status': submittedVisit.is_approved ? 'Approved' : 'Pending',
            'Car Details': submittedFormData.hasCar ? {
                'Plate Number': submittedFormData.plateNumber,
                'Model': submittedFormData.carModel,
                'Color': submittedFormData.carColor
            } : 'No car registered',
            'Items': submittedFormData.items.length > 0 ? submittedFormData.items.join(', ') : 'No items',
            'Remarks': submittedFormData.remark || 'No remarks'
        };

        const content = Object.entries(visitDetails)
            .map(([key, value]) => {
                if (typeof value === 'object') {
                    return `${key}:\n${Object.entries(value)
                        .map(([k, v]) => `  ${k}: ${v}`)
                        .join('\n')}`;
                }
                return `${key}: ${value}`;
            })
            .join('\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visit-request-${submittedVisit.unique_code}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const renderPreview = () => {
        return (
            <Paper className="preview-section" elevation={3}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1F2C40' }}>Preview</Typography>
                <Box sx={{ p: 2 }}>
                    {submittedVisit && (
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2C40', textAlign: 'center' }}>
                            Visit Code: {submittedVisit.unique_code}
                        </Typography>
                    )}

                    {/* Live Preview */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Guest Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography>{formData.guest ? `${formData.guest.fullName} (${formData.guest.email})` : 'No guest selected'}</Typography>
                        {formData.guest && formData.guest.is_vip && (
                            <Typography 
                                sx={{ 
                                    backgroundColor: '#FFD700',
                                    color: '#000',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'inline-block'
                                }}
                            >
                                VIP
                            </Typography>
                        )}
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Department</Typography>
                    <Typography>{formData.department?.departmentName || 'No department selected'}</Typography>
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Visit Details</Typography>
                    <Typography>
                        {formData.durationType === 'single' 
                            ? `Single Day: ${formData.visitDate ? new Date(formData.visitDate).toLocaleDateString() : 'Not set'}`
                            : `Date Range: ${formData.dateRange?.[0] ? new Date(formData.dateRange[0]).toLocaleDateString() : 'Not set'} - ${formData.dateRange?.[1] ? new Date(formData.dateRange[1]).toLocaleDateString() : 'Not set'}`
                        }
                    </Typography>
                    
                    {formData.hasCar && (
                        <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Car Details</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Plate Number</Typography>
                                    <Typography>{formData.plateNumber || 'Not set'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Model</Typography>
                                    <Typography>{formData.carModel || 'Not set'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Color</Typography>
                                    <Typography>{formData.carColor || 'Not set'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    
                    {formData.items?.length > 0 && (
                        <>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Items</Typography>
                            {formData.items.map((item, index) => (
                                <Typography key={index}>• {item}</Typography>
                            ))}
                        </>
                    )}
                    
                    {formData.remark && (
                        <>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Remarks</Typography>
                            <Typography>{formData.remark}</Typography>
                        </>
                    )}

                    {/* Submitted Data Preview */}
                    {submittedFormData && (
                        <>
                            <Box sx={{ mt: 4, pt: 3, borderTop: '2px dashed #ccc' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#1F2C40' }}>Submitted Visit Details</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Guest Information</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography>{submittedFormData.guest ? `${submittedFormData.guest.fullName} (${submittedFormData.guest.email})` : 'No guest selected'}</Typography>
                                    {submittedFormData.guest && submittedFormData.guest.is_vip && (
                                        <Typography 
                                            sx={{ 
                                                backgroundColor: '#FFD700',
                                                color: '#000',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                display: 'inline-block'
                                            }}
                                        >
                                            VIP
                                        </Typography>
                                    )}
                                </Box>
                                
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Department</Typography>
                                <Typography>{submittedFormData.department?.departmentName || 'No department selected'}</Typography>
                                
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Visit Details</Typography>
                                <Typography>
                                    {submittedFormData.durationType === 'single' 
                                        ? `Single Day: ${submittedFormData.visitDate ? new Date(submittedFormData.visitDate).toLocaleDateString() : 'Not set'}`
                                        : `Date Range: ${submittedFormData.dateRange?.[0] ? new Date(submittedFormData.dateRange[0]).toLocaleDateString() : 'Not set'} - ${submittedFormData.dateRange?.[1] ? new Date(submittedFormData.dateRange[1]).toLocaleDateString() : 'Not set'}`
                                    }
                                </Typography>
                                
                                {submittedFormData.hasCar && (
                                    <Box sx={{ 
                                        mt: 2, 
                                        p: 2, 
                                        backgroundColor: '#f5f5f5', 
                                        borderRadius: 1,
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Car Details</Typography>
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Plate Number</Typography>
                                                <Typography>{submittedFormData.plateNumber || 'Not set'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Model</Typography>
                                                <Typography>{submittedFormData.carModel || 'Not set'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Color</Typography>
                                                <Typography>{submittedFormData.carColor || 'Not set'}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                                
                                {submittedFormData.items?.length > 0 && (
                                    <>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Items</Typography>
                                        {submittedFormData.items.map((item, index) => (
                                            <Typography key={index}>• {item}</Typography>
                                        ))}
                                    </>
                                )}
                                
                                {submittedFormData.remark && (
                                    <>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Remarks</Typography>
                                        <Typography>{submittedFormData.remark}</Typography>
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Paper>
        );
    };

    return (
        <div className="visit-request-form">
            <Snackbar 
                open={showSuccess} 
                autoHideDuration={6000} 
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            sx={{ 
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Download
                        </Button>
                    }
                >
                    Visit request submitted successfully! Your unique code is: {submittedVisit?.unique_code}
                </Alert>
            </Snackbar>

            <Dialog 
                open={showPreviewDialog} 
                onClose={() => setShowPreviewDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" sx={{ color: '#1F2C40', fontWeight: 'bold' }}>
                        Visit Request Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {submittedFormData && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#1F2C40', textAlign: 'center' }}>
                                Visit Code: {submittedVisit?.unique_code}
                            </Typography>
                            
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Guest Information</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography>{submittedFormData.guest ? `${submittedFormData.guest.fullName} (${submittedFormData.guest.email})` : 'No guest selected'}</Typography>
                                {submittedFormData.guest && submittedFormData.guest.is_vip && (
                                    <Typography 
                                        sx={{ 
                                            backgroundColor: '#FFD700',
                                            color: '#000',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            display: 'inline-block'
                                        }}
                                    >
                                        VIP
                                    </Typography>
                                )}
                            </Box>
                            
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Department</Typography>
                            <Typography sx={{ mb: 2 }}>{submittedFormData.department?.departmentName || 'No department selected'}</Typography>
                            
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Visit Details</Typography>
                            <Typography sx={{ mb: 2 }}>
                                {submittedFormData.durationType === 'single' 
                                    ? `Single Day: ${submittedFormData.visitDate ? new Date(submittedFormData.visitDate).toLocaleDateString() : 'Not set'}`
                                    : `Date Range: ${submittedFormData.dateRange?.[0] ? new Date(submittedFormData.dateRange[0]).toLocaleDateString() : 'Not set'} - ${submittedFormData.dateRange?.[1] ? new Date(submittedFormData.dateRange[1]).toLocaleDateString() : 'Not set'}`
                                }
                            </Typography>
                            
                            {submittedFormData.hasCar && (
                                <Box sx={{ 
                                    mb: 2, 
                                    p: 2, 
                                    backgroundColor: '#f5f5f5', 
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Car Details</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Plate Number</Typography>
                                            <Typography>{submittedFormData.plateNumber || 'Not set'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Model</Typography>
                                            <Typography>{submittedFormData.carModel || 'Not set'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Color</Typography>
                                            <Typography>{submittedFormData.carColor || 'Not set'}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            
                            {submittedFormData.items?.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Items</Typography>
                                    {submittedFormData.items.map((item, index) => (
                                        <Typography key={index}>• {item}</Typography>
                                    ))}
                                </Box>
                            )}
                            
                            {submittedFormData.remark && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Remarks</Typography>
                                    <Typography>{submittedFormData.remark}</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setShowPreviewDialog(false)}
                        sx={{ color: '#1F2C40' }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDownload}
                        startIcon={<DownloadIcon />}
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#1F2C40',
                            '&:hover': {
                                backgroundColor: '#2C3E50'
                            }
                        }}
                    >
                        Download Details
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="visit-form-container">
                <div className="form-header">
                    <h2>Visit Request</h2>
                    <p>Fill in visit details</p>
                </div>
                <div className="form-layout">
                    <form onSubmit={handleSubmit} className="visit-form">
                        <div className="form-content">
                            <div className="form-fields">
                                <div className="form-group">
                                    <Autocomplete
                                        options={guests}
                                        getOptionLabel={(option) => option.fullName ? `${option.fullName} (${option.email})` : ''}
                                        value={formData.guest}
                                        onChange={(event, newValue) => {
                                            console.log('Selected guest:', newValue); // Debug log
                                            setFormData(prevState => ({
                                                ...prevState,
                                                guest: newValue
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Guest"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <Autocomplete
                                        options={departments}
                                        getOptionLabel={(option) => option.departmentName || option}
                                        value={formData.department}
                                        onChange={(event, newValue) => {
                                            if (!formData.department) {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    department: newValue
                                                }));
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Department"
                                                required
                                                disabled={!!formData.department}
                                            />
                                        )}
                                        disabled={!!formData.department}
                                    />
                                </div>
                                <div className="form-group">
                                    <FormControl fullWidth>
                                        <InputLabel id="duration-type-label">Duration</InputLabel>
                                        <Select
                                            labelId="duration-type-label"
                                            value={formData.durationType}
                                            label="Duration"
                                            onChange={handleDurationTypeChange}
                                            disabled={isSubmitting}
                                        >
                                            <MenuItem value="single">Single Day</MenuItem>
                                            <MenuItem value="range">Range</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                {formData.durationType === 'single' ? (
                                    <div className="form-group">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Visit Date"
                                                value={formData.visitDate}
                                                onChange={(newValue) => {
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        visitDate: newValue
                                                    }));
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                    />
                                                )}
                                                disabled={isSubmitting}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Start Date"
                                                        value={formData.dateRange[0]}
                                                        onChange={(newValue) => {
                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                dateRange: [newValue, prevState.dateRange[1]]
                                                            }));
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                required
                                                                disabled={isSubmitting}
                                                                fullWidth
                                                            />
                                                        )}
                                                        disabled={isSubmitting}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                            <div className="form-group">
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="End Date"
                                                        value={formData.dateRange[1]}
                                                        onChange={(newValue) => {
                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                dateRange: [prevState.dateRange[0], newValue]
                                                            }));
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                required
                                                                disabled={isSubmitting}
                                                                fullWidth
                                                            />
                                                        )}
                                                        disabled={isSubmitting}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="form-toggles">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.hasCar}
                                                onChange={handleToggleChange('hasCar')}
                                                color="primary"
                                                disabled={isSubmitting}
                                            />
                                        }
                                        label="Has Car"
                                    />
                                </div>
                                {formData.hasCar && (
                                    <div className="car-details">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <TextField
                                                    label="Plate Number"
                                                    name="plateNumber"
                                                    value={formData.plateNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className="form-group">
                                                <TextField
                                                    label="Car Model"
                                                    name="carModel"
                                                    value={formData.carModel}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className="form-group">
                                                <TextField
                                                    label="Car Color"
                                                    name="carColor"
                                                    value={formData.carColor}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="items-section">
                                    <label>Items Carrying</label>
                                    <div className="items-grid">
                                        {predefinedItems.map(item => (
                                            <FormControlLabel
                                                key={item}
                                                control={
                                                    <Checkbox
                                                        checked={item === 'Other' ? showOtherItemInput : formData.items.includes(item)}
                                                        onChange={handleItemChange(item)}
                                                        disabled={isSubmitting}
                                                    />
                                                }
                                                label={item}
                                            />
                                        ))}
                                    </div>
                                    {showOtherItemInput && (
                                        <div className="other-item-input">
                                            <input
                                                type="text"
                                                value={newItem}
                                                onChange={(e) => setNewItem(e.target.value)}
                                                placeholder="Enter item name"
                                                disabled={isSubmitting}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddNewItem}
                                                disabled={!newItem.trim() || isSubmitting}
                                                className="add-item-btn"
                                            >
                                                <AddIcon /> Add Item
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <TextField
                                        label="Remark"
                                        name="remark"
                                        value={formData.remark}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={2}
                                        fullWidth
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Visit Request'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    {renderPreview()}
                </div>
            </div>
            <div style={{ marginTop: 40 }}>
                <UserVisitRequestsTable />
            </div>
        </div>
    );
} 