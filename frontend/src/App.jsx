import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './components/Homepage';  
import Dashboard from './components/Dashboard'; 
import Services from './components/Services';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import About from './components/About.jsx';

/*STYLES*/
import './styles/Homepage.css';
import './styles/Dashboard.css';  
import './styles/Services.css';
import './styles/Login.css';
import './styles/Signup.css';
import './styles/About.css';



function App() {
  return (
    <Router>
      {/* Routes */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
        </Routes>
    </Router>
  );
}

export default App;