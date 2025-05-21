// src/pages/Dashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // Logout function to clear localStorage and redirect to login
  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('id');
    localStorage.removeItem('email');

    // Redirect to login page
    navigate('/login');
  };

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
      
      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
