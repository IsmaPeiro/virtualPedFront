import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PetsPage = () => {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación');
            navigate('/'); // Redirigir al login si no hay token
            return;
        }

        const fetchPets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/pet/getAllUserPets', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPets(response.data); // Guardar las mascotas recibidas
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las mascotas');
            }
        };

        fetchPets();
    }, [navigate]);

    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        
        // Redirigir al LoginForm
        navigate('/');
    };

    return (
        <div>
            <h1>Mis Mascotas</h1>
            {error && <p>{error}</p>}
            <ul>
                {pets.map(pet => (
                    <li key={pet.id}>{pet.name}</li>
                ))}
            </ul>

            {/* Botón de logout */}
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default PetsPage;
