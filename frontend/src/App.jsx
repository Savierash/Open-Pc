import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/Homepage';  
import Dashboard from './pages/Dashboard.jsx'; 
import Services from './components/Services';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
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


function App() {
  return (
    <Router>
      <Routes>
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
        </Routes>
    </Router>
  );
}

export default App;