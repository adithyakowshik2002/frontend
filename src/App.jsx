import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FirstPage from './pages/firstpage';
import LoginForm from './pages/LoginForm';
import BookAppointmentPage from './pages/BookAppointment';
import DoctorForm from './pages/DoctorForm';
import DoctorSchedule from './pages/DoctorSchedules';

import PatientForm from './pages/PatientForm'; 
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import DoctorDashboard from './pages/DoctorDashBoard';
import PatientsPage from './pages/PatientsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/login" element={<LoginForm/>} />
      <Route path="/book-appointment" element={<BookAppointmentPage />} />
      <Route path="/add-doctor" element={<DoctorForm />} />
      <Route path="/schedule-availability/:doctorId" element={<DoctorSchedule />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
<Route path="/get-patients" element={<PatientsPage/>}/>
      <Route
  path="/fill-patient-form/:doctorId/:slotDate"
  element={<PatientForm />}

/>

      {/* Temporarily comment these out */}
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    </Routes>
  );
}

export default App;
