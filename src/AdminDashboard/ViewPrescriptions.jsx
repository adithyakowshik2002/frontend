import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ViewPrescriptions.css';

function ViewPrescriptions() {
  const location = useLocation();
  const { patientId } = location.state || {};
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (patientId) {
      fetch(`http://localhost:9090/api/prescriptions/get-prescriptions/${patientId}`)
        .then(res => res.json())
        .then(data => setPrescriptions(data))
        .catch(err => console.error("Error fetching prescriptions:", err));
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
                  
                  <th>unit Price</th>
                  <th>Total price</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, idx) => (
                  <tr key={idx}>
                    <td>{med.medicineName}</td>
                    <td>{med.dosage}</td>
                    <td>{med.durationDays}</td>
                    <td>{med.quantity}</td>
                    
                    <td>₹{med.totalPrice.toFixed(2)}</td>
                    <td>₹{med.unitPrice.toFixed(2)}</td>
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
