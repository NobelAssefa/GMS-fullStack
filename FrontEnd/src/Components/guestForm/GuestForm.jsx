import React, { useState } from 'react';
import './guestForm.css';
import { Avatar, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import PreviewIcon from '@mui/icons-material/Preview';
import GuestTable from './GuestTable';
import { useNavigate } from 'react-router-dom';

export default function GuestForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        isVip: false
    });
    const [profileImage, setProfileImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
            await onSubmit(submitData);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                isVip: false
            });
            setProfileImage(null);
            // Stay on the guest registration page after registration
            navigate('/guest/registration');
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
        </div>
    );

    return (
        <div className="guest-form-container">
            {isSubmitting && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <CircularProgress size={60} />
                </div>
            )}
            <div className="form-header">
                <h2>Guest Registration</h2>
                <p>Set guest details</p>
            </div>
            <div className="form-content">
                <form onSubmit={handleSubmit} className="guest-form">
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
                        <div className="form-group">
                            <label>Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                            />
                            {profileImage && (
                                <Avatar src={profileImage} alt="Profile Preview" sx={{ width: 56, height: 56, mt: 1 }} />
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
                </form>
                <PreviewCard />
            </div>
            <div className="table-section">
                <GuestTable />
            </div>
        </div>
    );
}
