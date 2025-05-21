import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './patientformcss.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const PatientForm = () => {
  const navigate = useNavigate();
  const { doctorId, slotDate } = useParams();
 
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '');
  const [selectedDate, setSelectedDate] = useState(slotDate || '');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
 
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
 
  // Fetch available time slots
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetch(`http://localhost:9090/api/doctors/available/slots/timings/${selectedDoctorId}?date=${selectedDate}`)
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
    setErrors(prev => ({ ...prev, [name]: '' })); // clear field error when user types
  };
 
  const handleSendOtp = () => {
    if (!patientData.email) {
      toast.warn('Please enter email before sending OTP');
      return;
    }
   
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientData.email)) {
      toast.warn('Please enter a valid email address');
      return;
    }
 
    fetch(`http://localhost:9090/mail/send-otp?email=${patientData.email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mailId: patientData.email })
    })
      .then(res => {
        if (res.ok) {
          setOtpSent(true);
          setShowOtpModal(true);
          toast.success('OTP sent to email');
        } else {
          throw new Error('Failed to send OTP');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Error sending OTP');
      });
  };
 
  const handleVerifyOtp = () => {
    if (!otp) {
      toast.warn('Please enter OTP');
      return;
    }
 
    fetch(`http://localhost:9090/mail/verify-otp?email=${patientData.email}&otp=${otp}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mailId: patientData.email,
        otp: otp
      })
    })
      .then(res => {
        if (res.ok) {
          setOtpVerified(true);
          setShowOtpModal(false);
          toast.success('OTP Verified!');
        } else {
          throw new Error('Invalid OTP');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Invalid OTP. Please try again.');
        navigate("/fill-patient-form/:doctorId/:slotDate");
      });
  };
 
  const handleBookSlotClick = () => {
    if (!otpVerified) {
      toast.warn('Please verify your email with OTP first');
      return;
    }
 
    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      toast.warn('Please select doctor, date, and slot.');
      return;
    }
 
    const confirmBooking = window.confirm('Are you sure you want to book this slot?');
    if (!confirmBooking) return;
 
    fetch(`http://localhost:9090/api/patients/register?doctorId=${selectedDoctorId}&slotDate=${selectedDate}&slotStartTime=${selectedSlot}&otp=${otp}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    })
      .then(res => {
        if (res.ok) return res.text();
        return res.json().then(err => {
          throw err;
        });
      })
      .then(data => {
        toast.success('Appointment booked successfully!');
        setTimeout(() => {
          navigate('/confirmation', {
            state: {
              patientName: `${patientData.firstName} ${patientData.lastName}`,
            }
          });
        }, 1000);
      })
      .catch(err => {
        if (typeof err === 'object') {
          setErrors(err);
          const firstField = Object.keys(err)[0];
          toast.error(err[firstField]);
        } else {
          toast.error('Error booking slot: ' + err.message);
        }
      });
  };
 
  return (
    <div className="patient-form-container">
      <h2 className="patient-form-heading">Book Appointment</h2>
      <ToastContainer position="top-center" autoClose={3000} />
 
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
 
      {[
        { label: 'First Name', name: 'firstName' },
        { label: 'Last Name', name: 'lastName' },
        { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
        { label: 'Aadhar Number', name: 'aadhar' },
        { label: 'Phone Number', name: 'phoneNumber' },
        { label: 'Address', name: 'address' }
      ].map(({ label, name, type = 'text' }) => (
        <div className="patient-form-group" key={name}>
          <label className="patient-form-label"><strong>{label}:</strong></label>
          <input
            type={type}
            className={`patient-form-input ${errors[name] ? 'error-input' : ''}`}
            name={name}
            placeholder={label}
            value={patientData[name]}
            onChange={handleInputChange}
          />
          {errors[name] && <p className="error-message">{errors[name]}</p>}
        </div>
      ))}
 
      <div className="patient-form-group" style={{ position: 'relative' }}>
        <label className="patient-form-label">
          <strong>Email:</strong>
          {otpVerified && <span style={{ color: 'green', marginLeft: '10px' }}>✓ Verified</span>}
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="email"
            className={`patient-form-input ${errors.email ? 'error-input' : ''}`}
            name="email"
            placeholder="Email"
            value={patientData.email}
            onChange={handleInputChange}
            style={{ flex: 1 }}
            disabled={otpVerified}
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent || otpVerified}
            style={{
              marginLeft: '10px',
              padding: '6px 10px',
              background: otpVerified ? '#28a745' : (otpSent ? '#6c757d' : '#007bff'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {otpVerified ? 'Verified' : (otpSent ? 'OTP Sent' : 'Send OTP')}
          </button>
        </div>
        {errors.email && <p className="error-message">{errors.email}</p>}
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
        <label className="patient-form-label"><strong>Blood Group:</strong></label>
        <select className="patient-form-select" name="bloodGroup" value={patientData.bloodGroup} onChange={handleInputChange}>
          {['O_POSITIVE', 'O_NEGATIVE', 'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'].map(bg => (
            <option key={bg} value={bg}>
              {bg.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-')}
            </option>
          ))}
        </select>
      </div>
 
      <button className="patient-form-button" onClick={handleBookSlotClick} disabled={!otpVerified}>
        Book Slot
      </button>
 
      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verify OTP</h3>
            <p>We've sent a 6-digit OTP to your email {patientData.email}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="otp-input"
            />
            <div className="modal-buttons">
              <button onClick={handleVerifyOtp} className="verify-button">
                Verify OTP
              </button>
              <button onClick={() => setShowOtpModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default PatientForm;