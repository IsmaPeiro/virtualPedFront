import React, { useState } from 'react';
import { login, register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Usamos la importación correcta

const LoginForm = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ nickname: '', password: '' });
    const [message, setMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (isRegistering) {
                // Si está en modo registro, registramos al usuario
                response = await register(formData);
                setMessage('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
                // Hacer login automáticamente después del registro
                response = await login(formData);
            } else {
                // Si está en modo login, intentamos hacer login
                response = await login(formData);
            }

            if (response && response.token) {
                // Si se recibe el token, lo almacenamos en el localStorage
                localStorage.setItem('token', response.token);

                // Decodificamos el token para obtener el rol
                const decodedToken = jwtDecode(response.token);

                // Llamamos a onLoginSuccess y le pasamos el rol junto con el token
                onLoginSuccess(response.token, decodedToken.role);

                // Redirigimos basado en el rol
                if (decodedToken.role === 'ADMIN') {
                    navigate('/admin'); // Redirigir a la página de administración
                } else {
                    navigate('/pets'); // Redirigir a la página de mascotas
                }
            } else {
                setMessage('Token no recibido.');
            }
        } catch (error) {
            setMessage(error.message || 'Error desconocido');
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Registro de Usuario' : 'Iniciar Sesión'}</h1>
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
                <button type="submit">{isRegistering ? 'Registrar' : 'Iniciar Sesión'}</button>
            </form>
            {message && <p>{message}</p>}

            <div>
                {isRegistering ? (
                    <button onClick={() => setIsRegistering(false)}>
                        Ya tengo cuenta. Iniciar sesión
                    </button>
                ) : (
                    <button onClick={() => setIsRegistering(true)}>
                        ¿No tienes cuenta? Regístrate
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
