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
    Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InboxIcon from '@mui/icons-material/Inbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import './visitApproval.css';

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

const sampleVisits = [
    {
        id: 1,
        code: 'VST001',
        requested_by: {
            name: 'John Doe',
            department: 'IT Department'
        },
        status: 'pending',
        comment: '',
        action_date: null,
        created_at: '2024-03-20'
    },
    {
        id: 2,
        code: 'VST002',
        requested_by: {
            name: 'Jane Smith',
            department: 'HR Department'
        },
        status: 'approved',
        comment: 'Approved for quarterly review meeting',
        action_date: '2024-03-21 14:30',
        created_at: '2024-03-19'
    },
    {
        id: 3,
        code: 'VST003',
        requested_by: {
            name: 'Mike Johnson',
            department: 'Sales Department'
        },
        status: 'rejected',
        comment: 'Insufficient information provided',
        action_date: '2024-03-22 09:15',
        created_at: '2024-03-18'
    }
];

const activityLogSample = [
    {
        id: 1,
        visit_code: 'VST001',
        action: 'Created',
        performed_by: 'John Doe',
        timestamp: '2024-03-20 09:00',
        details: 'Visit request created'
    },
    {
        id: 2,
        visit_code: 'VST002',
        action: 'Approved',
        performed_by: 'Admin User',
        timestamp: '2024-03-21 14:30',
        details: 'Approved for quarterly review meeting'
    },
    {
        id: 3,
        visit_code: 'VST003',
        action: 'Rejected',
        performed_by: 'Admin User',
        timestamp: '2024-03-22 09:15',
        details: 'Insufficient information provided'
    }
];

export default function VisitApprovalPage() {
    const [visits, setVisits] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState('');
    const [description, setDescription] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');
    const [order, setOrder] = useState('desc');

    useEffect(() => {
        // Simulating API call
        setLoading(true);
        setTimeout(() => {
            setVisits(sampleVisits);
            setActivityLog(activityLogSample);
            setLoading(false);
        }, 1000);
    }, []);

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

            // Handle nested properties
            if (orderBy.includes('.')) {
                const keys = orderBy.split('.');
                aValue = keys.reduce((obj, key) => obj?.[key] ?? '', a) || '';
                bValue = keys.reduce((obj, key) => obj?.[key] ?? '', b) || '';
            } else {
                aValue = a?.[orderBy] ?? '';
                bValue = b?.[orderBy] ?? '';
            }

            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                if (order === 'desc') {
                    return bValue.localeCompare(aValue);
                }
                return aValue.localeCompare(bValue);
            }

            // Handle date comparison
            if (orderBy === 'created_at' || orderBy === 'action_date') {
                const dateA = aValue ? new Date(aValue).getTime() : 0;
                const dateB = bValue ? new Date(bValue).getTime() : 0;
                return order === 'desc' ? dateB - dateA : dateA - dateB;
            }

            // Handle regular comparison
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

    const handleSubmitApproval = () => {
        if (!approvalStatus) return;

        const currentDate = new Date().toLocaleString();
        const newActivity = {
            id: activityLog.length + 1,
            visit_code: selectedVisit.code,
            action: approvalStatus === 'approved' ? 'Approved' : 'Rejected',
            performed_by: 'Admin User', // Replace with actual user
            timestamp: currentDate,
            details: description
        };

        // Update visit status
        const updatedVisits = visits.map(visit => {
            if (visit.id === selectedVisit.id) {
                return {
                    ...visit,
                    status: approvalStatus,
                    comment: description,
                    action_date: currentDate
                };
            }
            return visit;
        });

        setVisits(updatedVisits);
        setActivityLog([...activityLog, newActivity]);
        handleCloseModal();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const getRequestedByName = (visit) => {
        return visit?.requested_by?.name || '-';
    };

    const getRequestedByDepartment = (visit) => {
        return visit?.requested_by?.department || '-';
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
        if (!visit?.status) return null;

        switch (visit.status) {
            case 'pending':
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(visit)}
                        startIcon={<PendingIcon />}
                    >
                        Review
                    </Button>
                );
            case 'approved':
                return (
                    <Tooltip title="Approved">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                            <CheckCircleIcon />
                            <Typography variant="body2">Approved</Typography>
                        </Box>
                    </Tooltip>
                );
            case 'rejected':
                return (
                    <Tooltip title="Rejected">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                            <CancelIcon />
                            <Typography variant="body2">Rejected</Typography>
                        </Box>
                    </Tooltip>
                );
            default:
                return null;
        }
    };

    return (
        <div className="visit-approval-page">
            <div className="page-header">
                <Typography variant="h3" component="h1" className="header-title">
                    Visit Approval
                </Typography>
                <Typography variant="subtitle1" className="header-subtitle">
                    Review Visit Request
                </Typography>
            </div>

            {loading ? (
                <div className="loading-state">
                    <Typography>Loading...</Typography>
                </div>
            ) : !visits || visits.length === 0 ? (
                <div className="empty-state">
                    <InboxIcon className="empty-state-icon" />
                    <Typography variant="h6">No Visits Found</Typography>
                </div>
            ) : (
                <>
                    <TableContainer component={Paper} className="table-container">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{renderSortLabel('code', 'Visit Code')}</TableCell>
                                    <TableCell>{renderSortLabel('requested_by.name', 'Requested By')}</TableCell>
                                    <TableCell>{renderSortLabel('requested_by.department', 'Department')}</TableCell>
                                    <TableCell>{renderSortLabel('created_at', 'Request Date')}</TableCell>
                                    <TableCell>{renderSortLabel('status', 'Status')}</TableCell>
                                    <TableCell>{renderSortLabel('comment', 'Comment')}</TableCell>
                                    <TableCell>{renderSortLabel('action_date', 'Action Date')}</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(visits && Array.isArray(visits) ? sortData(visits) : [])
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((visit) => (
                                        <TableRow
                                            key={visit?.id || Math.random()}
                                            className="table-row"
                                            hover
                                        >
                                            <TableCell>{visit?.code || '-'}</TableCell>
                                            <TableCell>{getRequestedByName(visit)}</TableCell>
                                            <TableCell>{getRequestedByDepartment(visit)}</TableCell>
                                            <TableCell>{formatDate(visit?.created_at)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={visit?.status || 'unknown'}
                                                    color={
                                                        visit?.status === 'approved'
                                                            ? 'success'
                                                            : visit?.status === 'rejected'
                                                                ? 'error'
                                                                : 'warning'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{visit?.comment || '-'}</TableCell>
                                            <TableCell>{formatDate(visit?.action_date)}</TableCell>
                                            <TableCell>
                                                {renderActionColumn(visit)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={visits?.length || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>

                    <Typography variant="h6" className="section-title" sx={{ mt: 4, mb: 2 }}>
                        Activity Log
                    </Typography>
                    
                    <TableContainer component={Paper} className="table-container">
                        <Table stickyHeader>
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
                                {(activityLog && Array.isArray(activityLog) ? activityLog : []).map((activity) => (
                                    <TableRow key={activity?.id || Math.random()} hover>
                                        <TableCell>{activity?.visit_code || '-'}</TableCell>
                                        <TableCell>{activity?.action || '-'}</TableCell>
                                        <TableCell>{activity?.performed_by || '-'}</TableCell>
                                        <TableCell>{activity?.timestamp || '-'}</TableCell>
                                        <TableCell>{activity?.details || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

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
                                    <Typography>{selectedVisit.code}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Requested By</Typography>
                                    <Typography>{getRequestedByName(selectedVisit)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Department</Typography>
                                    <Typography>{getRequestedByDepartment(selectedVisit)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Request Date</Typography>
                                    <Typography>{formatDate(selectedVisit.created_at)}</Typography>
                                </Grid>
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
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmitApproval}
                            disabled={!approvalStatus}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
} 