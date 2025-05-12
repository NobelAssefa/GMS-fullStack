import React, { useState } from 'react';
import './checkInPanel.css';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { format } from 'date-fns';
import checkInService from '../../Services/checkInService';

// Sample visit data for demonstration
const sampleVisits = [
    {
        id: 1,
        code: 'VISIT123',
        guest: {
            fullName: 'John Doe',
            phone: '+1234567890',
            isVip: true
        },
        visitDate: '2024-03-25',
        duration: '2 hours',
        department: 'Information Technology',
        requester: 'Sarah Johnson',
        car: {
            plateNumber: 'ABC123',
            model: 'Toyota Camry',
            color: 'Silver'
        },
        items: [
            { id: 1, name: 'Laptop' },
            { id: 2, name: 'Phone' },
            { id: 3, name: 'Tablet' }
        ],
        status: 'approved',
        checkedIn: null,
        checkedOut: null
    },
    {
        id: 2,
        code: 'VISIT456',
        guest: {
            fullName: 'Jane Smith',
            phone: '+0987654321',
            isVip: false
        },
        visitDate: '2024-03-26',
        duration: '1 hour',
        department: 'Human Resources',
        requester: 'Mike Brown',
        car: null,
        items: [
            { id: 1, name: 'Phone' }
        ],
        status: 'approved',
        checkedIn: '2024-03-26T09:30:00',
        checkedOut: null
    },
    {
        id: 3,
        code: 'VISIT789',
        guest: {
            fullName: 'Robert Wilson',
            phone: '+1122334455',
            isVip: true
        },
        visitDate: '2024-03-27',
        duration: '3 hours',
        department: 'Finance',
        requester: 'Emily Davis',
        car: {
            plateNumber: 'XYZ789',
            model: 'Honda Accord',
            color: 'Black'
        },
        items: [
            { id: 1, name: 'Laptop' },
            { id: 2, name: 'Camera' }
        ],
        status: 'approved',
        checkedIn: '2024-03-27T10:15:00',
        checkedOut: '2024-03-27T13:15:00'
    }
];

export default function CheckInPanel() {
    const [searchQuery, setSearchQuery] = useState('');
    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const foundVisit = await checkInService.searchVisit(searchQuery);
            
            if (foundVisit) {
                if (!foundVisit.is_approved) {
                    setError('This visit has not been approved yet');
                    setTimeout(() => setError(''), 3000);
                    setVisit(null);
                } else {
                    setVisit(foundVisit);
                    setError('');
                }
            } else {
                setError('No approved visit found with the provided ID or guest name');
                setTimeout(() => setError(''), 3000);
                setVisit(null);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error searching for visit');
            setTimeout(() => setError(''), 3000);
            setVisit(null);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = () => {
        // QR code scanning integration would go here
        alert('QR Code scanning to be implemented');
    };

    const handleCheckIn = async () => {
        if (!visit?.unique_code) return;
        
        setLoading(true);
        try {
            await checkInService.checkIn(visit.unique_code);
            setVisit(prev => ({
                ...prev,
                checked_in: true
            }));
            setSuccess('Guest checked in successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to check in guest');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!visit?.unique_code) return;
        
        setLoading(true);
        try {
            await checkInService.checkOut(visit.unique_code);
            setVisit(prev => ({
                ...prev,
                checked_out: true
            }));
            setSuccess('Guest checked out successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to check out guest');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'warning';
        }
    };

    return (
        <div className="check-in-panel">
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-container">
                    <div className="search-input">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Visit ID or Guest Name..."
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="search-button" disabled={loading || !searchQuery.trim()}>
                        {loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon sx={{ fontSize: 20 }} />}
                    </button>
                    <button 
                        type="button" 
                        className="qr-button" 
                        title="Scan QR Code" 
                        onClick={handleScan}
                        disabled={loading}
                    >
                        <QrCodeScannerIcon sx={{ fontSize: 20 }} />
                    </button>
                </form>
            </div>

            {visit && visit.is_approved && (
                <Paper className="visit-details">
                    <div className="section-header">
                        <Typography variant="h6">Visit Details</Typography>
                        <Chip
                            label={visit.checked_out ? 'Checked Out' : (visit.checked_in ? 'Checked In' : 'Not Checked In')}
                            color={visit.checked_out ? 'default' : (visit.checked_in ? 'success' : 'warning')}
                        />
                    </div>
                    <Divider />

                    <div className="details-grid">
                        <div className="details-section">
                            <Typography variant="subtitle1" className="section-title">
                                Guest Information
                            </Typography>
                            <div className="info-row">
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Full Name</Typography>
                                    <Typography variant="body1">{visit.guest_id.fullname}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Phone</Typography>
                                    <Typography variant="body1">{visit.guest_id.phone}</Typography>
                                </div>
                                {visit.guest_id.isVip && (
                                    <Chip label="VIP" color="primary" size="small" className="vip-chip" />
                                )}
                            </div>
                        </div>

                        <div className="details-section">
                            <Typography variant="subtitle1" className="section-title">
                                Visit Information
                            </Typography>
                            <div className="info-row">
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Visit Code</Typography>
                                    <Typography variant="body1">{visit.unique_code}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Date</Typography>
                                    <Typography variant="body1">
                                        {format(new Date(visit.visit_date), 'MMM dd, yyyy')}
                                    </Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Duration</Typography>
                                    <Typography variant="body1">{visit.duration}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Department</Typography>
                                    <Typography variant="body1">{visit.department_id.department_name}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Requester</Typography>
                                    <Typography variant="body1">{visit.user_id.fullname}</Typography>
                                </div>
                            </div>
                        </div>

                        {visit.car && (
                            <div className="details-section">
                                <Typography variant="subtitle1" className="section-title">
                                    Car Information
                                </Typography>
                                <div className="info-row">
                                    <div className="info-item">
                                        <Typography variant="body2" color="textSecondary">Car Name</Typography>
                                        <Typography variant="body1">{visit.car.car_name}</Typography>
                                    </div>
                                </div>
                            </div>
                        )}

                        {visit.items && visit.items.length > 0 && (
                            <div className="details-section">
                                <Typography variant="subtitle1" className="section-title">
                                    Items
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Serial Number</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {visit.items.map((item) => (
                                                <TableRow key={item._id}>
                                                    <TableCell>{item.item_name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{item.serial_number}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </div>

                    <Divider className="actions-divider" />

                    <div className="actions-section">
                        {(error || success) && (
                            <div className="action-alerts">
                                {error && <Alert severity="error" className="alert-message">{error}</Alert>}
                                {success && <Alert severity="success" className="alert-message">{success}</Alert>}
                            </div>
                        )}
                        {visit.checked_out ? (
                            <button
                                className="completed-button"
                                disabled={true}
                            >
                                <CheckCircleIcon sx={{ fontSize: 20 }} />
                                Checked Out
                            </button>
                        ) : (
                            <>
                                {!visit.checked_in ? (
                                    <button
                                        className="check-in-button"
                                        onClick={handleCheckIn}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: 20 }} />}
                                        Check In
                                    </button>
                                ) : (
                                    <button
                                        className="check-out-button"
                                        onClick={handleCheckOut}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon sx={{ fontSize: 20 }} />}
                                        Check Out
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </Paper>
            )}
        </div>
    );
}
