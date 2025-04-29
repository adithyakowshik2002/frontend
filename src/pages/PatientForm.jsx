import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './patientformcss.css'
const PatientForm = () => {
  const { scheduleId } = useParams();
  const [patient, setPatient] = useState({
    name: '',
    gender: '',
    age: '',
    contact: '',
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = {
      scheduleId: scheduleId,
      patientDetails: patient
    };

    try {
      const response = await fetch('http://localhost:8082/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
      } else {
        alert('Failed to book appointment.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div>
      <h2>Fill Patient Details</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Name"
          value={patient.name}
          onChange={handleChange}
          required
        />
        <input 
          type="text" 
          name="gender" 
          placeholder="Gender"
          value={patient.gender}
          onChange={handleChange}
          required
        />
        <input 
          type="number" 
          name="age" 
          placeholder="Age"
          value={patient.age}
          onChange={handleChange}
          required
        />
        <input 
          type="text" 
          name="contact" 
          placeholder="Contact Number"
          value={patient.contact}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default PatientForm;
