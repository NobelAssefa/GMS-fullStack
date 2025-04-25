import React from 'react'
import "./widgetsLg.css"
import CheckInIcon from '@mui/icons-material/Login';
import CheckOutIcon from '@mui/icons-material/Logout';
import PendingIcon from '@mui/icons-material/Pending';

export default function WidgetsLg() {
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

  return (
    <div className='widgetLg'>
        <span className="widgetLgTitle">Guest Status</span>
        <table className="widgetLgtable">
          <tr className="widgetLgtr">
            <th className="widgetLgth">Guest Name</th>
            <th className="widgetLgth">Check In</th>
            <th className="widgetLgth">Check Out</th>
            <th className="widgetLgth">Status</th>
          </tr>
          <tr className="widgetLgtr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" alt="" className="widgetLguserimg" />
              <span className="widgetLgName">John Smith</span>
            </td>
            <td className="widgetLgdate">10:00 AM</td>
            <td className="widgetLgdate">-</td>
            <td className="widgetLgStatus">
              <Button type="Checked In" />
            </td>
          </tr>
          <tr className="widgetLgtr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" alt="" className="widgetLguserimg" />
              <span className="widgetLgName">Sarah Johnson</span>
            </td>
            <td className="widgetLgdate">09:30 AM</td>
            <td className="widgetLgdate">11:30 AM</td>
            <td className="widgetLgStatus">
              <Button type="Checked Out" />
            </td>
          </tr>
          <tr className="widgetLgtr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" alt="" className="widgetLguserimg" />
              <span className="widgetLgName">Michael Brown</span>
            </td>
            <td className="widgetLgdate">-</td>
            <td className="widgetLgdate">-</td>
            <td className="widgetLgStatus">
              <Button type="Pending" />
            </td>
          </tr>
          <tr className="widgetLgtr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" alt="" className="widgetLguserimg" />
              <span className="widgetLgName">Emily Davis</span>
            </td>
            <td className="widgetLgdate">11:00 AM</td>
            <td className="widgetLgdate">-</td>
            <td className="widgetLgStatus">
              <Button type="Checked In" />
            </td>
          </tr>
        </table>
    </div>
  )
}
