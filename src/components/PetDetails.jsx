import React from 'react';

const PetDetails = ({ petDetails }) => {
    return (
        <div>
            <h1>Detalles de {petDetails.petName}</h1>
            <ul>
                {Object.entries(petDetails).map(([key, value]) =>
                    key !== 'id' && key !== 'owner' ? (
                        <li key={key}>
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                            {Array.isArray(value) ? value.join(', ') : value}
                        </li>
                    ) : null
                )}
            </ul>
        </div>
    );
};

export default PetDetails;
