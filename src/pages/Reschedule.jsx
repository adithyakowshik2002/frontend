import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../assets/axiosConfig'; // Adjust the path if needed
import './reschedule.css';

const Reschedule = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const email = localStorage.getItem('email');

    if (!jwt) {
      setError('You are not logged in.');
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode(jwt);
    const roles = decodedToken.authorities;

    if (roles !== 'DOCTOR') {
      setError('You are not authorized.');
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const doctorRes = await axiosInstance.get(`/api/doctors/email/${email}`);
        const doctorData = doctorRes.data;
        console.log(doctorData);
        const docId = doctorData.id;
        setDoctorId(docId);

        const datesRes = await axiosInstance.get(`/api/doctors/schedule-dates/${docId}`);
        setAvailableDates(datesRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch doctor or date data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

  const fetchSlots = async (date) => {
    try {
      const formattedDate = formatDate(date);
      const res = await axiosInstance.get(`/api/doctors/slots-status/${doctorId}?date=${formattedDate}`);
      setSlots(res.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleRescheduleToggle = async (slotId) => {
    const time = selectedSlot.slot;
    const formattedTime = time.slice(0, 5);
    const formattedDate = formatDate(selectedDate);

    try {
      const response = await axiosInstance.get(
        `/api/doctors/data/${doctorId}?date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(formattedTime)}`
      );

      const data = response.data;
      const patientId = data.patientId;

      await axiosInstance.put(
        `/api/doctors/reschedule/${doctorId}/${patientId}?date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(formattedTime)}`
      );

      alert('Reschedule successful: Email sent and slot status updated.');
      fetchSlots(selectedDate);
    } catch (error) {
      console.error('Error during reschedule:', error.response?.data || error.message);
    }
  };

  const handleRemoveSlot = async () => {
    const formattedDate = formatDate(selectedDate);

    try {
      await axiosInstance.delete(`/api/doctors/delete-slots/${doctorId}/${formattedDate}`);
      alert('Date and slots removed successfully.');
      setSelectedDate('');
      setSlots([]);
      const updatedDates = availableDates.filter(d => d.availableDate !== selectedDate);
      setAvailableDates(updatedDates);
    } catch (error) {
      console.error('Failed to remove slot:', error.response?.data || error.message);
      alert('An unexpected error occurred.');
    }
  };

  const canRemoveSlot = () => {
    return slots.length > 0 && slots.every(
      s => !s.booked || (s.booked && s.rescheduled)
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="reschedule-container">
      <h2>Reschedule Appointments</h2>
      <h4>Select a date to view and manage slots</h4>

      <div className="date-list">
        {availableDates.length > 0 ? (
          availableDates.map((dateObj, index) => (
            <button
              key={index}
              className={`date-button ${selectedDate === dateObj.availableDate ? 'active' : ''}`}
              onClick={() => handleDateClick(dateObj.availableDate)}
            >
              {new Date(dateObj.availableDate).toLocaleDateString()}
            </button>
          ))
        ) : (
          <p>No available dates found.</p>
        )}
      </div>

      {selectedDate && (
        <div className="slot-list">
          <h4>Slots for {new Date(selectedDate).toLocaleDateString()}</h4>
          {slots.length === 0 ? (
            <p>No slots available for this date.</p>
          ) : (
            <ul>
              {slots.map((slotObj, index) => {
                const isSelected = selectedSlot && selectedSlot.slotId === slotObj.slotId;
                const slotStatus = slotObj.booked
                  ? slotObj.rescheduled
                    ? 'Rescheduled'
                    : 'Booked'
                  : 'Available';

                return (
                  <li
                    key={index}
                    onClick={() => handleSlotClick(slotObj)}
                    className={
                      slotObj.booked
                        ? slotObj.rescheduled
                          ? 'rescheduled-slot'
                          : 'booked-slot'
                        : 'available-slot'
                    }
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      <strong>{`${slotObj.slot} ${slotStatus}`}</strong>
                    </span>

                    {isSelected && slotObj.booked && !slotObj.rescheduled && (
                      <button
                        className="reschedule-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to reschedule this slot?')) {
                            handleRescheduleToggle(slotObj.slotId);
                          }
                        }}
                      >
                        Reschedule
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {canRemoveSlot() && (
            <button className="remove-slot-button" onClick={handleRemoveSlot}>
              Remove This Slot
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Reschedule;
