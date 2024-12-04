import React from 'react';
import './PetDetails.css'; // Asegúrate de tener un archivo CSS para los estilos

const PetDetails = ({ petDetails }) => {
    return (
        <div>
            <h1>Stats: {petDetails.petName}</h1>
            <ul>
                {Object.entries(petDetails).map(([key, value]) => {
                    // Comprobar si el atributo es numérico
                    const isNumeric = typeof value === 'number';
                    return (
                        key !== 'id' && key !== 'owner' && (
                            <li key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                                {isNumeric ? (
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${value}%` }}
                                            title={`${value}%`}
                                        ></div>
                                    </div>
                                ) : (
                                    Array.isArray(value) ? value.join(', ') : value
                                )}
                            </li>
                        )
                    );
                })}
            </ul>
        </div>
    );
};

export default PetDetails;
