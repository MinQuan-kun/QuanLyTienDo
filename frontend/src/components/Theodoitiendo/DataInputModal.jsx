import React from 'react';
import { FaTimes } from 'react-icons/fa';

const DataInputModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="tdt-modal-overlay" onClick={onClose}>
      <div 
        className="tdt-modal-content tdt-animate-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="tdt-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        {title && <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--tdt-red)' }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default DataInputModal;
