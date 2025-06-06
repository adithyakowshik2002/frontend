import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FirstPage from './pages/firstpage';
import LoginForm from './pages/LoginForm';
import BookAppointment from './pages/BookAppointment';  
import DoctorForm from './pages/DoctorForm';
import PatientForm from './pages/PatientForm'; 
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import DoctorDashboard from './pages/DoctorDashBoard';
import PatientsPage from './pages/PatientsPage';
import SetAvailability from './pages/setAvailability';
import Dashboard from './AdminDashboard/Dashboard';
import RegisterDoctor from './AdminDashboard/RegisterDoctor';

import ViewDoctors from './AdminDashboard/ViewDoctors';
import ViewPatients from './AdminDashboard/ViewPatients';
import BillingPage from './AdminDashboard/BillingPage';
import SavePrescription from './AdminDashboard/SavePrescription';
import ViewPrescriptions from './AdminDashboard/ViewPrescriptions';
import FetchBillingInfo from './AdminDashboard/FetchBillingInfo';
import DailyIpBillingPreview from './AdminDashboard/DailyIpBillingPreview';
import ViewAppointments from './AdminDashboard/ViewAppointments';
import DoctorAppointments from './AdminDashboard/DoctorAppointments';
import UpdateDoctorForm from './AdminDashboard/UpdateDoctorForm';
import AadharValidation from './pages/AadharValidation';
import BookAppointmentExisting from './pages/BookAppointmentExisting';
import Reschedule from './pages/Reschedule';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/login" element={<LoginForm/>} />
      
      <Route path="/add-doctor" element={<DoctorForm />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
      <Route path="/get-patients" element={<PatientsPage/>}/>
      <Route path="/set-availability" element={<SetAvailability />} />
      <Route path="/admin-dashboard" element={<Dashboard/>}/>
      <Route
  path="/fill-patient-form/:doctorId/:slotDate"
  element={<PatientForm />}

/>

      <Route path="/edit-doctordata/:doctorId" element={<UpdateDoctorForm />} /> 
      <Route path="/view-appointments" element={<ViewAppointments />} />

<Route path="/save-prescription" element={<SavePrescription />} />
<Route path="/view-prescriptions" element={<ViewPrescriptions />} />
<Route path="/view-billing" element={<FetchBillingInfo />} />

<Route path="/daily-ip-billing" element={<DailyIpBillingPreview/>} />
<Route path="/billing" element={<BillingPage />} />
<Route path="/register-doctor" element={<RegisterDoctor />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/view-doctors" element={<ViewDoctors />} />
          <Route path="/view-patients" element={<ViewPatients />} />
          <Route path="/doctor-appointments/:doctorId" element={<DoctorAppointments />} />
          <Route path="/validate-aadhar" element={<AadharValidation/>}/>
          <Route path="/book-appointment-existing/:patientId" element={<BookAppointmentExisting />} />
        <Route path="/reschedule" element={<Reschedule/>}/>
        <Route path="/confirmation" element={<Confirmation/>}/>

      {/* Temporarily comment these out */}
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    </Routes>
  );
}

export default App;
