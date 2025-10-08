import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './components/Homepage';  
import Dashboard from './components/Dashboard'; 
import Services from './components/Services';
import FQs from './components/FQs';


/*STYLES*/
import './styles/Homepage.css';
import './styles/Dashboard.css';  
import './styles/Services.css';
import './styles/FQs.css';



function App() {
  return (
    <Router>
      {/* Routes */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<FQs />} />
        </Routes>
    </Router>
  );
}

export default App;