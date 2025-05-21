import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './doctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || 'Doctor';


  
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
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    if (!token || role !== 'DOCTOR') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="doctor-dashboard-container">
      <h2 className="doctor-header">Welcome, Dr. {fullName}</h2>

      <div className="doctor-cards-container">
        <div
          className="doctor-cardboard"
          onClick={() => navigate('/get-patients')}
        >
          View Patients
        </div>

        <div
          className="doctor-cardboard"
          onClick={() => navigate('/set-availability')}
        >
          Set Availability
        </div>

        <div
          className="doctor-cardboard"
          onClick={() => navigate('/reschedule')}
        >
          Reschedule
        </div>
        {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </div>
  );
};

export default DoctorDashboard;