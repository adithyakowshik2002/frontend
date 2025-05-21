import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './aadharvalidation.css';
import { ca } from 'date-fns/locale';
 
const AadharValidation = () => {
  const [aadhar, setAadhar] = useState('');
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
 
 
  const navigate = useNavigate();
  const { doctorId, slotDate } = useParams();
 
 
  const handleValidation = async () => {
    try {
        const response = await fetch(`http://localhost:9090/api/patients/aadhar/${aadhar}`);
 
        if(!response.ok){
            throw new Error('Patient not found');
        }
 
        const data = await response.json();
        console.log('Fetched patient ',data);
        setPatient(data);
        setError(''); // Clear any previous error
    }catch (err) {
        setPatient(null);
        setError('No patient found with this number');
    }
  };
  const handleProceed = () => {
    if (patient) {
      console.log(patient.id);
      navigate(`/book-appointment-existing/${patient.id}`);
    }
 
};  
 
return (
    <div className="aadhar-validation-container">
      <h3>Check if you already registered</h3>
      <input
        type="text"
        placeholder="Enter Aadhar Number"
        value={aadhar}
        onChange={(e) => setAadhar(e.target.value)}
      />
      <button onClick={handleValidation}>Check </button>
        {error && <p className="error-message">{error}</p>}
        {patient && (
        <div>
            <p>Patient Found: <strong>{patient.firstName} {patient.lastName}</strong></p>
            <button onClick={handleProceed}>Proceed to Book Appointment</button>
        </div>
        )}
    </div>
  );
};
 
export default AadharValidation;