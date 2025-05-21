import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../assets/axiosConfig'; // Import the custom axiosInstance
import './Loginform.css'; // Import the CSS file here

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/signin', {
        email,
        password
      });
      console.log(response.data.jwt);

      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('id', response.data.id);
      localStorage.setItem('email', response.data.email);
        
      const role = response.data.role;

      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (role === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleGoHome = () => {
    navigate('/');
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
        <div className="button-group">
          <button type="submit" className="login-btn-submit">Login</button>
          <button type="button" onClick={handleGoHome} className="go-home-btn">Go to Home</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
