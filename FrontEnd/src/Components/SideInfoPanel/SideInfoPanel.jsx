import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './SideInfoPanel.css';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LinkIcon from '@mui/icons-material/Link';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import welcome from '../../Assets/images/welcome1-rmvbg.png'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
// import your user context or props as needed
import axios from 'axios';

const API_URL = '/api/user';

export default function SideInfoPanel({ onToggle }) {
  const [isCompressed, setIsCompressed] = useState(false);
  const [stats, setStats] = useState({ visits: 0, newGuests: 0, pendingApprovals: 0 });
  
  // Get user from Redux state
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Add your stats fetching logic here if needed
        // For now, using dummy data
        setStats({
          visits: 150,
          newGuests: 25,
          pendingApprovals: 10
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const togglePanel = () => {
    const newState = !isCompressed;
    setIsCompressed(newState);
    if (onToggle) onToggle(newState);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`side-info-panel ${isCompressed ? 'compressed' : ''}`}>
      <button
        className="side-info-toggle"
        onClick={togglePanel}
        style={{ background: 'none', boxShadow: 'none', border: 'none', padding: 0 }}
      >
        {isCompressed
          ? <ToggleOffIcon fontSize="large" style={{ color: '#bdbdbd' }} />
          : <ToggleOnIcon fontSize="large" style={{ color: '#BBFBFF' }} />
        }
      </button>
      <div className="side-info-header">
        <div className="side-info-user">
          <img 
            src={user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
            alt="avatar" 
            className="side-info-avatar" 
          />
          <div>
            <div className="side-info-name">
              {user.fullName ? user.fullName.split(' ')[0] : 'User'}
            </div>
            {user.role?.roleName && (
              <div className="side-info-card">{user.role.roleName}</div>
            )}
            {user.email && <div className="side-info-card">{user.email}</div>}
            {user.phone && <div className="side-info-card">{user.phone}</div>}
          </div>
        </div>
      </div>
      <div className="side-info-content">
        <div className="side-info-section">
          <div className="side-info-title">
            Welcome back, {user.fullName ? user.fullName.split(' ')[0] : 'User'}!
          </div>
          <div className="side-info-message">
            Hope you have a productive day. Here's a quick overview:
          </div>
        </div>
        <div className="side-info-section side-info-stats">
          <div className="side-info-stat">
            <EmojiEventsIcon className="side-info-icon" /> 
            Visits this month: <b>{stats.visits}</b>
          </div>
          <div className="side-info-stat">
            <PersonIcon className="side-info-icon" /> 
            New guests: <b>{stats.newGuests}</b>
          </div>
        </div>
        <div className="side-info-section">
          <div className="side-info-reminder">
            <NotificationsActiveIcon className="side-info-icon" /> 
            You have {stats.pendingApprovals} pending approvals
          </div>
        </div>
        <div className="side-info-section">
          <div className="side-info-links side-info-links-buttons">
            <LinkIcon className="side-info-icon" />
            <a href="/visit/request" className="side-info-link side-info-link-btn">Go to Visits</a>
            <a href="/guests" className="side-info-link side-info-link-btn">Go to Guests</a>
          </div>
        </div>
        <div className="side-info-illustration">
          <img src={welcome} alt="illustration" className="side-info-illustration-img" />
        </div>
      </div>
    </div>
  );
} 