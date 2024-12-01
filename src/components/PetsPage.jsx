import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PetsPage = () => {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPets = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No se encontró el token de autenticación');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/pet/getAllUserPets', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Aquí enviamos el token en la cabecera
                    },
                });

                setPets(response.data); // Guardar las mascotas recibidas
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las mascotas');
            }
        };

        fetchPets();
    }, []);

    return (
        <div>
            <h1>Mis Mascotas</h1>
            {error && <p>{error}</p>}
            <ul>
                {pets.map(pet => (
                    <li key={pet.id}>{pet.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default PetsPage;
