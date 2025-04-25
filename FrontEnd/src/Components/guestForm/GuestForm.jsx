import React, { useState } from 'react';
import './guestForm.css';
import { Avatar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import PreviewIcon from '@mui/icons-material/Preview';

export default function GuestForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        isVip: false,
        hasCar: false,
        plateNumber: '',
        carModel: '',
        carColor: '',
        items: []
    });

    const [profileImage, setProfileImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtherItemInput, setShowOtherItemInput] = useState(false);
    const [newItem, setNewItem] = useState('');

    // Predefined items list
    const predefinedItems = ['Laptop', 'Phone', 'Tablet', 'Camera', 'Other'];

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
                // Remove any custom items when unchecking 'Other'
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const submitData = {
                ...formData,
                profileImage
            };

            // Only include car details if hasCar is true
            if (!submitData.hasCar) {
                delete submitData.plateNumber;
                delete submitData.carModel;
                delete submitData.carColor;
            }

            await onSubmit(submitData);
            
            // Reset form after successful submission
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                isVip: false,
                hasCar: false,
                plateNumber: '',
                carModel: '',
                carColor: '',
                items: []
            });
            setProfileImage(null);
            setShowOtherItemInput(false);
            setNewItem('');

        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const PreviewCard = () => (
        <div className="preview-card">
            <h3><PreviewIcon sx={{ fontSize: 20 }} /> Live Preview</h3>
            
            <div className="preview-section">
                <h4>Basic Information</h4>
                <div className="preview-field">
                    <span className="preview-label">Full Name:</span>
                    <span className="preview-value">
                        {formData.fullName || <span className="preview-empty">Not provided</span>}
                    </span>
                </div>
                <div className="preview-field">
                    <span className="preview-label">Email:</span>
                    <span className="preview-value">
                        {formData.email || <span className="preview-empty">Not provided</span>}
                    </span>
                </div>
                <div className="preview-field">
                    <span className="preview-label">Phone:</span>
                    <span className="preview-value">
                        {formData.phone || <span className="preview-empty">Not provided</span>}
                    </span>
                </div>
                <div className="preview-field">
                    <span className="preview-label">Status:</span>
                    <span className="preview-value">
                        {formData.isVip ? 'VIP Guest' : 'Regular Guest'}
                    </span>
                </div>
            </div>

            {formData.hasCar && (
                <div className="preview-section">
                    <h4>Vehicle Information</h4>
                    <div className="preview-field">
                        <span className="preview-label">Plate Number:</span>
                        <span className="preview-value">
                            {formData.plateNumber || <span className="preview-empty">Not provided</span>}
                        </span>
                    </div>
                    <div className="preview-field">
                        <span className="preview-label">Car Model:</span>
                        <span className="preview-value">
                            {formData.carModel || <span className="preview-empty">Not provided</span>}
                        </span>
                    </div>
                    <div className="preview-field">
                        <span className="preview-label">Car Color:</span>
                        <span className="preview-value">
                            {formData.carColor || <span className="preview-empty">Not provided</span>}
                        </span>
                    </div>
                </div>
            )}

            <div className="preview-section">
                <h4>Items Carrying</h4>
                {formData.items.length > 0 ? (
                    <div className="preview-items">
                        {formData.items.map((item, index) => (
                            <span key={index} className="preview-item-chip">{item}</span>
                        ))}
                    </div>
                ) : (
                    <span className="preview-empty">No items selected</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="guest-form-container">
            <div>
                <div className="form-header">
                    <h2>Guest Registration</h2>
                    <p>Set guest details</p>
                </div>
                
                <form onSubmit={handleSubmit} className="guest-form">
                    <div className="form-content">
                        <div className="form-fields">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isVip}
                                        onChange={handleToggleChange('isVip')}
                                        disabled={isSubmitting}
                                    />
                                }
                                label="VIP Guest"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.hasCar}
                                        onChange={handleToggleChange('hasCar')}
                                        disabled={isSubmitting}
                                    />
                                }
                                label="Has Car"
                            />

                            {formData.hasCar && (
                                <div className="car-details">
                                    <div className="form-group">
                                        <label>Plate Number</label>
                                        <input
                                            type="text"
                                            name="plateNumber"
                                            value={formData.plateNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter plate number"
                                            required={formData.hasCar}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Car Model</label>
                                        <input
                                            type="text"
                                            name="carModel"
                                            value={formData.carModel}
                                            onChange={handleInputChange}
                                            placeholder="Enter car model"
                                            required={formData.hasCar}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Car Color</label>
                                        <input
                                            type="text"
                                            name="carColor"
                                            value={formData.carColor}
                                            onChange={handleInputChange}
                                            placeholder="Enter car color"
                                            required={formData.hasCar}
                                            disabled={isSubmitting}
                                        />
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

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register Guest'}
                                </button>
                            </div>
                        </div>

                        <div className="profile-image-section">
                            <Avatar
                                src={profileImage}
                                alt="Profile Preview"
                                sx={{ width: 120, height: 120 }}
                            />
                            <div className="image-upload">
                                <label htmlFor="profile-image" className="upload-button">
                                    <CloudUploadIcon /> Edit photo
                                </label>
                                <input
                                    type="file"
                                    id="profile-image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <PreviewCard />
        </div>
    );
}
