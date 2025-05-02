import React, { useEffect, useState } from "react";
import "./patientsPage.css";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve userId, jwtToken, and role from localStorage
    const userId = localStorage.getItem("id");
    const jwt = localStorage.getItem("jwt");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    console.log("email is this ",email);

    // Check if user is not logged in or is not a doctor
    if (!jwt || role !== "ROLE_DOCTOR") {
      setError("You are not authorized or logged in.");
      setLoading(false);
      return;
    }

    // Step 1: Get doctorId using userId
    const fetchDoctorId = async () => {
      try {
        const doctorRes = await fetch(`http://localhost:8081/api/doctors/email/${email}`, {
          headers: {
            Authorization: `Bearer ${jwt}`, 
          },
        });
        if (!doctorRes.ok) {
          setError("Failed to fetch doctor data.");
          setLoading(false);
          return;
        }

        const doctorData = await doctorRes.json();

        const doctorId = doctorData.id;
        console.log("Doctor ID:", doctorId); // Log the doctorId for debugging

        // Step 2: Fetch patients using doctorId
        const patientRes = await fetch(`http://localhost:8082/api/appointments/fetch-appointments/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Add JWT token to the header
          },
        });

        const patientData = await patientRes.json();
        console.log("Patient Data:", patientData); // Log the patient data for debugging
        setPatients(patientData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorId();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (loading) return <p className="loading-message">Loading patients...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="patients-container">
      <h2 className="patients-title">Patients List</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        patients.map((patient) => (
          <div className="patient-card" key={patient.appointmentId}>
            <p><strong>Name:</strong> {patient.patientName}</p>
            <p><strong>AppointmentDate:</strong> {patient.appointmentDate}</p>
            <p><strong>Time Slot:</strong> {patient.timeslot}</p>
            <p><strong>AppointmentType:</strong>{patient.appointmentType}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientsPage;