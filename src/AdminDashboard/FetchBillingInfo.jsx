import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../assets/axiosConfig'; 
import './FetchBillingInfo.css';

function FetchBillingInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { patient, appointment } = location.state || {};
  const [billingDetails, setBillingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isIP = appointment?.appointmentType === 'IP';

  useEffect(() => {
    if (!appointment) return;

    const fetchBillingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/billing/${appointment.appointmentId}`);

        if (response.status === 409) {
          setError(response.data.message || "Billing already recorded.");
          setLoading(false);
          return;
        }

        setBillingDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch billing details:', err);
        if (err.response?.status === 409) {
          setError(err.response.data?.message || 'Billing already recorded.');
        } else {
          setError('Failed to load billing details.');
        }
        setLoading(false);
      }
    };

    fetchBillingDetails();
  }, [appointment]);

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/view-patients');
    }
  };

  if (!patient || !appointment) return <p>Invalid billing data.</p>;
  if (loading) return <p>Loading billing details...</p>;
  if (error)
    return (
      <div className="billing-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <button className="btn back-btn" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );

  return (
    <div className="billing-container">
      <h2>Billing Details</h2>

      <table className="billing-table">
        <tbody>
          <tr><td><strong>Patient Name</strong></td><td>{patient.firstName} {patient.lastName}</td></tr>
          <tr><td><strong>Appointment Type</strong></td><td>{appointment.appointmentType}</td></tr>
          <tr><td><strong>Appointment ID</strong></td><td>{appointment.appointmentId}</td></tr>
          <tr><td><strong>Discharge Date</strong></td><td>{billingDetails.dischargeDate}</td></tr>
          <tr>
            <td><strong>Payment Status</strong></td>
            <td className={billingDetails.paymentStatus === 'Paid' ? 'paid-status' : ''}>
              {billingDetails.paymentStatus}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Billing Breakdown</h3>
      <table className="billing-table">
        <tbody>
          {!isIP && (
            <tr>
              <td><strong>Consultation Fee</strong></td>
              <td>{billingDetails.opBilling?.consultationFee || 0}</td>
            </tr>
          )}
          <tr>
            <td><strong>Medication Charges</strong></td>
            <td>{billingDetails.totalMedicationFee}</td>
          </tr>
          {isIP && (
            <>
              <tr><td><strong>Room Charges</strong></td><td>{billingDetails.totalRoomFee}</td></tr>
              <tr><td><strong>Service Charges</strong></td><td>{billingDetails.totalServiceFee}</td></tr>
            </>
          )}
          <tr>
            <td><strong>Total Amount</strong></td>
            <td><strong>{billingDetails.totalAmount}</strong></td>
          </tr>
        </tbody>
      </table>

      <button className="btn back-btn" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
}

export default FetchBillingInfo;
