import React from "react";
import "./userModal.css";
import CloseIcon from "@mui/icons-material/Close";

const UserModal = ({ user, onClose, inWidget }) => {
  if (!user) return null;

  const userStatus = user.status ? 'Active' : 'Inactive';

  const modalContent = (
    <div className="modal-content">
      <div className="modal-header">
        <h2>User Details</h2>
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="modal-body">
        <div className="user-info-section">
          <div className="user-avatar">
            <img
              src={user.img || "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400"}
              alt="user avatar"
            />
          </div>
          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user.fullName || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{user.role_id?.roleName || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${userStatus.toLowerCase()}`}>
                {userStatus}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Active:</span>
              <span className="detail-value">{user.lastActive || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (inWidget) {
    return modalContent;
  }

  return (
    <div className="modal-overlay">
      {modalContent}
    </div>
  );
};

export default UserModal; 