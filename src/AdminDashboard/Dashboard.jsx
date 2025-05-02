import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DoctorForm from '../pages/DoctorForm';
import RegisterDoctor from './RegisterDoctor';
import ViewDoctors from './ViewDoctors';
import ViewPatients from './ViewPatients';
import BookAppointmentPage from '../pages/BookAppointment';

function Dashboard() {
  return (
    <Router>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <nav className="dashboard-nav">
          <Link to="/add-doctor">Create Doctor</Link>
          <Link to="/register-doctor">Issue Credentials</Link>
          <Link to="/book-appointment">Book Appointment</Link>
          <Link to="/view-doctors">View Doctors</Link>
          <Link to="/view-patients">View Patients</Link>
        </nav>
        <Routes>
        <Route path="/add-doctor" element={<DoctorForm />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route path="/view-doctors" element={<ViewDoctors />} />
          <Route path="/view-patients" element={<ViewPatients />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Dashboard;
