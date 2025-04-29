// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminDashbord.css';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/auth/get_user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Verify the user is actually an admin
        if (response.data.role !== 'ROLE_ADMIN') {
          navigate('/unauthorized');
          return;
        }

        setAdminData(response.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      
      <main>
        <section className="welcome-section">
          <h2>Welcome, {adminData?.email}</h2>
          <p>You have administrator privileges.</p>
        </section>
        
        <section className="admin-actions">
          <div className="action-card" onClick={() => navigate('/admin/manage-doctors')}>
            <h3>Manage Doctors</h3>
          </div>
          <div className="action-card" onClick={() => navigate('/admin/manage-patients')}>
            <h3>Manage Patients</h3>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;