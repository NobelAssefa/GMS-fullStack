import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Button,
    Modal,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    Tooltip,
    TableSortLabel,
    Divider,
    Grid,
    CircularProgress,
    InputAdornment,
    Switch,
    FormGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import './visitApproval.css';
import visitApprovalService from '../../Services/visitApprovalService';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflow: 'auto'
};

export default function VisitApprovalPage() {
    const [visits, setVisits] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState('');
    const [description, setDescription] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');
    const [order, setOrder] = useState('desc');
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [dense, setDense] = useState(false);
    const [activityPage, setActivityPage] = useState(0);
    const [activityRowsPerPage, setActivityRowsPerPage] = useState(5);

    useEffect(() => {
        fetchVisits();
        fetchActivityLog();
    }, []);

    const fetchVisits = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/visit//getvisits', { withCredentials: true });
            if (Array.isArray(response.data)) {
                setVisits(response.data);
            } else if (response.data && Array.isArray(response.data.visits)) {
                setVisits(response.data.visits);
            } else {
                setVisits([]);
            }
        } catch (err) {
            console.error('Error fetching visits:', err);
            setError(err.response?.data?.message || 'Failed to fetch visit requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityLog = async () => {
        try {
            const response = await axios.get('/api/visit/getvisits', { withCredentials: true });
            setActivityLog(response.data || []);
        } catch (err) {
            setActivityLog([]);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortData = (data) => {
        if (!data || !Array.isArray(data)) return [];
        return [...data].sort((a, b) => {
            let aValue = '';
            let bValue = '';
            if (orderBy.includes('.')) {
                const keys = orderBy.split('.');
                aValue = keys.reduce((obj, key) => obj?.[key] ?? '', a) || '';
                bValue = keys.reduce((obj, key) => obj?.[key] ?? '', b) || '';
            } else {
                aValue = a?.[orderBy] ?? '';
                bValue = b?.[orderBy] ?? '';
            }
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                if (order === 'desc') {
                    return bValue.localeCompare(aValue);
                }
                return aValue.localeCompare(bValue);
            }
            if (orderBy === 'created_at' || orderBy === 'action_date') {
                const dateA = aValue ? new Date(aValue).getTime() : 0;
                const dateB = bValue ? new Date(bValue).getTime() : 0;
                return order === 'desc' ? dateB - dateA : dateA - dateB;
            }
            if (order === 'desc') {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleActivityPage = (event, newPage) => {
        setActivityPage(newPage);
    };
    const handleActivityRowsPerPage = (event) => {
        setActivityRowsPerPage(parseInt(event.target.value, 10));
        setActivityPage(0);
    };
    const handleOpenModal = (visit) => {
        setSelectedVisit(visit);
        setApprovalStatus('');
        setDescription('');
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedVisit(null);
        setApprovalStatus('');
        setDescription('');
    };
    const handleSubmitApproval = async () => {
        if (!approvalStatus || !selectedVisit) return;
        try {
            setLoading(true);
            if (approvalStatus === 'approved') {
                await visitApprovalService.approveVisit(selectedVisit._id);
            } else {
                await visitApprovalService.rejectVisit(selectedVisit._id, description);
            }
            await fetchVisits();
            await fetchActivityLog();
            handleCloseModal();
        } catch (error) {
            console.error('Error submitting approval:', error);
            setError(error.response?.data?.message || 'Failed to submit approval');
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };
    const getStatusChip = (visit) => {
        if (visit.is_approved || visit.status === 'approved') {
            return <Chip label="Approved" color="success" size="small" />;
        } else if (visit.is_rejected || visit.status === 'rejected') {
            return <Chip label="Rejected" color="error" size="small" />;
        }
        return <Chip label="Pending" color="warning" size="small" />;
    };
    const renderSortLabel = (property, label) => (
        <TableSortLabel
            active={orderBy === property}
            direction={orderBy === property ? order : 'asc'}
            onClick={() => handleRequestSort(property)}
        >
            {label}
        </TableSortLabel>
    );
    const renderActionColumn = (visit) => {
        if (visit.is_approved || visit.status === 'approved' || visit.is_rejected || visit.status === 'rejected') {
            return (
                <Tooltip title={visit.is_approved || visit.status === 'approved' ? "Approved" : "Rejected"}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: visit.is_approved || visit.status === 'approved' ? 'success.main' : 'error.main' }}>
                        {visit.is_approved || visit.status === 'approved' ? <CheckCircleIcon /> : <CancelIcon />}
                        <Typography variant="body2">{visit.is_approved || visit.status === 'approved' ? 'Approved' : 'Rejected'}</Typography>
                    </Box>
                </Tooltip>
            );
        }
        return (
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleOpenModal(visit)}
                startIcon={<PendingIcon />}
                disabled={loading}
            >
                Review
            </Button>
        );
    };
    // --- SEARCH FILTER ---
    const filteredVisits = sortData(visits).filter((visit) => {
        const searchLower = search.toLowerCase();
        return (
            visit.unique_code?.toLowerCase().includes(searchLower) ||
            visit.guest?.fullName?.toLowerCase().includes(searchLower) ||
            visit.guest?.email?.toLowerCase().includes(searchLower) ||
            visit.department?.departmentName?.toLowerCase().includes(searchLower)
        );
    });
    // --- ACTIVITY LOG PAGINATION ---
    const paginatedActivityLog = activityLog.slice(activityPage * activityRowsPerPage, activityPage * activityRowsPerPage + activityRowsPerPage);
    if (loading && !visits.length) {
        return (
            <div className="loading-state">
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading visits...</Typography>
            </div>
        );
    }
    if (error) {
        return (
            <div className="error-state">
                <Typography color="error">{error}</Typography>
            </div>
        );
    }
    return (
        <div className="visit-approval-page">
            <div className="page-header">
                <Typography variant="h3" component="h1" className="header-title">
                    Visit Approval
                </Typography>
                <Typography variant="subtitle1" className="header-subtitle">
                    Review Visit Requests
                </Typography>
            </div>
            {/* SEARCH & DENSITY TOGGLE */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by code, guest, department..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    sx={{ minWidth: 260 }}
                />
                <FormGroup row sx={{ alignItems: 'center', ml: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={() => setDense(d => !d)} color="primary" />}
                        label="Compact Rows"
                    />
                </FormGroup>
            </Box>
            {!filteredVisits.length ? (
                <div className="empty-state">
                    <InboxIcon className="empty-state-icon" />
                    <Typography variant="h6">No Visits Found</Typography>
                </div>
            ) : (
                <TableContainer component={Paper} className="table-container">
                    <Table stickyHeader size={dense ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{renderSortLabel('unique_code', 'Visit Code')}</TableCell>
                                <TableCell>{renderSortLabel('guest.fullName', 'Guest')}</TableCell>
                                <TableCell>{renderSortLabel('department.departmentName', 'Department')}</TableCell>
                                <TableCell>{renderSortLabel('visit_date', 'Visit Date')}</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredVisits
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((visit) => (
                                    <TableRow
                                        key={visit._id}
                                        className="table-row"
                                        hover
                                        sx={{ transition: 'background 0.2s', '&:hover': { background: '#f0f7fa' } }}
                                    >
                                        <TableCell>{visit.unique_code}</TableCell>
                                        <TableCell>
                                            {visit.guest ? `${visit.guest.fullName} (${visit.guest.email})` : 'N/A'}
                                        </TableCell>
                                        <TableCell>{visit.department?.departmentName || 'N/A'}</TableCell>
                                        <TableCell>{formatDate(visit.visit_date)}</TableCell>
                                        <TableCell>{getStatusChip(visit)}</TableCell>
                                        <TableCell>{renderActionColumn(visit)}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredVisits.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}
            {/* Activity Log Section */}
            <Typography variant="h6" className="section-title" sx={{ mt: 4, mb: 2 }}>
                Activity Log
            </Typography>
            <TableContainer component={Paper} className="table-container">
                <Table stickyHeader size={dense ? 'small' : 'medium'}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Visit Code</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Performed By</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedActivityLog.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary">No activity log entries found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedActivityLog.map((activity) => (
                                <TableRow key={activity?._id || Math.random()} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#f0f7fa' } }}>
                                    <TableCell>{activity?.unique_code || '-'}</TableCell>
                                    <TableCell>{activity?.is_approved ? 'Approved' : activity?.is_rejected ? 'Rejected' : 'Pending'}</TableCell>
                                    <TableCell>{activity?.user_id?.email || '-'}</TableCell>
                                    <TableCell>{formatDate(activity?.visit_date)}</TableCell>
                                    <TableCell>{activity?.details || '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={activityLog.length}
                    rowsPerPage={activityRowsPerPage}
                    page={activityPage}
                    onPageChange={handleActivityPage}
                    onRowsPerPageChange={handleActivityRowsPerPage}
                />
            </TableContainer>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="approval-modal-title"
            >
                <Box sx={modalStyle}>
                    <Typography id="approval-modal-title" variant="h6" component="h2" gutterBottom>
                        Review Visit Request
                    </Typography>
                    {selectedVisit && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Visit Code</Typography>
                                    <Typography>{selectedVisit.unique_code}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Guest</Typography>
                                    <Typography>
                                        {selectedVisit.guest ? `${selectedVisit.guest.fullName} (${selectedVisit.guest.email})` : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Department</Typography>
                                    <Typography>{selectedVisit.department?.departmentName || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Visit Date</Typography>
                                    <Typography>{formatDate(selectedVisit.visit_date)}</Typography>
                                </Grid>
                                {selectedVisit.car && (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mt: 2 }}>Car Details</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="text.secondary">Plate Number</Typography>
                                            <Typography>{selectedVisit.car.plateNumber}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="text.secondary">Model</Typography>
                                            <Typography>{selectedVisit.car.carModel}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="text.secondary">Color</Typography>
                                            <Typography>{selectedVisit.car.carColor}</Typography>
                                        </Grid>
                                    </>
                                )}
                                {selectedVisit.items?.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Items</Typography>
                                        <Typography>{selectedVisit.items.join(', ')}</Typography>
                                    </Grid>
                                )}
                                {selectedVisit.remark && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Remarks</Typography>
                                        <Typography>{selectedVisit.remark}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Decision</FormLabel>
                        <RadioGroup
                            value={approvalStatus}
                            onChange={(e) => setApprovalStatus(e.target.value)}
                        >
                            <FormControlLabel value="approved" control={<Radio />} label="Approve" />
                            <FormControlLabel value="rejected" control={<Radio />} label="Reject" />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Comment"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                        required={approvalStatus === 'rejected'}
                        error={approvalStatus === 'rejected' && !description.trim()}
                        helperText={approvalStatus === 'rejected' && !description.trim() ? 'Please provide a reason for rejection' : ''}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmitApproval}
                            disabled={!approvalStatus || (approvalStatus === 'rejected' && !description.trim()) || loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
} 