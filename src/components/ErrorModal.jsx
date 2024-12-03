import React from 'react';

const ErrorModal = ({ error, onClose }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                zIndex: 9999,
                width: '300px',
                textAlign: 'center',
            }}
        >
            <h3 style={{ color: 'red' }}>{error}</h3>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default ErrorModal;
