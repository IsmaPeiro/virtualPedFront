import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PetsPage = () => {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const [newPet, setNewPet] = useState({
        petName: '',
        type: 'BUBBLE_DRAGON', // valor por defecto
        color: 'YELLOW', // valor por defecto
    });
    const [petColors, setPetColors] = useState([]);
    const [petTypes, setPetTypes] = useState([]);
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

        // Obtener los colores y tipos de mascotas del backend
        const fetchEnums = async () => {
            try {
                const colorResponse = await axios.get('http://localhost:8080/enum/petColors', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
                setPetColors(colorResponse.data);

                const typeResponse = await axios.get('http://localhost:8080/enum/petTypes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPetTypes(typeResponse.data);
            } catch (err) {
                setError('No se pudieron cargar los datos de los enums');
                console.error(err);
            }
        };

        fetchPets();
        fetchEnums();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDeletePet = async (petName) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/pet/deletePet', petName, {
                params: {
                    petName: petName,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Eliminar la mascota de la lista en el frontend
            setPets(pets.filter(pet => pet.name !== petName));
        } catch (err) {
            setError('No se pudo eliminar la mascota');
        }
    };

    const handleCreatePet = async () => {
        const token = localStorage.getItem('token');
        try {
            // Primero, realizamos la creación de la mascota
            await axios.post('http://localhost:8080/pet/createPet', newPet.petName, {
                params: {
                    petName: newPet.petName,
                    type: newPet.type,
                    color: newPet.color,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Obtener la lista completa de mascotas después de la creación
            const response = await axios.get('http://localhost:8080/pet/getAllUserPets', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Actualizar el estado con las mascotas completas, incluyendo la recién creada
            setPets(response.data);
    
            // Limpiar el formulario de la nueva mascota
            setNewPet({ petName: '', type: 'BUBBLE_DRAGON', color: 'YELLOW' });
        } catch (err) {
            setError('No se pudo crear la mascota');
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Mis Mascotas</h1>
            {error && <p>{error}</p>}
            
            {/* Formulario para agregar nueva mascota */}
            <div>
                <h2>Agregar una nueva mascota</h2>
                <input
                    type="text"
                    placeholder="Nombre de la mascota"
                    value={newPet.petName}
                    onChange={(e) => setNewPet({ ...newPet, petName: e.target.value })}
                />
                <select
                    value={newPet.type}
                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                >
                    {petTypes.map((type) => (
                        <option key={type} value={type}>
                            {type.replace('_', ' ').toUpperCase()}
                        </option>
                    ))}
                </select>
                <select
                    value={newPet.color}
                    onChange={(e) => setNewPet({ ...newPet, color: e.target.value })}
                >
                    {petColors.map((color) => (
                        <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <button onClick={handleCreatePet}>Crear Mascota</button>
            </div>

            {/* Mostrar las mascotas */}
            <ul>
                {pets.map(pet => (
                    <li key={pet.name}> {/* Usamos pet.name como la key única */}
                        <strong>Detalles de la mascota:</strong>
                        <ul>
                            {Object.entries(pet).map(([key, value]) => (
                                key !== 'id' && key !== 'owner' ? (
                                    <li key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</li>
                                ) : null
                            ))}
                        </ul>
                        {/* Botón de eliminar */}
                        <button onClick={() => handleDeletePet(pet.name)}>Eliminar</button>
                    </li>
                ))}
            </ul>

            {/* Botón de logout */}
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default PetsPage;
