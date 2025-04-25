import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import DashboardIcon from '@material-ui/icons/Dashboard';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";

export default function Sidebar({ isCollapsed }) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    // Set active item based on current path
    const path = location.pathname;
    setActiveItem(path);
  }, [location]);

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  const isDashboardActive = () => {
    return activeItem === "/" || activeItem === "/home";
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebarwrapper">
        <div className="sidebarMenu">
          <h1 className="title">eNGEDA.</h1>
          <ul className="sideBarList">
            <Link to="/home" className="link" onClick={() => handleItemClick("/home")}>
              <li className={`sidebarListItem ${isDashboardActive() ? "active" : ""}`}>
                <DashboardIcon className="sideBarIcons" />
                Dashboard
              </li>
            </Link>
            <Link to="/guest/registration" className="link" onClick={() => handleItemClick("/guest/registration")}>
              <li className={`sidebarListItem ${activeItem === "/guest/registration" ? "active" : ""}`}>
                <EmojiPeopleIcon className="sideBarIcons" />
                Guest Registration
              </li>
            </Link>
            <Link to="/visit/request" className="link" onClick={() => handleItemClick("/visit/request")}>
              <li className={`sidebarListItem ${activeItem === "/visit/request" ? "active" : ""}`}>
                <CheckBoxOutlineBlankIcon className="sideBarIcons" />
                Visit Request
              </li>
            </Link>
            <Link to="/visit/approval" className="link" onClick={() => handleItemClick("/visit/approval")}>
              <li className={`sidebarListItem ${activeItem === "/visit/approval" ? "active" : ""}`}>
                <DoneAllIcon className="sideBarIcons" />
                Visit Approvals	 
              </li>
            </Link>
            <Link to="/checkin" className="link" onClick={() => handleItemClick("/checkin")}>
              <li className={`sidebarListItem ${activeItem === "/checkin" ? "active" : ""}`}>
                <OpenInNewIcon className="sideBarIcons" />
                CheckIn Panel	 
              </li>
            </Link>
            <Link to="/user" className="link" onClick={() => handleItemClick("/user")}>
              <li className={`sidebarListItem ${activeItem === "/user" ? "active" : ""}`}>
                <SupervisorAccountIcon className="sideBarIcons" />
                User Management 	 
              </li>
            </Link>
            <Link to="/reports" className="link" onClick={() => handleItemClick("/reports")}>
              <li className={`sidebarListItem ${activeItem === "/reports" ? "active" : ""}`}>
                <AssessmentIcon className="sideBarIcons" />
                Reports  	 
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarFooter">
          <div className="userProfile">
            <Avatar 
              alt="User Avatar" 
              src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400" 
              className="userAvatar"
            />
            {!isCollapsed && (
              <div className="userInfo">
                <span className="userName">John Doe</span>
                <span className="userRole">Administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
