import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

export default function UserVisitRequestsTable() {
    const { user } = useSelector((state) => state.auth);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const response = await axios.get(`/api/visit/getvisitsByuserId/${user._id}`, { 
                    withCredentials: true 
                });
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
            'Guest': visit.guest_id ? `${visit.guest_id.fullName} (${visit.guest_id.email})` : 'N/A',
            'Department': visit.department_id?.departmentName || 'N/A',
            'Visit Date': visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : 'N/A',
            'Duration': visit.duration ? (typeof visit.duration === 'string' ? visit.duration : (Array.isArray(visit.duration) ? visit.duration.map(d => new Date(d).toLocaleDateString()).join(' - ') : '-')) : 'N/A',
            'Status': visit.is_approved ? 'Approved' : 'Pending',
            'Check-in Status': visit.checked_in ? 'Checked In' : 'Not Checked In',
            'Check-out Status': visit.checked_out ? 'Checked Out' : 'Not Checked Out'
        };

        const content = Object.entries(visitDetails)
            .map(([key, value]) => `${key}: ${value}`)
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

    if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!visits.length) return <Typography>No visit requests found.</Typography>;

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ m: 2 }}>My Visit Requests</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Guest</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Visit Date</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visits.map((visit) => (
                        <TableRow key={visit._id}>
                            <TableCell>{visit.guest_id?.fullName || '-'}</TableCell>
                            <TableCell>{visit.department_id?.departmentName || '-'}</TableCell>
                            <TableCell>{visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>{visit.duration ? (typeof visit.duration === 'string' ? visit.duration : (Array.isArray(visit.duration) ? visit.duration.map(d => new Date(d).toLocaleDateString()).join(' - ') : '-')) : '-'}</TableCell>
                            <TableCell>{visit.is_approved ? 'Approved' : 'Pending'}</TableCell>
                            <TableCell>
                                <Tooltip title="Download Visit Details">
                                    <IconButton 
                                        onClick={() => handleDownload(visit)}
                                        size="small"
                                        sx={{ 
                                            color: '#1F2C40',
                                            '&:hover': {
                                                backgroundColor: 'rgba(31, 44, 64, 0.1)'
                                            }
                                        }}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 