import React, { useState, useEffect } from 'react'
import "./widgetsLg.css"
import CheckInIcon from '@mui/icons-material/Login';
import CheckOutIcon from '@mui/icons-material/Logout';
import PendingIcon from '@mui/icons-material/Pending';
import axios from 'axios';
import { format } from 'date-fns';

export default function WidgetsLg() {
  const [recentVisits, setRecentVisits] = useState([]);

  useEffect(() => {
    const fetchRecentVisits = async () => {
      try {
        const response = await axios.get('/api/visit/getvisits', { withCredentials: true });
        const visits = response.data
          .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
          .slice(0, 5);
        setRecentVisits(visits);
        console.log("visits", visits);
        
      } catch (error) {
        console.error('Error fetching recent visits:', error);
      }
    };

    fetchRecentVisits();
  }, []);

  const Button = ({type}) => {
    return (
      <button className={"widgetLgbutton" + " " + type}>
        {type === 'Checked In' && <CheckInIcon className="status-icon" />}
        {type === 'Checked Out' && <CheckOutIcon className="status-icon" />}
        {type === 'Pending' && <PendingIcon className="status-icon" />}
        {type}
      </button>
    );
  };

  const getVisitStatus = (visit) => {
    if (!visit.is_approved) return 'Pending';
    if (visit.checked_out) return 'Checked Out';
    if (visit.checked_in) return 'Checked In';
    return 'Pending';
  };

  return (
    <div className='widgetLg'>
        <span className="widgetLgTitle">Recent Visits</span>
        <table className="widgetLgtable">
          <tr className="widgetLgtr">
            <th className="widgetLgth">Guest Name</th>
            <th className="widgetLgth">Visit Date</th>
            <th className="widgetLgth">Department</th>
            <th className="widgetLgth">Status</th>
          </tr>
          {recentVisits.map((visit) => (
            <tr key={visit._id} className="widgetLgtr">
              <td className="widgetLgUser">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="" 
                  className="widgetLguserimg" 
                />
                <span className="widgetLgName">{visit.guest_id?.fullName}</span>
              </td>
              <td className="widgetLgdate">
                {format(new Date(visit.visit_date), 'MMM dd, yyyy')}
              </td>
              <td className="widgetLgdate">
                {visit.department_id?.departmentName}
              </td>
              <td className="widgetLgStatus">
                <Button type={getVisitStatus(visit)} />
              </td>
            </tr>
          ))}
        </table>
    </div>
  );
}
