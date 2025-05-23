import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRoleFromToken } from '../utils/utils';
import './FirstPage.css';
 
const FirstPage = () => {
  const role = getRoleFromToken();
  const navigate = useNavigate();
 
 
 
  return (
    <div className="first-page-container">
      {/* NavBar with Login and Signup */}
      <nav className="navbar">
        <h1>Apollo Hospitals</h1>
        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
       
        </div>
      </nav>
 
      {/* Main Content */}
      <div className="button-container">
        <Link to="/book-appointment">
          <button className="appointment-button">Book Appointment</button>
        </Link>
        <Link to="/validate-aadhar">
          <button className="add-doctor-button">Already registered</button>
        </Link>
      </div>
    </div>
  );
};
 
export default FirstPage;