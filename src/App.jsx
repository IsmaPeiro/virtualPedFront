import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PetsPage from './components/PetsPage';
import AdminPage from './components/AdminPage';
import LoginForm from './components/LoginForm';
import PetDetailsPage from './components/PetDetailsPage'; // Importar la nueva página

const App = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Usar useLocation para obtener la ruta actual

    const handleLoginSuccess = (token, role) => {
        localStorage.setItem('token', token);
        if (role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/pets');
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            const decodedToken = jwtDecode(savedToken);
            const isAdmin = decodedToken.role === 'ADMIN';
            const isDetailsPage = location.pathname.startsWith('/pet-details'); // Comprobamos si estamos en la ruta de detalles

            // No redirigimos si ya estamos en la página de detalles
            if (!isDetailsPage) {
                if (isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/pets');
                }
            }
        }
    }, [navigate, location.pathname]); // Dependencia de location.pathname para que solo se ejecute cuando cambie la ruta

    return (
        <div>
            <Routes>
                <Route path="/" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/pets" element={<PetsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/pet-details/:petName" element={<PetDetailsPage />} /> {/* Nueva ruta */}
            </Routes>
        </div>
    );
};

export default App;
