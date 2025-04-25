import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    IconButton,
    Chip,
    Avatar,
    Typography,
    Menu,
    MenuItem,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import './userManagement.css';

// Sample user data
const sampleUsers = [
    {
        id: 1,
        name: 'Dr. Upasana',
        email: 'upasana@hospital.com',
        role: 'Hospital Staffs',
        status: 'Active',
        avatar: 'https://example.com/avatar1.jpg',
        lastActive: '2 mins ago'
    },
    {
        id: 2,
        name: 'John Mahoney',
        email: 'john@security.com',
        role: 'Security',
        status: 'Active',
        avatar: 'https://example.com/avatar2.jpg',
        lastActive: '5 mins ago'
    },
    {
        id: 3,
        name: 'Sarah Johnson',
        email: 'sarah@admin.com',
        role: 'Admin',
        status: 'Inactive',
        avatar: 'https://example.com/avatar3.jpg',
        lastActive: '1 hour ago'
    },
    {
        id: 4,
        name: 'Mike Wilson',
        email: 'mike@hospital.com',
        role: 'Hospital Staffs',
        status: 'Active',
        avatar: 'https://example.com/avatar4.jpg',
        lastActive: '3 hours ago'
    }
];

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState(sampleUsers);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleEdit = () => {
        // Implement edit functionality
        console.log('Edit user:', selectedUser);
        handleMenuClose();
    };

    const handleDelete = () => {
        // Implement delete functionality
        console.log('Delete user:', selectedUser);
        handleMenuClose();
    };

    const handleAddNewUser = () => {
        navigate('/users/new');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="user-management">
            <div className="user-management-header">
                <div className="search-section">
                    <TextField
                        placeholder="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <SearchIcon className="search-icon" />
                        }}
                        className="search-input"
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    className="add-user-button"
                    onClick={handleAddNewUser}
                >
                    Add New User
                </Button>
            </div>

            <Paper className="users-table-container">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Active</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="user-info">
                                                <Avatar src={user.avatar} alt={user.name} />
                                                <Typography>{user.name}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status}
                                                color={user.status === 'Active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{user.lastActive}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, user)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
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
        </div>
    );
} 