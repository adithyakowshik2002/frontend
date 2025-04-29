import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Import useParams to get doctorId from URL

const DoctorSchedule = () => {
  const { doctorId } = useParams(); // Get doctorId from URL
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!selectedDate || !doctorId) {
      setStatus('Please select a date and ensure doctor ID is set.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert to yyyy-MM-dd format

    try {
      // Make POST request to backend to schedule availability
      const response = await axios.post(
        `http://localhost:8080/api/doctor/availability/${doctorId}`,
        {},
        { params: { availableDate: formattedDate } }
      );
      setStatus(`Date ${formattedDate} scheduled successfully!`);
    } catch (error) {
      // Handle errors and display messages
      setStatus(error.response?.data?.message || 'Error scheduling date');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto shadow rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Schedule Available Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}  // Update selected date
        dateFormat="yyyy-MM-dd"                     // Ensure date format is consistent
        className="p-2 border rounded w-full mb-4"
        placeholderText="Select a date"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Schedule Date
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>} {/* Display status message */}
    </div>
  );
};

export default DoctorSchedule;
