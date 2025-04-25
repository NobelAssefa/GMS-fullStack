import React, { useState, useEffect } from 'react';
import './visitRequestForm.css';
import { Autocomplete, TextField, Switch, FormControlLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';

export default function VisitRequestForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        guest: null,
        department: '',
        visitDate: null,
        isVip: false,
        hasCar: false,
        plateNumber: '',
        carModel: '',
        carColor: '',
        items: [],
        remark: ''
    });

    // Mock data for guests - replace with actual API call
    const [guests, setGuests] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtherItemInput, setShowOtherItemInput] = useState(false);
    const [newItem, setNewItem] = useState('');

    // Predefined lists
    const predefinedItems = ['Laptop', 'Phone', 'Tablet', 'Camera', 'Other'];
    const departments = [
        'Human Resources',
        'Information Technology',
        'Finance',
        'Operations',
        'Marketing',
        'Research & Development',
        'Legal',
        'Administration'
    ];

    useEffect(() => {
        // Mock guest data - replace with actual API call
        const mockGuests = [
            { id: 1, fullName: 'John Doe', email: 'john@example.com' },
            { id: 2, fullName: 'Jane Smith', email: 'jane@example.com' },
            // Add more mock data as needed
        ];
        setGuests(mockGuests);
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const submitData = {
                ...formData,
            };

            if (!submitData.hasCar) {
                delete submitData.plateNumber;
                delete submitData.carModel;
                delete submitData.carColor;
            }

            await onSubmit(submitData);
            
            // Reset form
            setFormData({
                guest: null,
                department: '',
                visitDate: null,
                isVip: false,
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
                                getOptionLabel={(option) => `${option.fullName} (${option.email})`}
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
                                value={formData.department}
                                onChange={(event, newValue) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        department: newValue
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Department"
                                        required
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </div>

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

                        <div className="form-toggles">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isVip}
                                        onChange={handleToggleChange('isVip')}
                                        color="primary"
                                        disabled={isSubmitting}
                                    />
                                }
                                label="VIP Visit"
                            />
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
                        )}

                        <div className="items-section">
                            <h3>Items Carrying</h3>
                            <div className="items-grid">
                                {predefinedItems.map((item) => (
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
                                    <div className="input-with-button">
                                        <TextField
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            placeholder="Enter item name"
                                            disabled={isSubmitting}
                                            fullWidth
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddNewItem}
                                            disabled={!newItem.trim() || isSubmitting}
                                            className="add-item-button"
                                        >
                                            <AddIcon />
                                        </button>
                                    </div>
                                    {formData.items.filter(item => !predefinedItems.includes(item)).length > 0 && (
                                        <div className="custom-items-list">
                                            {formData.items
                                                .filter(item => !predefinedItems.includes(item))
                                                .map((item, index) => (
                                                    <div key={index} className="custom-item">
                                                        <span>{item}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prevState => ({
                                                                    ...prevState,
                                                                    items: prevState.items.filter(i => i !== item)
                                                                }));
                                                            }}
                                                            className="remove-item-button"
                                                            disabled={isSubmitting}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <TextField
                                label="Remarks"
                                name="remark"
                                value={formData.remark}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                disabled={isSubmitting}
                                fullWidth
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button type="button" className="cancel-button" disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
} 