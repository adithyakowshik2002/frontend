import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './confirmation.css'; // Assuming you have a CSS file for styling
const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);
 
  if (!state) return null;
 
  const { patientName } = state;
 
  return (
    <div className="confirmation-container">
      <h1>Appointment Confirmed</h1>
      <p>Thank you, <strong>{patientName}</strong>. Your appointment has been booked successfully.</p>
    </div>
  );
};
 
export default Confirmation;
 
 