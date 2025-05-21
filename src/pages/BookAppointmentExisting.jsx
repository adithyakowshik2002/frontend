import React, { useEffect, useState } from 'react';
import './Appointment.css'; // Reuse same styles
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookAppointmentExistingcss.css';
function BookAppointmentExisting() {
  const { patientId } = useParams();
  const [email, setEmail] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [availableDates, setAvailableDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
 
  useEffect(() => {
    fetch(`http://localhost:9090/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => setEmail(data.email))
      .catch(err => console.error('Failed to fetch patient email:', err));
  }, [patientId]);
 
  useEffect(() => {
    fetch('http://localhost:9090/api/doctors/getalldoctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error('Failed to fetch doctors:', err));
  }, []);
 
  const handleDoctorClick = (doctorId) => {
    setSelectedDoctorId(prev => (prev === doctorId ? null : doctorId));
    setSelectedDate(null);
    setSelectedSlot('');
 
    if (!availableDates[doctorId]) {
      fetch(`http://localhost:9090/api/doctors/schedule-dates/${doctorId}`)
        .then(res => res.json())
        .then(data => {
          setAvailableDates(prev => ({ ...prev, [doctorId]: data }));
        })
        .catch(err => console.error('Error fetching available dates:', err));
    }
  };
 
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSlot('');
 
    fetch(`http://localhost:9090/api/doctors/available/slots/timings/${selectedDoctorId}?date=${date}`)
      .then(res => res.json())
      .then(data => setAvailableSlots(data))
      .catch(err => console.error('Error fetching available slots:', err));
  };
 
  const handleBookSlot = async () => {
    if (!selectedSlot) {
      toast.error('Please select a slot to book');
      return;
    }
 
    try {
      const response = await fetch(`http://localhost:9090/api/patients/book-existing?patientId=${patientId}&doctorId=${selectedDoctorId}&slotDate=${selectedDate}&slotStartTime=${selectedSlot}`, {
        method: 'POST',
      });
 
      if (response.ok) {
        toast.success('Appointment booked successfully!');
      } else {
        toast.error('Booking failed!');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Something went wrong while booking.');
    }
  };
 
  return (
    <div className="book-appointment-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <nav className="navbar">
        <h2>Book Appointment for Existing Patient</h2>
      </nav>
      <p><strong>Patient Email:</strong> {email}</p>
 
      <div className="doctor-list">
        {doctors.map(doc => (
          <li
            key={doc.id}
            className={`doctor-card ${selectedDoctorId === doc.id ? 'selected' : ''}`}
            onClick={() => handleDoctorClick(doc.id)}
          >
            <div className="doctor-content">
              <div className="doctor-info">
                <h3>{doc.name}</h3>
                <p>Specialization: {doc.specialization || 'N/A'}</p>
                <p>Experience: {doc.experienceYears} Years</p>
                <p>Location: {doc.location}</p>
                <p>Languages: {doc.languages}</p>
              </div>
              <img
                src={doc.profileImageBase64 ? `data:image/jpeg;base64,${doc.profileImageBase64}` : '/default-profile.png'}
                alt={doc.name}
                className="doctor-image"
              />
            </div>
 
            {selectedDoctorId === doc.id && (
              <div className="available-dates">
                <strong>Available Dates:</strong>
                <div className="date-list">
                  {(availableDates[doc.id] || []).map((d, index) => (
                    <span
                      key={index}
                      className={`date-pill ${selectedDate === d.availableDate ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(d.availableDate);
                      }}
                    >
                      {d.availableDate}
                    </span>
                  ))}
                </div>
              </div>
            )}
 
            {selectedDoctorId === doc.id && selectedDate && availableSlots.length > 0 && (
              <div className="slot-selection">
                <strong>Select Slot:</strong>
                <div className="date-list">
                  {availableSlots.map((slotObj, index) => (
                    <span
                      key={index}
                      className={`date-pill ${selectedSlot === slotObj.slot ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlot(slotObj.slot);
                      }}
                    >
                      {slotObj.slot}
                    </span>
                  ))}
                </div>
                <button className="fill-form-button" onClick={handleBookSlot}>
                  Book Appointment
                </button>
              </div>
            )}
          </li>
        ))}
      </div>
    </div>
  );
}
 
export default BookAppointmentExisting;