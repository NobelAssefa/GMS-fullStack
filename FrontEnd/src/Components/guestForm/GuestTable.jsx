import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Chip,
    Tooltip,
    TablePagination,
    Box,
    Typography
} from '@mui/material';
import {
    DirectionsCar as CarIcon,
    Star as VipIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import './guestTable.css';
import guestService from '../../Services/guestService';

export default function GuestTable() {
    const [guests, setGuests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuests = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await guestService.getAllGuests();
                console.log('Fetched guests data:', data);
                if (Array.isArray(data)) {
                    setGuests(data);
                } else if (data && Array.isArray(data.guests)) {
                    setGuests(data.guests);
                } else {
                    setGuests([]);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch guests');
            } finally {
                setLoading(false);
            }
        };
        fetchGuests();
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredGuests = guests.filter(guest => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (guest.fullName && guest.fullName.toLowerCase().includes(searchLower)) ||
            (guest.email && guest.email.toLowerCase().includes(searchLower)) ||
            (guest.phone && guest.phone.toLowerCase().includes(searchLower)) ||
            (guest.car && guest.car.plateNumber && guest.car.plateNumber.toLowerCase().includes(searchLower))
        );
    });

    const paginatedGuests = filteredGuests.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="guest-table-container">
            <Box className="table-header">
                <Typography variant="h6" component="h2">
                    Registered Guests
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search guests..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" />,
                    }}
                />
            </Box>

            {loading ? (
                <Typography variant="body1" sx={{ p: 2 }}>Loading guests...</Typography>
            ) : error ? (
                <Typography variant="body1" color="error" sx={{ p: 2 }}>{error}</Typography>
            ) : (
                <TableContainer component={Paper} className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                         
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedGuests.map((guest) => (
                                <TableRow key={guest._id}>
                                    <TableCell>{guest.fullName}</TableCell>
                                    <TableCell>{guest.email}</TableCell>
                                    <TableCell>{guest.phone}</TableCell>
                                    <TableCell>
                                        {guest.is_vip?(
                                            <Chip
                                                icon={<VipIcon />}
                                                label="VIP"
                                                color="primary"
                                                size="small"
                                            />
                                        ): "Regular"}
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <TablePagination
                component="div"
                count={filteredGuests.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </div>
    );
} 