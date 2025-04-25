import React, { useState } from "react";
import "./userManagement.css";
import { DataGrid } from "@mui/x-data-grid";
import { userRows, userColumns } from "../../datatablesource";
import UserModal from "../../Components/UserModal/UserModal";

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRowClick = (params) => {
    setSelectedUser(params.row);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="userManagement">
      <div className="userManagementTitle">
        <h1>User Management</h1>
      </div>
      <div className="userManagementTable">
        <DataGrid
          rows={userRows}
          columns={userColumns}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleRowClick}
        />
      </div>
      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserManagement; 