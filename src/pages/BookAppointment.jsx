import React, { useEffect, useState } from 'react';
import './Appointment.css';
import { useNavigate } from 'react-router-dom';

function BookAppointmentPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [availableDates, setAvailableDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8081/api/doctors/getalldoctors')
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error('Error fetching doctors:', error));
  }, []);

  const handleDoctorClick = (doctorId) => {
    if (selectedDoctorId === doctorId) {
      // Deselect if already selected
      setSelectedDoctorId(null);
      setSelectedDate(null);
      setAvailableSlots({});
      setSelectedSlot(null);
      setSelectedScheduleId(null);
      return;
    }

    setSelectedDoctorId(doctorId);
    setSelectedDate(null);
    setAvailableSlots({});
    setSelectedSlot(null);
    setSelectedScheduleId(null);

    if (!availableDates[doctorId]) {
      fetch(`http://localhost:8081/api/doctors/schedule-dates/${doctorId}`)
        .then((res) => res.json())
        .then((dates) => {
          setAvailableDates((prevDates) => ({
            ...prevDates,
            [doctorId]: dates,
          }));
        })
        .catch((error) => {
          console.error('Error fetching available dates:', error);
        });
    }
  };

  const handleDateClick = (doctorId, date) => {
    setSelectedDate(date);
    setAvailableSlots({});
    setSelectedSlot(null);
    setSelectedScheduleId(null);

    fetch(`http://localhost:8081/api/doctors/available/slots/timings/${doctorId}?date=${date}`)
      .then((res) => res.json())
      .then((slots) => {
        setAvailableSlots((prev) => ({
          ...prev,
          [doctorId]: { ...(prev[doctorId] || {}), [date]: slots }
        }));
      })
      .catch((error) => {
        console.error('Error fetching slots:', error);
      });
  };

  const handleSlotClick = (doctorId, date, slot) => {
    setSelectedSlot(slot);

    fetch(`http://localhost:8081/api/doctors/get-schedule-id/${doctorId}?date=${date}&time=${slot}`)
      .then((res) => res.json())
      .then((scheduleId) => {
        setSelectedScheduleId(scheduleId);
      })
      .catch((error) => console.error('Error fetching scheduleId:', error));
  };

  const handleFillFormClick = () => {
    if (selectedScheduleId) {
      navigate(`/fill-patient-form/${selectedScheduleId}`);
    }
  };

  return (
    <div className="book-appointment-container">
      <nav className="navbar">
        <h1>Welcome to Apollo Hospitals</h1>
      </nav>

      <div className="doctor-list">
        <h2>Available Doctors</h2>
        {doctors.length > 0 ? (
          <ul>
            {doctors.map((doc) => (
              <li
                key={doc.id}
                className={`doctor-card ${selectedDoctorId === doc.id ? 'selected' : ''}`}
                onClick={() => handleDoctorClick(doc.id)}
              >
                <div className="doctor-content">
                  <div className="doctor-info">
                    <h3>{doc.name}</h3>
                    <p>Specialization: {doc.specialization || 'N/A'}</p>
                    <p>Experience: {doc.experienceYears ? `${doc.experienceYears} Years` : 'N/A'}</p>
                    <p>Location: {doc.location || 'N/A'}</p>
                    <p>Languages: {doc.languages || 'N/A'}</p>
                  </div>
                  <img
                    src={
                      doc.profileImageBase64
                        ? `data:image/jpeg;base64,${doc.profileImageBase64}`
                        : '/default-profile.png'
                    }
                    alt={doc.name}
                    className="doctor-image"
                  />
                </div>

                {selectedDoctorId === doc.id && (
                  <div className="available-dates">
                    <strong>Available Dates:</strong>
                    <div className="date-list">
                      {(availableDates[doc.id] || []).map((dateObj, index) => (
                        <span
                          key={index}
                          className={`date-pill ${selectedDate === dateObj.availableDate ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateClick(doc.id, dateObj.availableDate);
                          }}
                        >
                          {dateObj.availableDate}
                        </span>
                      ))}
                    </div>

                    {/* Show slots only if a date is selected */}
                    {selectedDate && availableSlots[doc.id]?.[selectedDate] && (
                      <div className="slot-list">
                        <strong>Available Slots:</strong>
                        <div className="slot-pill-container">
                          {availableSlots[doc.id][selectedDate].map((slot, i) => {
                            const slotValue = typeof slot === 'object' && slot.slot ? slot.slot : slot;
                            const isSelected = selectedSlot === slotValue;

                            return (
                              <span
                                key={i}
                                className={`slot-pill ${isSelected ? 'selected-slot' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlotClick(doc.id, selectedDate, slotValue);
                                }}
                              >
                                {slotValue}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Show Fill Form button only if a slot is selected */}
                    {selectedSlot && (
                      <div style={{ marginTop: '1rem' }}>
                        <button className="fill-form-button" onClick={handleFillFormClick}>
                          Fill Patient Form
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default BookAppointmentPage;
