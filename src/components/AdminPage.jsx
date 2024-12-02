import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de importar jwt-decode correctamente

const AdminPage = () => {
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

    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        
        // Redirigir al LoginForm
        navigate('/');
    };

    return (
        <div>
            <h1>Página de Administrador</h1>
            {error && <p>{error}</p>}
            {/* Aquí irán las opciones para el administrador */}
            <div>
                <p>Aquí se podrán mostrar las opciones para el administrador.</p>
            </div>
            {/* Botón de logout */}
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default AdminPage;
