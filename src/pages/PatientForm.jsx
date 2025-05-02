import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './patientformcss.css';

const PatientForm = () => {
  const navigate = useNavigate();
  const { doctorId, slotDate } = useParams();

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '');
  const [selectedDate, setSelectedDate] = useState(slotDate || '');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    dateOfBirth: '',
    aadhar: '',
    email: '',
    phoneNumber: '',
    address: '',
    bloodGroup: 'O_POSITIVE'
  });

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetch(`http://localhost:8081/api/doctors/available/slots/timings/${selectedDoctorId}?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAvailableSlots(data);
          } else {
            setAvailableSlots([]);
            console.error('Expected an array but got:', data);
          }
        })
        .catch(err => {
          console.error('Failed to fetch slots', err);
          setAvailableSlots([]);
        });
    }
  }, [selectedDoctorId, selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookSlotClick = () => {
    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      alert('Please select doctor, date, and slot.');
      return;
    }

    const confirmBooking = window.confirm('Are you sure you want to book this slot?');
    if (!confirmBooking) return;

    fetch(`http://localhost:8082/api/patients?doctorId=${selectedDoctorId}&slotDate=${selectedDate}&slotStartTime=${selectedSlot}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    })
      .then(res => res.ok ? res.text() : res.text().then(text => { throw new Error(text); }))
      .then(data => {
        alert('Success: ' + data);
        navigate('/confirmation');
      })
      .catch(err => alert('Error booking slot: ' + err.message));
  };

  return (
    <div className="patient-form-container">
      <h2 className="patient-form-heading">Book Appointment</h2>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Selected Date:</strong></label>
        <input type="date" className="patient-form-input" value={selectedDate} readOnly />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Select Slot:</strong></label>
        <select className="patient-form-select" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
          <option value="">-- Select Slot --</option>
          {availableSlots.map((s, index) => (
            <option key={index} value={s.slot}>
              {s.slot}
            </option>
          ))}
        </select>
      </div>

      <h3 className="patient-form-subheading">Patient Details</h3>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>First Name:</strong></label>
        <input type="text" className="patient-form-input" name="firstName" placeholder="First Name" value={patientData.firstName} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Last Name:</strong></label>
        <input type="text" className="patient-form-input" name="lastName" placeholder="Last Name" value={patientData.lastName} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Gender:</strong></label>
        <select className="patient-form-select" name="gender" value={patientData.gender} onChange={handleInputChange}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Date of Birth:</strong></label>
        <input type="date" className="patient-form-input" name="dateOfBirth" value={patientData.dateOfBirth} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Aadhar Number:</strong></label>
        <input type="text" className="patient-form-input" name="aadhar" placeholder="Aadhar Number" value={patientData.aadhar} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Email:</strong></label>
        <input type="email" className="patient-form-input" name="email" placeholder="Email" value={patientData.email} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Phone Number:</strong></label>
        <input type="text" className="patient-form-input" name="phoneNumber" placeholder="Phone Number" value={patientData.phoneNumber} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Address:</strong></label>
        <input type="text" className="patient-form-input" name="address" placeholder="Address" value={patientData.address} onChange={handleInputChange} />
      </div>

      <div className="patient-form-group">
        <label className="patient-form-label"><strong>Blood Group:</strong></label>
        <select className="patient-form-select" name="bloodGroup" value={patientData.bloodGroup} onChange={handleInputChange}>
          <option value="O_POSITIVE">O+</option>
          <option value="O_NEGATIVE">O-</option>
          <option value="A_POSITIVE">A+</option>
          <option value="A_NEGATIVE">A-</option>
          <option value="B_POSITIVE">B+</option>
          <option value="B_NEGATIVE">B-</option>
          <option value="AB_POSITIVE">AB+</option>
          <option value="AB_NEGATIVE">AB-</option>
        </select>
      </div>

      <button className="patient-form-button" onClick={handleBookSlotClick}>Book Slot</button>
    </div>
  );
};

export default PatientForm;
