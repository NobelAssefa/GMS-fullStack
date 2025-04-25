import { useState } from 'react';
import Topbar from "./Components/topbar/Topbar";
import Sidebar from './Components/sidebar/Sidebar';
import "./app.css";
import Home from './Pages/Home/Home';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GuestRegistrationPage from './Pages/GuestRegistration/GuestRegistrationPage';
import VisitRequestPage from './Pages/VisitRequest/visitRequestPage';
import VisitApprovalPage from './Pages/VisitApproval/VisitApprovalPage';
import CheckInPanelPage from './Pages/CheckInPanel/CheckInPanelPage';
import UserManagementPage from './Pages/UserManagement/UserManagementPage';
import LoginPage from './Pages/Login/LoginPage';
import NewUser from './Components/userManagement/NewUser';

// Layout component to wrap pages that need sidebar and topbar
const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app">
      <Topbar />
      <div className="container">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
          <div className="toggle-icon" onClick={toggleSidebar}>
            {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Wrapper component to apply layout conditionally
const PageWrapper = ({ children }) => {
  const location = useLocation();
  
  // Don't apply layout to login page
  if (location.pathname === '/login') {
    return children;
  }
  
  // Apply layout to all other pages
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <PageWrapper>
        <Routes>
          {/* Redirect root to home after login */}
          <Route path="/" element={<Home />} />
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Main Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<UserManagementPage />} />
          <Route path="/users/new" element={<NewUser />} />
          <Route path="/guest/registration" element={<GuestRegistrationPage />} />
          <Route path="/visit/request" element={<VisitRequestPage />} />
          <Route path="/visit/approval" element={<VisitApprovalPage />} />
          <Route path="/checkin" element={<CheckInPanelPage />} />
          
          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
