import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FirstPage from './pages/firstpage';
import Loginpage from './pages/LoginPage';
import BookAppointmentPage from './pages/BookAppointment';
import DoctorForm from './pages/DoctorForm';
import DoctorSchedule from './pages/DoctorSchedules';
import SignupForm from './pages/SignupForm';
import PatientForm from './pages/PatientForm'; // ✅ Correct import added
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/book-appointment" element={<BookAppointmentPage />} />
      <Route path="/add-doctor" element={<DoctorForm />} />
      <Route path="/schedule-availability/:doctorId" element={<DoctorSchedule />} />
      <Route path="/signup-role-select" element={<SignupForm />} />
      <Route path="/fill-patient-form/:scheduleId" element={<PatientForm />} />

      {/* Temporarily comment these out */}
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    </Routes>
  );
}

export default App;
