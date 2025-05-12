import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './UpdateDoctorForm.css';

import axios from "axios";

const UpdateDoctorForm = () => {
  const { doctorId } = useParams();

  const [doctorData, setDoctorData] = useState({
    name: "",
    qualifications: "",
    registrationNumber: "",
    specialization: "",
    languages: "",
    experienceYears: "",
    location: "",
    email: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null); // 🟡 New: For preview

  // 🔵 Load doctor data on mount
  useEffect(() => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:9090/api/doctors/get-doctor/${doctorId}`)
      .then((response) => {
        const {
          name,
          qualifications,
          registrationNumber,
          specialization,
          languages,
          experienceYears,
          location,
          email,
          profileImageBase64 // Base64 or URL (decide based on backend)
        } = response.data;
        console.log("Doctor Data:", response.data); // Debugging

        setDoctorData({
          name,
          qualifications,
          registrationNumber,
          specialization,
          languages,
          experienceYears,
          location,
          email
        });

        // If image comes as Base64 byte array, prefix with data type
        if (profileImageBase64) {
          setExistingImage(`data:image/jpeg;base64,${profileImageBase64}`);
         // console.log("Existing Image:", profileImageBase64); 
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
      });
  }, [doctorId]);

  // 🔵 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔵 Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(doctorData)], {
      type: "application/json"
    });
    formData.append("doctorJson", jsonBlob);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:9090/api/doctors/update/${doctorId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Doctor updated successfully!");
      console.log("Updated:", response.data);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update doctor.");
    }
  };

  return (
    <div className="update-doctor-form-container">
      <h2>Update Doctor</h2>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="name">Name</label><br />
          <input id="name" name="name" value={doctorData.name} onChange={handleChange} required /><br />
        </div>

        <div>
          <label htmlFor="qualifications">Qualifications</label><br />
          <input id="qualifications" name="qualifications" value={doctorData.qualifications} onChange={handleChange} required /><br />
        </div>

        <div>
          <label htmlFor="registrationNumber">Registration Number</label><br />
          <input id="registrationNumber" name="registrationNumber" value={doctorData.registrationNumber} readOnly /><br />
        </div>

        <div>
          <label htmlFor="specialization">Specialization</label><br />
          <input id="specialization" name="specialization" value={doctorData.specialization} onChange={handleChange} required /><br />
        </div>

        <div>
          <label htmlFor="languages">Languages</label><br />
          <input id="languages" name="languages" value={doctorData.languages} onChange={handleChange} /><br />
        </div>

        <div>
          <label htmlFor="experienceYears">Experience (years)</label><br />
          <input type="number" id="experienceYears" name="experienceYears" value={doctorData.experienceYears} onChange={handleChange} /><br />
        </div>

        <div>
          <label htmlFor="location">Location</label><br />
          <input id="location" name="location" value={doctorData.location} onChange={handleChange} /><br />
        </div>

        <div>
          <label htmlFor="email">Email</label><br />
          <input id="email" name="email" value={doctorData.email} onChange={handleChange} type="email" required /><br />
        </div>
        <div>
  <label htmlFor="profileImage">Profile Image</label><br />
  <small style={{ color: 'red' }}>Optional</small>
  <input id="profileImage" type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} /><br />
  
</div>


        {existingImage && !profileImage && (
          <div>
            <p>Current Profile Image:</p>
            <img src={existingImage} alt="Doctor Profile" width="120" />
          </div>
        )}

        {profileImage && (
          <div>
            <p>New Image Preview:</p>
            <img src={URL.createObjectURL(profileImage)} alt="Preview" width="120" />
          </div>
        )}

        <button type="submit">Update Doctor</button>
      </form>
    </div>
  );
};

export default UpdateDoctorForm;
