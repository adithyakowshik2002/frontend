import React, { useState } from 'react';
import './DoctorStyle.css';
import '../Model/ModelStyle.css'; 

const DoctorForm = () => {
  const [doctor, setDoctor] = useState({
    name: '',
    qualifications: '',
    specialization: '',
    languages: '',
    experienceYears: '',
    registrationNumber: '',
    location: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showModel,setShowModel] = useState(false);
  const [modelMessage,setModelMessage] = useState('');
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
      const response = await fetch('http://localhost:8081/api/doctors', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setModelMessage('Doctor added Successfully!');
        setShowModel(true);
        setDoctor({
          name: '',
          qualifications: '',
          specialization: '',
          languages: '',
          experienceYears: '',
          location: '',
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

  }

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
            required
          />
        </label>

        <label>
          Name:
          <input
            type="text"
            name="name"
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
            value={doctor.qualifications}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Specialization:
          <input
            type="text"
            name="specialization"
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
            value={doctor.location}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Save Doctor</button>
      </form>

      {showModel && <div className="modal">
        <p>{modelMessage}</p>
        <button onClick={closeModel}>Close</button>
      </div>}
    </div>
  );
};

export default DoctorForm;
