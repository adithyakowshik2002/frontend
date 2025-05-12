import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './ViewDoctors.css';
import { useNavigate } from 'react-router-dom';
function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9090/api/doctors/getalldoctors')
      .then((response) => response.json())
      .then((data) => {setDoctors(data)
        console.log(data);
      })
      .catch((error) => console.error('Error fetching doctors:', error));
  }, []);
  const goToAppointments = (doctorId) => {
    navigate(`/doctor-appointments/${doctorId}`);
  };
  const goToEditDoctor = (doctorId) => {
    navigate(`/edit-doctordata/${doctorId}`);
  };
  


  const getImageSrc = (doctor) => {
    // Case 1: Base64 string
    if (doctor.profileImage && doctor.profileImage.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${doctor.profileImage}`;
    }

    // Case 2: If backend gives a file URL or path
    return `http://localhost:9090/api/doctors/profile-image/${doctor.id}`;
  };

  return (
    <div className="doctors-container">
      <h2>Doctors List</h2>
      <div className="grid-container">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-carding">
           
                  <img
                    src={
                      doctor.profileImageBase64
                        ? `data:image/jpeg;base64,${doctor.profileImageBase64}`
                        : '/default-profile.png'
                    }
                    alt={doctor.name}
                    className="doctor-image"
                  />
                
            <h3>{doctor.name}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
            <p><strong>Experience:</strong> {doctor.experienceYears} years</p>
            <p><strong>Languages:</strong> {doctor.languages}</p>
            <p><strong>Registration No:</strong> {doctor.registrationNumber}</p>
            <p><strong>Location:</strong> {doctor.location}</p>
            <div className="card-actions">
            
            <button title="Edit" onClick={() => goToEditDoctor(doctor.id)}>
  <FaEdit />
</button>

              <button title="Delete"><FaTrash /></button>
              <button title="Appointments" onClick={() => goToAppointments(doctor.id)}>
      <FaEye /> View Appointments
    </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewDoctors;
