import React, { useEffect, useState } from "react";
import "./patientsPage.css";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve userId, jwtToken, and role from localStorage
    const email = localStorage.getItem("email");
    const jwt = localStorage.getItem("jwt");
    const role = localStorage.getItem("role");

    // Check if user is not logged in or is not a doctor
    if (  !jwt || role !== "ROLE_DOCTOR") {
      setError("You are not authorized or logged in.");
      setLoading(false);
      return;
    }

    // Step 1: Get doctorId using userId
    const fetchDoctorId = async () => {
      try {
        const doctorRes = await fetch(`http://localhost:8081/api/doctors/user/${email}`, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Add JWT token to the header
          },
        });

        const doctorData = doctorRes;
console.log(doctorData); // Log the doctor data for debugging
        if (!doctorData ) {
          setError("Doctor not found.");
          setLoading(false);
          return;
        }

        const doctorId = doctorData.id;

        // Step 2: Fetch patients using doctorId
        const patientRes = await fetch(`http://localhost:8082/api/patients/doctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Add JWT token to the header
          },
        });
console.log(patientRes); // Log the response for debugging
        const patientData = await patientRes.json();
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
          <div className="patient-card" key={patient.id}>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Address:</strong> {patient.address}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientsPage;