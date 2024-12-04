import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminPage.css'; // Importamos los estilos CSS

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const [showUsers, setShowUsers] = useState(false); // Controlar la visibilidad de usuarios
    const [showPets, setShowPets] = useState(false); // Controlar la visibilidad de mascotas
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found');
            navigate('/'); // Redirigir al login si no hay token
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'ADMIN') {
                setError('You do not have administrator permissions');
                navigate('/pets');
            }
        } catch (err) {
            setError('Invalid token');
            navigate('/');
        }
    }, [navigate]);

    const fetchAllUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/admin/getAllUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const filteredUsers = response.data.filter(user => user.role !== 'ADMIN');
            setUsers(filteredUsers);
            setShowUsers(true); // Mostrar usuarios
        } catch (err) {
            setError('Failed to load users');
        }
    };

    const fetchAllPets = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/admin/getAllPets', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPets(response.data);
            setShowPets(true); // Mostrar mascotas
        } catch (err) {
            setError('Failed to load pets');
        }
    };

    const handleDeleteUser = async (nickname) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/admin/deleteUser?nickname=${nickname}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.nickname !== nickname));
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handleDeletePet = async (nickname, petName) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/admin/deletePet', null, {
                params: { nickname, petName },
                headers: { Authorization: `Bearer ${token}` },
            });
            setPets(pets.filter(pet => pet.name !== petName));
        } catch (err) {
            setError('Failed to delete pet');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Página de Administración</h1>
            {error && <p className="admin-error">{error}</p>}

            <div className="admin-buttons">
                <button className="btn" onClick={fetchAllUsers} disabled={showUsers}>View all users</button>
                <button className="btn" onClick={fetchAllPets} disabled={showPets}>View all pets</button>
                <button className="btn" onClick={handleLogout}>Log out</button>
            </div>

            {showUsers && (
                <div className="admin-section">
                    <h2 className="admin-subtitle">Users</h2>
                    <button className="btn close-btn" onClick={() => setShowUsers(false)}>Close</button>
                    <ul className="admin-list">
                        {users.map(user => (
                            <li key={user.nickname} className="admin-list-item">
                                {user.nickname}
                                <button className="btn small-btn" onClick={() => handleDeleteUser(user.nickname)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showPets && (
                <div className="admin-section">
                <h2 className="admin-subtitle">Pets</h2>
                <button className="btn close-btn" onClick={() => setShowPets(false)}>Close</button>
                <ul className="admin-list">
                    {pets.map(pet => {
                        // Construimos el nombre del archivo basado en el tipo, color y estado de ánimo
                        const imageFileName =
    pet.petMood === 'ASLEEP'
        ? 'ASLEEP.PNG'
        : `${pet.type}_${pet.color}_${pet.petMood}.png`.toUpperCase();
                        const imageUrl = `/assets/pets/${imageFileName}`;
        
                        return (
                            <li key={pet.name} className="admin-list-item">
                                <div className="admin-pet-info">
                                    <img
                                        src={imageUrl}
                                        alt={`${pet.type} - ${pet.name}`}
                                        className="pet-thumbnail"
                                        onError={(e) => {
                                            e.target.src = '/assets/pets/default.png'; // Imagen de respaldo
                                        }}
                                    />
                                    <span>{pet.name} (Owner: {pet.owner})</span>
                                </div>
                                <button className="btn small-btn" onClick={() => handleDeletePet(pet.owner, pet.name)}>Remove</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}
        </div>
    );
};

export default AdminPage;
