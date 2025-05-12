
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DoctorAppointments.css';

function DoctorAppointments() {
  const { doctorId } = useParams();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9090/api/appointments/fetch-appointments/${doctorId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }, [doctorId]);

  return (
    <div className="appointments-container">
      <h1 className="appointments-title">Doctor Appointments</h1>
      <h2 className="appointments-subtitle">Appointments for Doctor ID: {doctorId}</h2>
      {appointments.length === 0 ? (
        <p className="no-appointments">No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead className="appointments-header">
            <tr>
              <th className="appointments-header-cell">Appointment ID</th>
              <th className="appointments-header-cell">Patient Name</th>
              <th className="appointments-header-cell">Date</th>
              <th className="appointments-header-cell">Time Slot</th>
              <th className="appointments-header-cell">Type</th>
            </tr>
          </thead>
          <tbody className="appointments-body">
            {appointments.map((appointment) => (
              <tr key={appointment.appointmentId} className="appointments-row">
                <td className="appointments-cell" data-label="Appointment ID">{appointment.appointmentId}</td>

                <td className="appointments-cell">{appointment.patientName}</td>
                <td className="appointments-cell">{appointment.appointmentDate}</td>
                <td className="appointments-cell">{appointment.timeslot}</td>
                <td className="appointments-cell">{appointment.appointmentType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DoctorAppointments;
