import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./setavailability.css";

const SetAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [doctorId, setDoctorId] = useState(null);

  // Fetch doctor info on mount
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        console.log("JWT missing");
        return;
      }

      const email = localStorage.getItem("email"); // Get email from localStorage (make sure it's set there)

      if (!email) {
        console.log("Email missing");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8081/api/doctors/email/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Doctor data fetched:", data);
          const doctorId = data.id; // Assuming the doctor ID is in `data.id`
          setDoctorId(doctorId);
          localStorage.setItem("doctorId", doctorId); // Store doctorId in localStorage
        } else {
          console.error("Failed to fetch doctor data");
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    };

    fetchDoctorInfo();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const handleTimeSubmit = async () => {
    console.log("handleTimeSubmit called"); // Debugging
    if (!selectedDate || !fromTime || !toTime) {
      alert("Please select a date and time range.");
      console.log("Missing date or time fields."); // Debugging
      return;
    }

    const jwt = localStorage.getItem("jwt");
    const storedDoctorId = localStorage.getItem("doctorId");

    if (!jwt || !storedDoctorId) {
      alert("Doctor not logged in or missing required information.");
      console.log("JWT or Doctor ID missing."); // Debugging
      return;
    }

    const payload = {
      doctorId: storedDoctorId, // Use the doctorId from localStorage
      date: selectedDate.toISOString().split("T")[0], // format YYYY-MM-DD
      fromTime: fromTime,
      toTime: toTime,
    };

    console.log("Payload:", payload); // Debugging

    try {
      const res = await fetch(`http://localhost:8081/api/doctors/doctor/${storedDoctorId}/set-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Availability saved successfully!");
        console.log("Availability saved successfully"); // Debugging
        // Optionally reset fields
        setSelectedDate(null);
        setFromTime("");
        setToTime("");
      } else {
        const errorData = await res.json();
        console.error("Failed to save:", errorData);
        alert("Failed to save availability.");
      }
    } catch (err) {
      console.error("Error while saving availability:", err);
      alert("An error occurred.");
    }
  };

  return (
    <div className="set-availability-container">
      <h2>Set Availability</h2>

      <button
        className="set-btn"
        onClick={() => {
          console.log("Toggling date picker"); // Debugging
          setShowDatePicker(!showDatePicker);
        }}
      >
        Set Date
      </button>

      {showDatePicker && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            console.log("Date selected:", date); // Debugging
            setSelectedDate(date);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="date-picker"
          minDate={new Date()}
          inline
        />
      )}

      <button
        className="set-btn"
        onClick={() => {
          console.log("Toggling time fields"); // Debugging
          setShowTimeFields(!showTimeFields);
        }}
      >
        Set Time
      </button>

      {showTimeFields && (
        <div className="time-inputs">
          <input
            type="time"
            value={fromTime}
            onChange={(e) => {
              console.log("From Time changed:", e.target.value); // Debugging
              setFromTime(e.target.value);
            }}
          />
          <input
            type="time"
            value={toTime}
            onChange={(e) => {
              console.log("To Time changed:", e.target.value); // Debugging
              setToTime(e.target.value);
            }}
          />
          <button className="submit-btn" onClick={handleTimeSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default SetAvailability;
