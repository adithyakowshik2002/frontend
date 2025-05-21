import React, { useState } from 'react';
import './DoctorStyle.css';
import '../Model/ModelStyle.css'; 
import axiosInstance from '../assets/axiosConfig'; // Import the axios instance

const DoctorForm = () => {
  const [doctor, setDoctor] = useState({
    name: '',
    qualifications: '',
    specialization: '',
    languages: '',
    experienceYears: '',
    registrationNumber: '',
    location: '',
    email: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [modelMessage, setModelMessage] = useState('');

  // Handle input changes for text fields
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('profileImage', profileImage);
    formData.append('doctorJson', JSON.stringify(doctor));

    try {
      const response = await axiosInstance.post('/api/doctors/creating', formData);
   console.log(response.data);
   console.log(response.status);
      if (response.status === 201) {
        setModelMessage('Doctor added Successfully!');
        setShowModel(true);
        setDoctor({
          name: '',
          qualifications: '',
          registrationNumber: '',
          specialization: '',
          languages: '',
          experienceYears: '',
          location: '',
          email: '',
        });
        setProfileImage(null);
      } else {
        setModelMessage('Failed to add doctor.');
        setShowModel(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setModelMessage('Something went wrong!');
      setShowModel(true);
    }
  };

  const closeModel = () => {
    setShowModel(false);
  };

  return (
    <div className="doctor-form-container">
      <h2>Add Doctor Profile</h2>
      <form className="doctor-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Profile Image:
          <input
            type="file"
            name="profileImage"
            onChange={handleImageChange}
            accept="image/*"
            placeholder="Select Profile Image"
            required
          />
        </label>

        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Enter Doctor Name"
            value={doctor.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Registration Number:
          <input
            type="text"
            name="registrationNumber"
            placeholder="Enter Registration Number"
            value={doctor.registrationNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Qualifications:
          <input
            type="text"
            name="qualifications"
            placeholder="Enter Qualifications"
            value={doctor.qualifications}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={doctor.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Specialization:
          <input
            type="text"
            name="specialization"
            placeholder="Enter Specialization"
            value={doctor.specialization}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Languages Known:
          <input
            type="text"
            name="languages"
            placeholder="Enter Languages Known"
            value={doctor.languages}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Years of Experience:
          <input
            type="number"
            name="experienceYears"
            placeholder="Enter Years of Experience"
            value={doctor.experienceYears}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            placeholder="Enter Location"
            value={doctor.location}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Save Doctor</button>
      </form>

      {showModel && (
        <div className="modal">
          <p>{modelMessage}</p>
          <button onClick={closeModel}>Close</button>
        </div>
      )}
      <button className="back-button" onClick={() => window.history.back()}>
        ← Back
      </button>
    </div>
  );
};

export default DoctorForm;
