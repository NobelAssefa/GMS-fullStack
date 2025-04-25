import React from 'react';
import CheckInPanel from '../../Components/checkInPanel/CheckInPanel';
import './checkInPanelPage.css';

export default function CheckInPanelPage() {
    return (
        <div className="check-in-panel-page">
            <div className="page-header">
                <h1>Check-In Panel</h1>
                <p>Search or scan visit codes to manage guest check-ins and check-outs</p>
            </div>
            <CheckInPanel />
        </div>
    );
}
