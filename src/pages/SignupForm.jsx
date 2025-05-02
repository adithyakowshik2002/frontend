// src/pages/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    secretKey: ''  // Added secret key for admin verification
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify if this is a valid admin registration route
    const verifyAdminRoute = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/verify-admin-route');
        setIsAdminRoute(response.data.isValid);
      } catch (err) {
        navigate('/unauthorized');
      }
    };
    verifyAdminRoute();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminData = {
        ...formData,
        role: 'admin'  // Hardcoded role for admin registration
      };

      const response = await axios.post(
        'http://localhost:8000/auth/', 
        adminData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.REACT_APP_ADMIN_SECRET
          }
        }
      );

      if (response.status === 201) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message || 'Admin registration failed');
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAdminRoute) {
    return (
      <div className="role-select-container">
        <div className="unauthorized-message">
          <h2>Access Restricted</h2>
          <p>Admin registration is not available through this route.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-select-container">
      <form onSubmit={handleSubmit} className="role-select-form">
        <h2>Admin Registration</h2>
        <p className="admin-notice">
          This route is strictly for initial admin setup only.
        </p>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Admin Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter institutional email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create secure password (min 12 characters)"
            required
            minLength="12"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="secretKey">Security Key</label>
          <input
            type="password"
            id="secretKey"
            name="secretKey"
            value={formData.secretKey}
            onChange={handleChange}
            placeholder="Enter installation security key"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="signup-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Creating Admin Account...
            </>
          ) : (
            'Register Admin'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;