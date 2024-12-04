import React from 'react';
import './ErrorModal.css';

const ErrorModal = ({ error, onClose }) => {
    return (
        <div className="error-modal">
            <h3>{error}</h3>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default ErrorModal;
