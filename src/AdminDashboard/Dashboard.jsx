import React from 'react';
import { Link } from 'react-router-dom';


import './Dashboard.css';   


function Dashboard() {

  return (
   
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <nav className="dashboard-nav">
          <Link to="/add-doctor">Create Doctor</Link>
          <Link to="/register-doctor">Issue Credentials</Link>
          <Link to="/book-appointment">Book Appointment</Link>
          <Link to="/view-doctors">View Doctors</Link>
          <Link to="/view-patients">View Patients</Link>
        </nav>
    
      </div>
    
  );
}

export default Dashboard;
