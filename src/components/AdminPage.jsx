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
            setError('No se encontró el token de autenticación');
            navigate('/'); // Redirigir al login si no hay token
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'ADMIN') {
                setError('No tiene permisos de administrador');
                navigate('/pets');
            }
        } catch (err) {
            setError('Token inválido');
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
            setError('No se pudieron cargar los usuarios');
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
            setError('No se pudieron cargar las mascotas');
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
            setError('No se pudo eliminar el usuario');
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
            setError('No se pudo eliminar la mascota');
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
                <button className="btn" onClick={fetchAllUsers} disabled={showUsers}>Ver todos los usuarios</button>
                <button className="btn" onClick={fetchAllPets} disabled={showPets}>Ver todas las mascotas</button>
                <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
            </div>

            {showUsers && (
                <div className="admin-section">
                    <h2 className="admin-subtitle">Usuarios</h2>
                    <button className="btn close-btn" onClick={() => setShowUsers(false)}>Cerrar usuarios</button>
                    <ul className="admin-list">
                        {users.map(user => (
                            <li key={user.nickname} className="admin-list-item">
                                {user.nickname}
                                <button className="btn small-btn" onClick={() => handleDeleteUser(user.nickname)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showPets && (
                <div className="admin-section">
                <h2 className="admin-subtitle">Mascotas</h2>
                <button className="btn close-btn" onClick={() => setShowPets(false)}>Cerrar mascotas</button>
                <ul className="admin-list">
                    {pets.map(pet => {
                        // Construimos el nombre del archivo basado en el tipo, color y estado de ánimo
                        const imageFileName = `${pet.type}_${pet.color}_${pet.petMood}.png`.toUpperCase();
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
                                    <span>{pet.name} (Propietario: {pet.owner})</span>
                                </div>
                                <button className="btn small-btn" onClick={() => handleDeletePet(pet.owner, pet.name)}>Eliminar</button>
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
