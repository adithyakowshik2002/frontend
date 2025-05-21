import React, { useEffect, useState } from "react";
import "./patientsPage.css";
import axiosInstance from "../assets/axiosConfig"; 

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const jwt = localStorage.getItem("jwt");
    const role = localStorage.getItem("role");

    console.log("email is this ", email);

    if (!email || !jwt || role !== "DOCTOR") {
      setError("You are not authorized or logged in.");
      setLoading(false);
      return;
    }

    const fetchDoctorId = async () => {
      try {
        const doctorRes = await axiosInstance.get(`/api/doctors/email/${email}`);
        const doctorData = doctorRes.data;

        if (!doctorData || !doctorData.id) {
          setError("Doctor not found.");
          setLoading(false);
          return;
        }

        const doctorId = doctorData.id;

        const patientRes = await axiosInstance.get(`/api/appointments/fetch-appointments/${doctorId}`);
        const patientData = patientRes.data;

        console.log("Patient Data:", patientData);
        setPatients(patientData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorId();
  }, []);

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
            <p><strong>Appointment Date:</strong> {patient.appointmentDate}</p>
            <p><strong>Time Slot:</strong> {patient.timeslot}</p>
            <p><strong>Appointment Type:</strong> {patient.appointmentType}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientsPage;
