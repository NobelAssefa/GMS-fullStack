import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 