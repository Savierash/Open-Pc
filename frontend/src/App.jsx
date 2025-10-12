import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './components/Homepage';  
import Dashboard from './components/Dashboard'; 
import Services from './components/Services';
import FQs from './components/FQs';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';


/*STYLES*/
import './styles/Homepage.css';
import './styles/Dashboard.css';  
import './styles/Services.css';
import './styles/FQs.css';
import './styles/Login.css';
import './styles/Signup.css';



function App() {
  return (
    <Router>
      {/* Routes */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<FQs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </Router>
  );
}

export default App;