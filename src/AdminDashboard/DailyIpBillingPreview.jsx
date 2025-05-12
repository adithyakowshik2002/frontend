import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const IpBillingPreview = () => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const appointmentId = location.state?.appointmentId;
  const fetchPreview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9090/api/billing/ip/daily-log/preview/${appointmentId}`);
      setPreviewData(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error fetching preview');
    } finally {
      setLoading(false);
    }
  };

  const generateIpBill = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:9090/api/billing/ip/daily-log/${appointmentId}`);
      setMessage('IP Bill successfully generated need to be paid');
    } catch (error) {
      setMessage('Failed to generate IP bill or already generated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchPreview} disabled={loading}>
        Preview IP Daily Log
      </button>

      {previewData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Preview Daily IP Billing</h3>
          <p><strong>Date:</strong> {previewData.date}</p>
          <p><strong>Service Fee:</strong> ₹{previewData.serviceFee}</p>
          <p><strong>Medication Fee:</strong> ₹{previewData.medicationFee}</p>
          <p><strong>Room Fee:</strong> ₹{previewData.roomFee}</p>
          <p><strong>Room Type:</strong> {previewData.roomType}</p>

          <button onClick={generateIpBill} disabled={loading}>
            Generate IP Daily Bill
          </button>
        </div>
      )}

      {message && <p style={{ color: 'blue' }}>{message}</p>}
    </div>
  );
};

export default IpBillingPreview;
