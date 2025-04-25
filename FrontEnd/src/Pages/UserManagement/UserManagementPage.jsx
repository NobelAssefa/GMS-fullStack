import React from 'react';
import UserManagement from '../../Components/userManagement/UserManagement';
import './userManagementPage.css';

export default function UserManagementPage() {
    return (
        <div className="user-management-page">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage system users, roles, and permissions</p>
            </div>
            <UserManagement />
        </div>
    );
} 