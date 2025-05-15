import React, { useState, useEffect } from 'react';
import './visitRequestForm.css';
import { Autocomplete, TextField, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Paper, Typography, Box, Button, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { QRCodeCanvas } from 'qrcode.react';
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
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false); // New state for email sending status

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

    const handleClosePreviewDialog = () => {
        setShowPreviewDialog(false);
        setSubmittedVisit(null); // Clear submitted data to remove preview
        setSubmittedFormData(null);
        setIsSendingEmail(false); // Reset email sending state if dialog is closed
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
        handleClosePreviewDialog(); // Close dialog after download
    };

    const handleSendEmailToGuest = async () => {
        if (!submittedVisit || !submittedFormData || !submittedFormData.guest?.email) {
            console.error("Missing data to send email.");
            // Optionally, show an alert to the user
            alert("Guest email is missing. Cannot send email.");
            return;
        }
        setIsSendingEmail(true);
        console.log("Attempting to send email to:", submittedFormData.guest.email);
        // TODO: Construct email data and call a service
        
        // Placeholder for now:
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            alert(`Email would be sent to ${submittedFormData.guest.email} with details for visit ${submittedVisit.unique_code}`);
            // On actual success from backend:
            // handleClosePreviewDialog(); // Optionally close dialog after sending
        } catch (error) {
            console.error("Failed to send email:", error);
            alert("Failed to send email. Please try again.");
        } finally {
            setIsSendingEmail(false);
        }
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
                </Box>
            </Paper>
        );
    };

    return (
        <div className="visit-request-form">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Dialog open={showPreviewDialog} onClose={handleClosePreviewDialog} className="success-dialog">
                    <DialogTitle className="success-dialog-title">
                        {submittedVisit ? "Visit Request Submitted!" : "Preview Visit Request"}
                    </DialogTitle>
                    <DialogContent className="success-dialog-content">
                        {submittedVisit && submittedFormData ? (
                            <>
                                <Typography>Your visit request has been successfully submitted.</Typography>
                                <Typography>Visit Code: <span className="visit-code">{submittedVisit.unique_code}</span></Typography>
                                
                                {/* QR Code Display Start */}
                                <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ mb: 1, color: '#1F2C40'}}>Scan for Visit Details</Typography>
                                    {
                                        (() => {
                                            const qrDetails = [
                                                `Visit Code: ${submittedVisit.unique_code}`,
                                                `Guest: ${submittedFormData.guest?.fullName || 'N/A'}`,
                                                `Department: ${submittedFormData.department?.departmentName || 'N/A'}`,
                                                `Date(s): ${submittedFormData.durationType === 'single'
                                                    ? new Date(submittedFormData.visitDate).toLocaleDateString()
                                                    : `${new Date(submittedFormData.dateRange[0]).toLocaleDateString()} - ${new Date(submittedFormData.dateRange[1]).toLocaleDateString()}`}`
                                            ];
                                            if (submittedFormData.hasCar) {
                                                qrDetails.push(`Car: ${submittedFormData.plateNumber} (${submittedFormData.carModel}, ${submittedFormData.carColor})`);
                                            }
                                            if (submittedFormData.items && submittedFormData.items.length > 0) {
                                                qrDetails.push(`Items: ${submittedFormData.items.join(', ')}`);
                                            }
                                            const qrValue = qrDetails.join('\n');

                                            return (
                                                <QRCodeCanvas 
                                                    value={qrValue} 
                                                    size={160} // Increased size slightly for more data
                                                    bgColor={"#ffffff"}
                                                    fgColor={"#000000"}
                                                    level={"L"} 
                                                    includeMargin={true}
                                                />
                                            );
                                        })()
                                    }
                                </Box>
                                {/* QR Code Display End */}

                                <Typography>Guest: {submittedFormData.guest?.fullName}</Typography>
                                <Typography>Department: {submittedFormData.department?.departmentName}</Typography>
                                <Typography>
                                    Visit Date: {submittedFormData.durationType === 'single'
                                        ? new Date(submittedFormData.visitDate).toLocaleDateString()
                                        : `${new Date(submittedFormData.dateRange[0]).toLocaleDateString()} - ${new Date(submittedFormData.dateRange[1]).toLocaleDateString()}`}
                                </Typography>
                                {submittedFormData.hasCar && (
                                    <Typography>
                                        Car: {submittedFormData.plateNumber} ({submittedFormData.carModel}, {submittedFormData.carColor})
                                    </Typography>
                                )}
                                {submittedFormData.items && submittedFormData.items.length > 0 && (
                                    <Typography>Items: {submittedFormData.items.join(', ')}</Typography>
                                )}
                            </>
                        ) : (
                            <Typography>Loading preview...</Typography> // Or some other placeholder
                        )}
                    </DialogContent>
                    <DialogActions className="success-dialog-actions">
                        {submittedVisit && (
                            <Button onClick={handleDownload} variant="contained" startIcon={<DownloadIcon />}>
                                Download Details
                            </Button>
                        )}
                        {submittedVisit && submittedFormData?.guest?.email && ( // Show button only if guest email exists
                            <Button 
                                onClick={handleSendEmailToGuest} 
                                variant="outlined" 
                                disabled={isSendingEmail}
                                // sx={{ ml: 1 }} // Optional margin
                            >
                                {isSendingEmail ? "Sending..." : "Send to Guest Email"}
                            </Button>
                        )}
                        <Button onClick={handleClosePreviewDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>

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