import React, { useState, useEffect } from 'react'
import "./featured.css"
import axios from 'axios';
import GroupIcon from '@mui/icons-material/Group';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function FeaturedInfo() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    pendingApprovals: 0,
    activeVisits: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/visit/getvisits', { withCredentials: true });
        const visits = response.data;
        
        const totalVisits = visits.length;
        const pendingApprovals = visits.filter(v => !v.is_approved).length;
        const activeVisits = visits.filter(v => v.checked_in && !v.checked_out).length;
        
        setStats({
          totalVisits,
          pendingApprovals,
          activeVisits
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="featured">
        <div className="featuredItem featured-total">
            <div className="featuredIcon"><GroupIcon style={{ fontSize: 36, color: '#fff' }} /></div>
            <span className="featuredTitle">Total Visits</span>
            <div className="featuredValue">{stats.totalVisits}</div>
            <span className="featuredSub">All time visits</span>
        </div>
        <div className="featuredItem featured-pending">
            <div className="featuredIcon"><HourglassEmptyIcon style={{ fontSize: 36, color: '#fff' }} /></div>
            <span className="featuredTitle">Pending Approvals</span>
            <div className="featuredValue">{stats.pendingApprovals}</div>
            <span className="featuredSub">Awaiting approval</span>
        </div>
        <div className="featuredItem featured-active">
            <div className="featuredIcon"><CheckCircleIcon style={{ fontSize: 36, color: '#fff' }} /></div>
            <span className="featuredTitle">Active Visits</span>
            <div className="featuredValue">{stats.activeVisits}</div>
            <span className="featuredSub">Currently checked in</span>
        </div>
    </div>
  )
}
