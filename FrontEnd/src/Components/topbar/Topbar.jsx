import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import "./topbar.css"
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../../Assets/icons/Untitled.svg';
import { authService } from '../../Services/api';
import { logout } from '../../Redux/slices/authSlice';

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check for Ctrl+Shift+Y
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'y') {
        toggleDropdown();
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="topbar">
     <div className="topbarWrapper">
         <div className="topleft">
             <img src={logo} alt="eNGEDA" className="logo" />
         </div>
         <div className="topright">
             <div className="topbarIconcontainer">
                 <NotificationsIcon></NotificationsIcon>
                 <span className="topiconbadge">2</span>
             </div>
             <div className="topbarIconcontainer">
                 <LanguageIcon></LanguageIcon>
                 <span className="topiconbadge">2</span>
             </div>
         
             <div className="avatar-container" ref={dropdownRef}>
                 <img 
                     src={user?.img || "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                     alt={user?.fullName || "User"} 
                     className="avatar" 
                     onClick={toggleDropdown}
                 />
                 {isDropdownOpen && (
                     <div className="dropdown-menu">
                         <div className="dropdown-item">
                            
                             Profile
                         </div>
                         <div className="dropdown-item">
                           
                             Settings
                         </div>
                         <div className="dropdown-item" onClick={handleLogout}>
                            
                             Logout
                         </div>
                     </div>
                 )}
             </div>
         </div>
     </div>
    </div>
   )
}


