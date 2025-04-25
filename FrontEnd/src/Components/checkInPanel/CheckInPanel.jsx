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
    Alert
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { format } from 'date-fns';

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Find visit by code or guest name
            const foundVisit = sampleVisits.find(v => 
                v.code.toLowerCase() === searchQuery.toLowerCase() || 
                v.guest.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (foundVisit) {
                setVisit(foundVisit);
                setError('');
            } else {
                setError('No visit found with the provided ID or guest name');
                // Clear error message after 3 seconds
                setTimeout(() => {
                    setError('');
                }, 3000);
                setVisit(null);
            }
        } catch (error) {
            setError('Error searching for visit');
            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
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
        setLoading(true);
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setVisit(prev => ({
                ...prev,
                checkedIn: new Date().toISOString()
            }));
            setSuccess('Guest checked in successfully');
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (error) {
            setError('Failed to check in guest');
            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setVisit(prev => ({
                ...prev,
                checkedOut: new Date().toISOString()
            }));
            setSuccess('Guest checked out successfully');
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (error) {
            setError('Failed to check out guest');
            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
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
                        <SearchIcon sx={{ fontSize: 20 }} /> 
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

            {visit && visit.status === 'approved' && (
                <Paper className="visit-details">
                    <div className="section-header">
                        <Typography variant="h6">Visit Details</Typography>
                        <Chip
                            label={visit.checkedOut ? 'Checked Out' : (visit.checkedIn ? 'Checked In' : 'Not Checked In')}
                            color={visit.checkedOut ? 'default' : (visit.checkedIn ? 'success' : 'warning')}
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
                                    <Typography variant="body1">{visit.guest.fullName}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Phone</Typography>
                                    <Typography variant="body1">{visit.guest.phone}</Typography>
                                </div>
                                {visit.guest.isVip && (
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
                                    <Typography variant="body2" color="textSecondary">Date</Typography>
                                    <Typography variant="body1">
                                        {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                                    </Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Duration</Typography>
                                    <Typography variant="body1">{visit.duration}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Department</Typography>
                                    <Typography variant="body1">{visit.department}</Typography>
                                </div>
                                <div className="info-item">
                                    <Typography variant="body2" color="textSecondary">Requester</Typography>
                                    <Typography variant="body1">{visit.requester}</Typography>
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
                                        <Typography variant="body2" color="textSecondary">Plate Number</Typography>
                                        <Typography variant="body1">{visit.car.plateNumber}</Typography>
                                    </div>
                                    <div className="info-item">
                                        <Typography variant="body2" color="textSecondary">Model</Typography>
                                        <Typography variant="body1">{visit.car.model}</Typography>
                                    </div>
                                    <div className="info-item">
                                        <Typography variant="body2" color="textSecondary">Color</Typography>
                                        <Typography variant="body1">{visit.car.color}</Typography>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="details-section">
                            <Typography variant="subtitle1" className="section-title">
                                Items
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {visit.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <Divider className="actions-divider" />

                    <div className="actions-section">
                        {(error || success) && (
                            <div className="action-alerts">
                                {error && <Alert severity="error" className="alert-message">{error}</Alert>}
                                {success && <Alert severity="success" className="alert-message">{success}</Alert>}
                            </div>
                        )}
                        {visit.checkedOut ? (
                            <button
                                className="completed-button"
                                disabled={true}
                            >
                                <CheckCircleIcon sx={{ fontSize: 20 }} />
                                Checked Out
                            </button>
                        ) : (
                            <>
                                {!visit.checkedIn ? (
                                    <button
                                        className="check-in-button"
                                        onClick={handleCheckIn}
                                        disabled={loading}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                                        Check In
                                    </button>
                                ) : (
                                    <button
                                        className="check-out-button"
                                        onClick={handleCheckOut}
                                        disabled={loading}
                                    >
                                        <LogoutIcon sx={{ fontSize: 20 }} />
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
