import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Loginform.css'; // Import the CSS file here

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send login credentials to backend
      const response = await axios.post('http://localhost:8000/auth/signin', {
        email,
        password
      });

      // On success, store JWT token in localStorage
      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('role', response.data.role);  // Save the role
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('id', response.data.id); // Save the user ID

      // Navigate based on role
      const role = response.data.role;

      if (role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');  // Redirect to Admin Dashboard
      } else if (role === 'ROLE_DOCTOR') {
        navigate('/doctor-dashboard'); // Redirect to Doctor Dashboard
      } else {
        navigate('/login'); // Default, in case of unknown role
      }
    } catch (err) {
      // Handle error (invalid credentials)
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;