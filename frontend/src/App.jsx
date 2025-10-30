import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Page Imports
import Homepage from './pages/Homepage';  
import Dashboard from './pages/Dashboard.jsx'; 
import Services from './components/Services';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';

// Component Imports
import About from './components/About.jsx';
import Inventory from './components/Inventory.jsx';
import TotalUnits from './components/TotalUnits.jsx';
import Functional from './components/Functional.jsx';
import Maintenance from './components/Maintenance.jsx';
import OutOfOrder from './components/OutOfOrder.jsx';
import OTP from './components/OTP.jsx';
import ForgotPasswordOTP from './components/ForgotPasswordOTP.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ReportsAuditor from './components/ReportsAuditor.jsx'
import ReportsTech from './components/ReportsTech.jsx';
import Role from './components/Role.jsx';
import Technicians from './components/Technicians.jsx';
import AuditorProfile from './components/AuditorProfile.jsx';
import DashboardTechnician from './pages/DashboardTechnician.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import TechnicianProfile from './components/TechnicianProfile.jsx';
import AdminProfile from './components/AdminProfile.jsx';
import UnitStatusTechnician from './components/UnitStatusTechnician.jsx';
import UnitStatusAuditor from './components/UnitStatusAuditor.jsx';
import AdminTechnicians from './components/AdminTechnicians.jsx'; // Import AdminTechnicians
import AdminTechRequests from './components/AdminTechRequests.jsx'; // Import AdminTechRequests

import DocumentPage from './pages/document.jsx';

/*STYLES*/
import './styles/Homepage.css';
import './styles/Dashboard.css';  
import './styles/Services.css';
import './styles/Login.css';
import './styles/Signup.css';
import './styles/OTP.css';
import './styles/ForgotPasswordOTP.css';
import './styles/ResetPassword.css';
import './styles/ForgotPassword.css';
import './styles/About.css';
import './styles/ReportsTech.css';
import './styles/Role.css'; 
import './styles/AuditorProfile.css'; // Import the new AuditorProfile stylesheet
import './styles/ReportsAuditor.css'; // Import ReportsAuditor stylesheet
import './styles/TechnicianProfile.css';
import './styles/AdminProfile.css';
import './styles/UnitStatusAuditor.css';


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/document" element={<DocumentPage replace />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/total-units" element={<TotalUnits />} />
          <Route path="/functional" element={<Functional />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/out-of-order" element={<OutOfOrder />} />
          <Route path="/reports-tech" element={<ReportsTech />} />
          <Route path="/reports-auditor" element={<ReportsAuditor />} />
          <Route path="/role" element={<Role />} /> 
          <Route path="/technicians" element={<Technicians />} /> 
          <Route path="/auditor-profile" element={<AuditorProfile />} />
          <Route path="/dashboard-technician" element={<DashboardTechnician />} />
          <Route path="/unit-status-technician" element={<UnitStatusTechnician />} />
          <Route path="/technician-profile" element={<TechnicianProfile />} />
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/unit-status-auditor" element={<UnitStatusAuditor />} />
          <Route path="/admin-technicians" element={<AdminTechnicians />} /> {/* New Route */}
          <Route path="/admin-tech-requests" element={<AdminTechRequests />} /> {/* New Route */}
        </Routes>
    </Router>
  );
}

export default App;