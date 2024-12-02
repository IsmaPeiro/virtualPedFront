import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Para decodificar el token y obtener el rol
import PetsPage from './components/PetsPage';
import AdminPage from './components/AdminPage';
import LoginForm from './components/LoginForm';

const App = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (token, role) => {
        // Guardamos el token en localStorage
        localStorage.setItem('token', token);
        if (role === 'ADMIN') {
            navigate('/admin'); // Redirigir a la página de administración
        } else {
            navigate('/pets'); // Redirigir a la página de mascotas
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            const decodedToken = jwtDecode(savedToken);
            if (decodedToken.role === 'ADMIN') {
                navigate('/admin'); // Redirigir a Admin si el rol es ADMIN
            } else {
                navigate('/pets'); // Redirigir a Pets si el rol es USER
            }
        }
    }, [navigate]);

    return (
        <div>
            <Routes>
                <Route path="/" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/pets" element={<PetsPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </div>
    );
};

export default App;
