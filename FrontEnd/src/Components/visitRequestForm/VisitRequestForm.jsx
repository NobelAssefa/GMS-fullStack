import React, { useState, useEffect } from 'react';
import './visitRequestForm.css';
import { Autocomplete, TextField, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
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

    const [guests, setGuests] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtherItemInput, setShowOtherItemInput] = useState(false);
    const [newItem, setNewItem] = useState('');

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
            // Prepare data for backend
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
            await onSubmit(submitData);
            setFormData({
                guest: null,
                department: formData.department, // keep department selected
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

    return (
        <div className="visit-form-container">
            <div className="form-header">
                <h2>Visit Request</h2>
                <p>Fill in visit details</p>
            </div>
            <form onSubmit={handleSubmit} className="visit-form">
                <div className="form-content">
                    <div className="form-fields">
                        <div className="form-group">
                            <Autocomplete
                                options={guests}
                                getOptionLabel={(option) => option.fullName ? `${option.fullName} (${option.email})` : ''}
                                value={formData.guest}
                                onChange={(event, newValue) => {
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
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateRangePicker
                                        startText="Start Date"
                                        endText="End Date"
                                        value={formData.dateRange}
                                        onChange={(newValue) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                dateRange: newValue
                                            }));
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <>
                                                <TextField {...startProps} required disabled={isSubmitting} fullWidth />
                                                <span style={{ margin: '0 8px' }}>to</span>
                                                <TextField {...endProps} required disabled={isSubmitting} fullWidth />
                                            </>
                                        )}
                                        disabled={isSubmitting}
                                    />
                                </LocalizationProvider>
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
            <div style={{ marginTop: 40 }}>
                <UserVisitRequestsTable />
            </div>
        </div>
    );
} 