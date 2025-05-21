import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../assets/axiosConfig'; 
import './BillingPage.css';

function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patient, appointment } = location.state || {};
  const [billingPreview, setBillingPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(null);

  const isIP = appointment?.appointmentType === 'IP';

  useEffect(() => {
    if (!appointment) return;

    const previewUrl = isIP
      ? `/api/billing/preview/ip/${appointment.appointmentId}`
      : `/api/billing/preview/op/${appointment.appointmentId}`;

    axiosInstance
      .get(previewUrl)
      .then(res => {
        if (res.status === 409 || res.data?.message === 'Billing already recorded') {
          setError('Billing already recorded for this appointment.');
          navigate('/view-billing', {
            state: { patient, appointment, from: '/view-patients' }
          });
        } else {
          setBillingPreview(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Preview fetch failed:', err);
        alert('Failed to load billing preview.');
        setLoading(false);
      });
  }, [appointment, isIP, navigate, patient]);

  const handlePayNow = () => {
    const payUrl = isIP
      ? `/api/billing/discharge?appointmentId=${appointment.appointmentId}`
      : `/api/billing/op/${appointment.appointmentId}`;

    const payload = isIP ? appointment : {};

    axiosInstance
      .post(payUrl, payload)
      .then(res => {
        alert('Payment recorded successfully!');
        setBillingPreview(res.data);
        setIsPaid(true);
      })
      .catch(err => {
        console.error('Payment failed:', err);
        alert('Payment failed.');
      });
  };

  if (!patient || !appointment) return <p>Invalid billing data.</p>;
  if (loading) return <p>Loading billing preview...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="billing-container">
      <h2>Billing Preview</h2>

      <table className="billing-table">
        <tbody>
          <tr><td><strong>Patient Name</strong></td><td>{patient.firstName} {patient.lastName}</td></tr>
          <tr><td><strong>Appointment Type</strong></td><td>{appointment.appointmentType}</td></tr>
          <tr><td><strong>Appointment ID</strong></td><td>{appointment.appointmentId}</td></tr>
        </tbody>
      </table>

      <h3>Billing Breakdown</h3>
      <table className="billing-table">
        {!isIP && (
          <tr>
            <td><strong>Consultation Fee</strong></td>
            <td>{billingPreview.opBilling?.consultationFee || 0}</td>
          </tr>
        )}
        <tr>
          <td><strong>Medication Charges</strong></td>
          <td>{billingPreview.medicationFee}</td>
        </tr>
        {isIP && (
          <>
            <tr><td><strong>Room Charges</strong></td><td>{billingPreview.roomCharges}</td></tr>
            <tr><td><strong>Service Charges</strong></td><td>{billingPreview.totalServiceFee}</td></tr>
          </>
        )}
        <tr>
          <td><strong>Total Amount</strong></td>
          <td><strong>{billingPreview.totalAmount}</strong></td>
        </tr>
      </table>

      {!isPaid && (
        <button className="btn pay-btn" onClick={handlePayNow}>
          Pay Now
        </button>
      )}

      {isPaid && <p className="success-message">✔ Billing successfully recorded!</p>}
    </div>
  );
}

export default BillingPage;
