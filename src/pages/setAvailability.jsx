import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./setavailability.css";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
 
const SetAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [doctorId, setDoctorId] = useState(null);
 
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const jwt = localStorage.getItem("jwt");
      const email = localStorage.getItem("email");
 
      if (!jwt || !email) {
        toast.error("Doctor authentication info missing.");
        return;
      }
 
      try {
        const res = await fetch(`http://localhost:9090/api/doctors/email/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
 
        if (res.ok) {
          const data = await res.json();
          setDoctorId(data.id);
          localStorage.setItem("doctorId", data.id);
        } else {
          toast.error("Failed to fetch doctor information.");
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        toast.error("Something went wrong while fetching doctor data.");
      }
    };
 
    fetchDoctorInfo();
  }, []);
 
  const handleTimeSubmit = async () => {
    if (!selectedDate || !fromTime || !toTime) {
      toast.warning("Please select a date and time range.");
      return;
    }
 
    const jwt = localStorage.getItem("jwt");
    const storedDoctorId = localStorage.getItem("doctorId");
 
    if (!jwt || !storedDoctorId) {
      toast.error("Doctor not logged in or missing required info.");
      return;
    }
 
    const payload = {
      availableDate: selectedDate.toISOString().split("T")[0],
      schedule: [
        {
          availableFrom: fromTime,
          availableTo: toTime,
        },
      ],
    };
 
    try {
      const res = await fetch(`http://localhost:9090/api/doctors/doctor/${storedDoctorId}/set-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });
 
      if (res.ok) {
        toast.success("Availability saved successfully!");
        setSelectedDate(null);
        setFromTime("");
        setToTime("");
      } else {
        const errorData = await res.json();
        console.error("Failed to save:", errorData);
        toast.error("Failed to save availability.");
      }
    } catch (err) {
      console.error("Error while saving availability:", err);
      toast.error("An error occurred while saving availability.");
    }
  };
 
  return (
    <div className="set-availability-container">
      <h2>Set Availability</h2>
 
      <button className="set-btn" onClick={() => setShowDatePicker(!showDatePicker)}>
        Set Date
      </button>
 
      {showDatePicker && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="date-picker"
          minDate={new Date()}
          inline
        />
      )}
 
      <button className="set-btn" onClick={() => setShowTimeFields(!showTimeFields)}>
        Set Time
      </button>
 
      {showTimeFields && (
        <div className="time-inputs">
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
          <button className="submit-btn" onClick={handleTimeSubmit}>
            Submit
          </button>
        </div>
      )}
 
      {/* Toast container renders toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};
 
export default SetAvailability;