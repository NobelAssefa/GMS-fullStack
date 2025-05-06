import { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { store, persistor } from './Redux/store';
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
import ProtectedRoute from './Components/ProtectedRoute';
import AuthProvider from './Components/AuthProvider';
import DepartmentPage from './Pages/Department/DepartmentPage';
import NewDepartmentPage from './Pages/Department/NewDepartmentPage';
import NewRolePage from './Pages/Role/NewRolePage';

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthProvider>
            <PageWrapper>
              <Routes>
                {/* Login Route - Public */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/user" element={
                  <ProtectedRoute>
                    <UserManagementPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/users/new" element={
                  <ProtectedRoute>
                    <NewUser />
                  </ProtectedRoute>
                } />
                
                <Route path="/guest/registration" element={
                  <ProtectedRoute>
                    <GuestRegistrationPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/visit/request" element={
                  <ProtectedRoute>
                    <VisitRequestPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/visit/approval" element={
                  <ProtectedRoute>
                    <VisitApprovalPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/checkin" element={
                  <ProtectedRoute>
                    <CheckInPanelPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/department" element={
                  <ProtectedRoute>
                    <DepartmentPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/department/new" element={
                  <ProtectedRoute>
                    <NewDepartmentPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/roles/new" element={
                  <ProtectedRoute>
                    <NewRolePage />
                  </ProtectedRoute>
                } />
                
                {/* Catch all - 404 */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </PageWrapper>
          </AuthProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
