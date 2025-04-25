import React, { useState, useEffect, useRef } from 'react'
import "./topbar.css"
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';
import logo from '../../Assets/icons/Untitled.svg';

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
                     src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400" 
                     alt="" 
                     className="avatar" 
                     onClick={toggleDropdown}
                 />
                 {isDropdownOpen && (
                     <div className="dropdown-menu">
                         <div className="dropdown-item">Profile</div>
                         <div className="dropdown-item">Settings</div>
                         <div className="dropdown-item">Logout</div>
                     </div>
                 )}
             </div>
         </div>
     </div>
    </div>
   )
}


