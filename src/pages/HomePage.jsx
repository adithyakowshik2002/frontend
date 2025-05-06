// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const HomePage = () => {
    const navigate = useNavigate(); // for navigation
    const [doctors, setDoctors] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:9090/api/doctors')
        .then(res => setDoctors(res.data))
        .catch(err => console.error('Error fetching doctors:', err));
    }, []);
  
    const handleDoctorClick = (id) => {
      navigate(`/book-appointment/${id}`);
    };
  
    useEffect(() => {
      document.title = '🏥 Hospital Management System';
    }, []);
  
    return (
        <div style={{ fontFamily: 'Arial', padding: '40px', backgroundColor: '#f0f8ff' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px'
        }}>
          <h1 style={{ margin: 0 }}>🏥 Hospital Management System</h1>
          <button 
            style={{ 
              padding: '11px 21px', 
              fontSize: '18px', 
              cursor: 'pointer', 
              backgroundColor: '#ffffff', 
              color: '#007bff', 
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }} 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      
        {/* Doctors Section (unchanged) */}
        <h2 style={{ marginTop: '30px' }}>Best Doctors</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {doctors.map(doc => (
            <div
              key={doc.id}
              style={{
                width: '300px',
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '15px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <img 
                src={doc.imageUrl || 'https://via.placeholder.com/300x200'} 
                alt={doc.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <h3 style={{ margin: '10px 0 5px' }}>{doc.name}</h3>
              <p style={{ margin: 0 }}>{doc.qualification}</p>
              <span style={{ display: 'inline-block', backgroundColor: '#e0f2ff', color: '#007bff', padding: '5px 10px', borderRadius: '8px', marginTop: '8px' }}>{doc.specialization}</span>
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                <p><strong>Registration No:</strong> {doc.registrationNumber}</p>
                <p><strong>Language:</strong> {doc.languages?.join(', ') || 'N/A'}</p>
                <p><strong>Experience:</strong> {doc.experience}+ Years</p>
                <p><strong>Location:</strong> {doc.location}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <button style={{ padding: '8px 12px' }}>View Profile</button>
                <button
                  style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }}
                  onClick={() => handleDoctorClick(doc.id)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default HomePage;