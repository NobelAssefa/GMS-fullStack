import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    Chip,
    CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import visitApprovalService from '../../Services/visitApprovalService';
import guestService from '../../Services/guestService';
export default function UserVisitRequestsTable() {
    const { user } = useSelector((state) => state.auth);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        const fetchVisits = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user?._id) {
                    console.log('No user ID found in Redux state:', user);
                    setError('User not authenticated');
                    return;
                }
                console.log('Fetching visits for user:', user._id);
                const response = await guestService.getAllVisitByUserId(user._id)
                console.log('Fetched visits response:', response);
                if (Array.isArray(response.data)) {
                    setVisits(response.data);
                } else if (response.data && Array.isArray(response.data.visits)) {
                    setVisits(response.data.visits);
                } else {
                    console.log('Unexpected response format:', response.data);
                    setVisits([]);
                }
            } catch (err) {
                console.error('Error fetching visits:', err);
                setError(err.response?.data?.message || 'Failed to fetch visit requests');
            } finally {
                setLoading(false);
            }
        };
        fetchVisits();
    }, [user]);

    const handleDownload = (visit) => {
        const visitDetails = {
            'Visit Code': visit.unique_code,
            'Guest': visit.guest ? `${visit.guest.fullName} (${visit.guest.email})` : 'N/A',
            'Department': visit.department?.departmentName || 'N/A',
            'Visit Date': visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : 'N/A',
            'Status': visit.is_approved ? 'Approved' : visit.is_rejected ? 'Rejected' : 'Pending',
            'Car Details': visit.car ? {
                'Plate Number': visit.car.plateNumber,
                'Model': visit.car.carModel,
                'Color': visit.car.carColor
            } : 'No car registered',
            'Items': visit.items?.length > 0 ? visit.items.join(', ') : 'No items',
            'Remarks': visit.remark || 'No remarks'
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
        a.download = `visit-request-${visit.unique_code}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleApprove = async (visit) => {
        try {
            setLoading(true);
            await visitApprovalService.approveVisit(visit._id);
            if (onVisitUpdate) {
                onVisitUpdate();
            }
        } catch (error) {
            console.error('Error approving visit:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedVisit || !rejectReason.trim()) return;

        try {
            setLoading(true);
            await visitApprovalService.rejectVisit(selectedVisit._id, rejectReason);
            setShowRejectDialog(false);
            setRejectReason('');
            if (onVisitUpdate) {
                onVisitUpdate();
            }
        } catch (error) {
            console.error('Error rejecting visit:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (visit) => {
        if (visit.is_approved) {
            return <Chip label="Approved" color="success" size="small" />;
        } else if (visit.is_rejected) {
            return <Chip label="Rejected" color="error" size="small" />;
        }
        return <Chip label="Pending" color="warning" size="small" />;
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!visits.length) return <Typography>No visit requests found.</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1F2C40' }}>
                Your Visit Requests
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Visit Code</TableCell>
                            <TableCell>Guest</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Visit Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visits.map((visit) => (
                            <TableRow key={visit._id}>
                                <TableCell>{visit.unique_code}</TableCell>
                                <TableCell>
                                    {visit.guest ? `${visit.guest.fullName} (${visit.guest.email})` : 'N/A'}
                                </TableCell>
                                <TableCell>{visit.department?.departmentName || 'N/A'}</TableCell>
                                <TableCell>
                                    {visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>{getStatusChip(visit)}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Download Details">
                                            <IconButton
                                                onClick={() => handleDownload(visit)}
                                                size="small"
                                                sx={{ color: '#1F2C40' }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {!visit.is_approved && !visit.is_rejected && (
                                            <>
                                                <Tooltip title="Approve Visit">
                                                    <IconButton
                                                        onClick={() => handleApprove(visit)}
                                                        size="small"
                                                        color="success"
                                                        disabled={loading}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject Visit">
                                                    <IconButton
                                                        onClick={() => {
                                                            setSelectedVisit(visit);
                                                            setShowRejectDialog(true);
                                                        }}
                                                        size="small"
                                                        color="error"
                                                        disabled={loading}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog 
                open={showRejectDialog} 
                onClose={() => setShowRejectDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Reject Visit Request</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setShowRejectDialog(false)}
                        sx={{ color: '#1F2C40' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReject}
                        variant="contained"
                        color="error"
                        disabled={!rejectReason.trim() || loading}
                    >
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 