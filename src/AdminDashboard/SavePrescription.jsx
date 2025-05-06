import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SavePrescription.css';

function SavePrescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointmentId = state?.appointmentId;

  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '', durationDays: '', quantity: '', unitPrice: '', totalPrice: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(updated[index].quantity) || 0;
      const unitPrice = parseFloat(updated[index].unitPrice) || 0;
      updated[index].totalPrice = (quantity * unitPrice).toFixed(2);
    }

    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { medicineName: '', dosage: '', durationDays: '', quantity: '', unitPrice: '', totalPrice: '' }
    ]);
  };

  const removeMedicine = (index) => {
    const updated = [...medicines];
    updated.splice(index, 1);
    setMedicines(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      appointmentId,
      medicines
    };

    console.log(payload);

    fetch(`http://localhost:9090/api/prescriptions/save-prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save prescription');
        return res.json();
      })
      .then(data => {
        alert("Prescription saved successfully!");
        navigate('/view-patients');
      })
      .catch(err => {
        console.error(err);
        alert("Error saving prescription.");
      });
  };

  return (
    <div className="prescription-container">
      <h2>Save Prescription</h2>
      <form onSubmit={handleSubmit}>
        {medicines.map((med, index) => (
          <div className="medicine-group" key={index}>
            <input
              type="text"
              placeholder="Medicine Name"
              value={med.medicineName}
              onChange={(e) => handleChange(index, 'medicineName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => handleChange(index, 'dosage', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Duration (Days)"
              value={med.durationDays}
              onChange={(e) => handleChange(index, 'durationDays', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={med.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Unit Price"
              value={med.unitPrice}
              onChange={(e) => handleChange(index, 'unitPrice', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Total Price"
              value={med.totalPrice}
              readOnly
            />
            <button type="button" onClick={() => removeMedicine(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addMedicine}>Add Medicine</button>
        <br /><br />
        <button type="submit" className="btn">Submit Prescription</button>
      </form>
    </div>
  );
}

export default SavePrescription;
