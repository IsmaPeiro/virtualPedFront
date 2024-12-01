import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const LoginForm = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ nickname: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Inicializa el hook navigate

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Intentar realizar el login
            const response = await login(formData);

            // Verificar si se recibió el token en la respuesta
            if (response && response.token) {
                // Guardar el token en localStorage
                localStorage.setItem('token', response.token);

                // Llamar a onLoginSuccess pasando el token (si es necesario)
                onLoginSuccess(response.token);

                // Redirigir al usuario a la página de mascotas usando React Router
                navigate('/pets'); // Redirigir a /pets (sin recargar la página)
            } else {
                setMessage('Token no recibido.');
            }
        } catch (error) {
            // Mostrar mensaje de error en caso de fallo
            setMessage(error.message || 'Error desconocido');
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm;
