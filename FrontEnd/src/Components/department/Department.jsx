import React, { useState, useEffect } from 'react';
import './department.css';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    InputAdornment,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import * as departmentService from '../../Services/departmentService';

export default function Department() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        console.log('fetchDepartments called');
        console.log('About to call departmentService.getAllDepartments');
        try {
            setLoading(true);
            const data = await departmentService.getAllDepartments();
            console.log('Received departments:', data);
            setDepartments(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch departments');
            showSnackbar('Failed to fetch departments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleMenuOpen = (event, department) => {
        setAnchorEl(event.currentTarget);
        setSelectedDepartment(department);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDepartment(null);
    };

    const handleEdit = () => {
        if (selectedDepartment) {
            navigate(`/department/edit/${selectedDepartment.id}`);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (!selectedDepartment) return;
        try {
            await departmentService.deleteDepartment(selectedDepartment.id);
            showSnackbar('Department deleted successfully');
            fetchDepartments();
        } catch (err) {
            showSnackbar('Failed to delete department', 'error');
        }
        handleMenuClose();
    };

    const handleAddNew = () => {
        navigate('/department/new');
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="department-management">
            <Paper elevation={3} className="department-header-card">
                <Typography variant="h3" className="department-title">
                    Department Management
                </Typography>
                <Typography variant="subtitle1" className="department-subtitle">
                    Manage and organize your departments
                </Typography>
            </Paper>

            <div className="department-actions-row">
                <div className="department-search-section">
                    <TextField
                        placeholder="Search departments..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="search-icon" />
                                </InputAdornment>
                            ),
                        }}
                        className="department-search-input"
                    />
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="add-department-button"
                    onClick={handleAddNew}
                >
                    Add Department
                </Button>
            </div>

            <Paper className="departments-table-container">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Department Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">{error}</TableCell>
                                </TableRow>
                            ) : filteredDepartments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No departments found</TableCell>
                                </TableRow>
                            ) : (
                                filteredDepartments.map((department) => (
                                    <TableRow key={department.id} hover>
                                        <TableCell>{department.name}</TableCell>
                                        <TableCell>{department.description}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, department)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" className="menu-icon" />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} className="delete-menu-item">
                    <DeleteIcon fontSize="small" className="menu-icon" />
                    Delete
                </MenuItem>
            </Menu>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
