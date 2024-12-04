import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PetsPage.css'; // Importamos los estilos CSS

const PetsPage = () => {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const [newPet, setNewPet] = useState({
        petName: '',
        type: 'BUBBLE_DRAGON',
        color: 'YELLOW',
    });
    const [petColors, setPetColors] = useState([]);
    const [petTypes, setPetTypes] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found');
            navigate('/');
            return;
        }

        const fetchPets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/pet/getAllUserPets', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPets(response.data);
            } catch (err) {
                setError('No pets available. Please create a new pet.');
            }
        };

        const fetchEnums = async () => {
            try {
                const colorResponse = await axios.get('http://localhost:8080/enum/petColors', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPetColors(colorResponse.data);

                const typeResponse = await axios.get('http://localhost:8080/enum/petTypes', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPetTypes(typeResponse.data);
            } catch (err) {
                setError('Failed to load enum data');
            }
        };

        fetchPets();
        fetchEnums();

        const interval = setInterval(fetchPets, 120000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDeletePet = async (petName) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/pet/deletePet', null, {
                params: { petName },
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Actualizar el estado de mascotas eliminando la mascota
            const updatedPets = pets.filter(pet => pet.name !== petName);
            setPets(updatedPets);
    
            // Si no quedan mascotas, establece un mensaje de error
            if (updatedPets.length === 0) {
                setError('No pets available. Please create a new pet.');
            } else {
                setError(''); // Limpia el error si hay mascotas
            }
        } catch (err) {
            setError('Failed to delete pet');
        }
    };

    const handleCreatePet = async () => {
        const token = localStorage.getItem('token');
        
        setError('');

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
            setError('Failed to create pet');
            console.error(err);
        }
        
    };

    return (
        <div className="pets-container">
            <div className="logout-container">
                <button className="btn logout-btn" onClick={handleLogout}>Log out</button>
            </div>
            <h1 className="pets-title">My Pets</h1>
            {error && <p className="pets-error">{error}</p>}
            
            <div className="create-section">
    {!showCreateForm && (
        <button className="pet-buttons btn" onClick={() => setShowCreateForm(true)}>
            Create new pet
        </button>
    )}
    {showCreateForm && (
        <div className="create-form">
            <h2>Add a new pet</h2>
            <input
                type="text"
                placeholder="Pet name"
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
            <button
    className="btn create-btn"
    onClick={() => {
        handleCreatePet();
        setShowCreateForm(false);
    }}
>
    Create Pet
</button>
            <button className="btn close-btn" onClick={() => setShowCreateForm(false)}>
                Close
            </button>
        </div>
    )}
</div>


<ul className="pets-list">
    {pets.map((pet) => {
        const imageFileName =
        pet.petMood === 'ASLEEP'
            ? 'ASLEEP.PNG'
            : `${pet.type}_${pet.color}_${pet.petMood}.png`.toUpperCase();
        const imageUrl = `/assets/pets/${imageFileName}`;

        return (
            <li key={pet.name} className="pet-item">
                <div className="pet-content">
                    {/* Imagen de la mascota */}
                    <div className="pet-image-container">
                        <img
                            src={imageUrl}
                            alt={`${pet.type} - ${pet.name}`}
                            className="pet-image"
                            onError={(e) => {
                                e.target.src = '/assets/pets/default.png';
                            }}
                        />
                    </div>
                    {/* Información de la mascota */}
                    <div className="pet-info">
                        <strong>Stats:</strong>
                        <ul>
                            {Object.entries(pet).map(([key, value]) =>
                                key !== 'id' && key !== 'owner' ? (
                                    <li key={key}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                                        {Array.isArray(value) ? value.join(', ') : value}
                                    </li>
                                ) : null
                            )}
                        </ul>
                        <div className="pet-buttons">
                            <button
                                className="btn details-btn"
                                onClick={() => navigate(`/pet-details/${pet.name}`)}
                            >
                                See Details
                            </button>
                            <button
                                className="btn delete-btn"
                                onClick={() => handleDeletePet(pet.name)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        );
    })}
</ul>

        </div>
    );
};

export default PetsPage;
