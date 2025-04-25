import React, { useState } from "react";
import "./widgetsSm.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UserModal from "../UserModal/UserModal";

export default function WidgetsSm() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const recentUsers = [
    {
      id: 1,
      username: "Dr. Upasana",
      role: "Hospital Staff",
      status: "Active",
      email: "upasana@example.com",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      username: "John Mahoney",
      role: "Security",
      status: "Active",
      email: "john@example.com",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      username: "Sarah Johnson",
      role: "Admin",
      status: "Active",
      email: "sarah@example.com",
      lastActive: "30 minutes ago",
    },
    {
      id: 4,
      username: "Mike Wilson",
      role: "Hospital Staff",
      status: "Active",
      email: "mike@example.com",
      lastActive: "15 minutes ago",
    },
  ];

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">Recently Registered Users</span>
      <ul className="widgetSmList">
        {recentUsers.map((user) => (
          <li key={user.id} className="widgetSmItem">
            <img
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="profile Photo"
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{user.username}</span>
              <span className="widgetSmJobcatagory">{user.role}</span>
            </div>
            <button
              className="widgetSmbutton"
              onClick={() => handleViewUser(user)}
            >
              <PersonAddIcon className="widgetsmIcon" />
              View
            </button>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
}
