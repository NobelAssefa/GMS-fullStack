import React, { useState, useEffect } from 'react'
import "./featured.css"
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import axios from 'axios';

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
        const activeVisits = visits.filter(v => v.is_approved && v.checked_in && !v.checked_out).length;
        
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
        <div className="featuredItem total">
            <span className="featuredTitle">Total Visits</span>
            <div className="featuredMoneyContainer">
                <span className="featureMoney">{stats.totalVisits}</span>
                <span className="featureMoneyRate">
                    <ArrowUpwardOutlinedIcon className="featuredName"/>
                </span>
            </div>
            <div className="featureSub">All time visits</div>
        </div>
        <div className="featuredItem pending">
            <span className="featuredTitle">Pending Approvals</span>
            <div className="featuredMoneyContainer">
                <span className="featureMoney">{stats.pendingApprovals}</span>
                <span className="featureMoneyRate">
                    <ArrowDownwardOutlinedIcon className="featuredName negative"/>
                </span>
            </div>
            <div className="featureSub">Awaiting approval</div>
        </div>
        <div className="featuredItem active">
            <span className="featuredTitle">Active Visits</span>
            <div className="featuredMoneyContainer">
                <span className="featureMoney">{stats.activeVisits}</span>
                <span className="featureMoneyRate">
                    <ArrowUpwardOutlinedIcon className="featuredName"/>
                </span>
            </div>
            <div className="featureSub">Currently checked in</div>
        </div>
    </div>
  )
}
