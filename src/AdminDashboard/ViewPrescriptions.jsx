import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ViewPrescriptions.css';
import axiosInstance from '../assets/axiosConfig'; // Import axiosInstance

function ViewPrescriptions() {
  const location = useLocation();
  const { patientId } = location.state || {};
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (patientId) {
      // Use axiosInstance to fetch prescriptions data
      axiosInstance
        .get(`/api/prescriptions/get-prescriptions/${patientId}`)
        .then((res) => {
          setPrescriptions(res.data);
        })
        .catch((err) => console.error('Error fetching prescriptions:', err));
    }
  }, [patientId]);

  return (
    <div className="prescriptions-container">
      <h2>Prescriptions for Patient ID: {patientId}</h2>

      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        prescriptions.map((prescription) => (
          <div key={prescription.prescriptionId} className="prescription-section">
            <div className="prescription-header">
              <p><strong>Prescription ID:</strong> {prescription.prescriptionId}</p>
              <p><strong>Appointment ID:</strong> {prescription.appointmentId}</p>
              <p><strong>Date:</strong> {prescription.prescriptionDate}</p>
            </div>

            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Dosage</th>
                  <th>Duration (Days)</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, idx) => (
                  <tr key={idx}>
                    <td>{med.medicineName}</td>
                    <td>{med.dosage}</td>
                    <td>{med.durationDays}</td>
                    <td>{med.quantity}</td>
                    <td>₹{med.unitPrice.toFixed(2)}</td>
                    <td>₹{med.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewPrescriptions;

