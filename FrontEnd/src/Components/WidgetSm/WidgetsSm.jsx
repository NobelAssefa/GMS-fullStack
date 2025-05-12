import React, { useState, useEffect } from "react";
import "./widgetsSm.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UserModal from "../UserModal/UserModal";
import axios from 'axios';

export default function WidgetsSm() {
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [recentGuests, setRecentGuests] = useState([]);

  useEffect(() => {
    const fetchRecentGuests = async () => {
      try {
        const response = await axios.get('/api/guest/getguests', { withCredentials: true });
        const guests = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentGuests(guests);
      } catch (error) {
        console.error('Error fetching recent guests:', error);
      }
    };

    fetchRecentGuests();
  }, []);

  const handleViewGuest = (guest) => {
    setSelectedGuest(guest);
  };

  const handleCloseModal = () => {
    setSelectedGuest(null);
  };

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">Recently Registered Guests</span>
      <ul className="widgetSmList">
        {recentGuests.map((guest) => (
          <li key={guest._id} className="widgetSmItem">
            <img
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="profile Photo"
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{guest.fullName}</span>
              <span className="widgetSmJobcatagory">{guest.phone}</span>
            </div>
            <button 
              className="widgetSmbutton"
              onClick={() => handleViewGuest(guest)}
            >
              <PersonAddIcon className="widgetsmIcon" />
              View
            </button>
          </li>
        ))}
      </ul>
      {selectedGuest && (
        <div className="in-widget-modal">
          <UserModal user={selectedGuest} onClose={() => setSelectedGuest(null)} inWidget />
        </div>
      )}
    </div>
  );
}
