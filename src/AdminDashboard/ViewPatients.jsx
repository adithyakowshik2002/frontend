import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewPatients.css';
import axiosInstance from '../assets/axiosConfig'; // Import axiosInstance

function ViewPatients() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Use axiosInstance to fetch patient data
    axiosInstance
      .get('/api/patients/getallpatients')  // Assuming '/patients/getallpatients' is the endpoint
      .then((res) => {
        setPatients(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error('Error fetching patients:', err));
  }, []);

  const handleSavePrescription = (patient) => {
    const appointment = patient.appointments?.[0];
    console.log(appointment?.appointmentId); // Adjust this logic if needed
    if (!appointment) {
      alert("No appointment found to save prescription.");
      return;
    }

    navigate('/save-prescription', {
      state: {
        appointmentId: appointment.appointmentId,
      },
    });
  };

  const handleViewPrescriptions = (patientId) => {
    navigate('/view-prescriptions', { state: { patientId } });
  };

  const handleGoBack = () => {
    navigate('/admin-dashboard');
  };

  const handleGenerateIpDailyLog = (patient) => {
    if (!patient.appointments || patient.appointments.length === 0) {
      alert("No appointment found for IP billing.");
      return;
    }

    const ipAppointment = patient.appointments.find((appt) => appt.appointmentType === 'IP');
    if (!ipAppointment) {
      alert("No IP appointment found for this patient.");
      return;
    }

    navigate('/daily-ip-billing', {
      state: {
        appointmentId: ipAppointment.appointmentId,
      },
    });
  };

  const handleViewAppointments = (patientId) => {
    navigate('/view-appointments', { state: { patientId } });
  };

  const handleGenerateBill = (patient) => {
    if (!patient.appointments || patient.appointments.length === 0) {
      alert("No appointment found for billing.");
      return;
    }

    const ipAppointment = patient.appointments.find((appt) => appt.appointmentType === 'IP');
    const selectedAppointment = ipAppointment || patient.appointments[0];

    navigate('/billing', {
      state: {
        patient,
        appointment: selectedAppointment,
      },
    });
  };

  return (
    <div className="patients-container">
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn" onClick={handleGoBack}>⬅ Go Back</button>
      </div>
      <h2 className="heading">Patients List</h2>
      <ul className="card-list">
        {patients.map((patient) => (
          <li key={patient.id} className="card">
            <div className="card-line"><strong>ID:</strong> {patient.id}</div>
            <div className="card-line"><strong>Name:</strong> {patient.firstName} {patient.lastName}</div>
            <div className="card-line"><strong>Gender:</strong> {patient.gender}</div>
            <div className="card-line"><strong>DOB:</strong> {patient.dateOfBirth}</div>
            <div className="card-line"><strong>Email:</strong> {patient.email}</div>
            <div className="card-line"><strong>Phone:</strong> {patient.phoneNumber}</div>

            {patient.appointments && patient.appointments.length > 0 ? (
              <div className="card-line">
                <strong>Appointment Type:</strong>{" "}
                {patient.appointments.find((appt) => appt.appointmentType === 'IP')?.appointmentType || 'OP'}
              </div>
            ) : (
              <div className="card-line"><strong>Appointment Type:</strong> None</div>
            )}

            <div className="card-actions-patient">
              <button className="btn" onClick={() => handleGenerateBill(patient)}>Generate Bill</button>
              <button className="btn" onClick={() => handleViewAppointments(patient.id)}>View Appointments</button>
              <button className="btn" onClick={() => handleViewPrescriptions(patient.id)}>View Prescriptions</button>

              <button className="btn" onClick={() => handleGenerateIpDailyLog(patient)}>
                Generate IP Daily Log
              </button>

              <button className="btn" onClick={() => handleSavePrescription(patient)}>
                Save Prescription
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn" onClick={handleGoBack}>⬅ Go Back</button>
      </div>
    </div>
  );
}

export default ViewPatients;
