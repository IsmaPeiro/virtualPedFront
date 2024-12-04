import React, { useState } from 'react';
import { login, register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Usamos la importación correcta
import './LoginForm.css'; // Importamos los estilos CSS

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
                response = await register(formData);
                setMessage('User registered successfully. You can now log in.');
                response = await login(formData);
            } else {
                response = await login(formData);
            }

            if (response && response.token) {
                localStorage.setItem('token', response.token);
                const decodedToken = jwtDecode(response.token);
                onLoginSuccess(response.token, decodedToken.role);
                navigate(decodedToken.role === 'ADMIN' ? '/admin' : '/pets');
            } else {
                setMessage('Token not received.');
            }
        } catch (error) {
            setMessage(error.message || 'Error desconocido');
        }
    };

    return (
        <div className="login-container">
            <h1 className="title">{isRegistering ? 'User Registration' : 'Login'}</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="nickname" className="form-label">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className="form-input"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn submit-btn">
                    {isRegistering ? 'User Registration' : 'Login'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
            <div className="toggle-container">
                {isRegistering ? (
                    <button className="toggle-btn" onClick={() => {setIsRegistering(false);setMessage('');}}>
                        I already have an account. Log in
                    </button>
                ) : (
                    <button className="toggle-btn" onClick={() => {setIsRegistering(true);setMessage('');}}>
                        Don't have an account? Sign up
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
