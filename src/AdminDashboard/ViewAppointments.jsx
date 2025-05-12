import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ViewAppointments() {
  const location = useLocation();
  const navigate = useNavigate();
  const patientId = location.state?.patientId;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID not provided.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:9090/api/appointments/appointments/${patientId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch appointments');
        return res.json();
      })
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error fetching appointments.");
        setLoading(false);
      });
  }, [patientId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="container">
      <h2>Appointments for Patient ID: {patientId}</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.appointmentId}>
                <td>{appt.appointmentId}</td>
                <td>{appt.appointmentDate}</td>
                <td>{appt.timeslot}</td>
                <td>{appt.appointmentType}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleBack}>⬅ Go Back</button>
      </div>
    </div>
  );
}

export default ViewAppointments;
