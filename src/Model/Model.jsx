import React from 'react';
import './ModalStyle.css'; // Make sure to style the modal as you want

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
