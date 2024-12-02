import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
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

        // Decodificar el token para verificar si es admin
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'ADMIN') {
                setError('No tiene permisos de administrador');
                navigate('/pets'); // Redirigir a la página de mascotas si no es admin
            }
        } catch (err) {
            setError('Token inválido');
            navigate('/'); // Redirigir al login si el token es inválido
        }
    }, [navigate]);

    // Función para obtener todos los usuarios
    const fetchAllUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/admin/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Filtrar los usuarios con rol diferente a ADMIN
            const filteredUsers = response.data.filter(user => user.role !== 'ADMIN');
            setUsers(filteredUsers);
        } catch (err) {
            setError('No se pudieron cargar los usuarios');
        }
    };

    // Función para obtener todas las mascotas
    const fetchAllPets = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/admin/getAllPets', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPets(response.data);
        } catch (err) {
            setError('No se pudieron cargar las mascotas');
        }
    };

    // Función para eliminar un usuario
    const handleDeleteUser = async (nickname) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/admin/deleteUser?nickname=${nickname}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Eliminar el usuario de la lista en el frontend
            setUsers(users.filter(user => user.nickname !== nickname));
        } catch (err) {
            setError('No se pudo eliminar el usuario');
        }
    };

    // Función para eliminar una mascota
    const handleDeletePet = async (nickname, petName) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/admin/deletePet', null, {
                params: {
                    nickname: nickname,
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

    // Función de logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h1>Página de Administrador</h1>
            {error && <p>{error}</p>}

            {/* Botones para ver usuarios y mascotas */}
            <div>
                <button onClick={fetchAllUsers}>Ver todos los usuarios</button>
                <button onClick={fetchAllPets}>Ver todas las mascotas</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>

            {/* Mostrar lista de usuarios */}
            {users.length > 0 && (
                <div>
                    <h2>Usuarios</h2>
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                {user.nickname}
                                <button onClick={() => handleDeleteUser(user.nickname)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mostrar lista de mascotas */}
            {pets.length > 0 && (
                <div>
                    <h2>Mascotas</h2>
                    <ul>
                        {pets.map((pet) => (
                            <li key={pet.id}>
                                {pet.name} (Propietario: {pet.owner}) {/* Mostrar el propietario al lado del nombre de la mascota */}
                                <button onClick={() => handleDeletePet(pet.owner, pet.name)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
