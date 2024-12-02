import axios from 'axios';

// URL de tu backend
const API_URL = 'http://localhost:8080';  // Cambia esto si el puerto de tu backend es diferente

/**
 * Login de usuario.
 * @param {Object} credentials - { nickname, password }
 * @returns {Promise<Object>} - Respuesta del backend (token).
 */

// Función para hacer login
export const login = async (loginData) => {
    try {
        // Realizamos la solicitud POST con los datos de login
        const response = await axios.post(`${API_URL}/auth/login`, loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Si la respuesta tiene el token, lo devolvemos
        if (response.data) {
            return { token: response.data };  // El backend debería devolver solo el token
        } else {
            throw new Error("Token no recibido.");
        }
    } catch (error) {
        // Manejo de errores
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || "Error de autenticación");
        } else {
            throw new Error("Error desconocido");
        }
    }
};

/**
 * Registro de usuario.
 * @param {Object} userData - { nickname, password }
 * @returns {Promise<Object>} - Respuesta del backend.
 */
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data; // Devuelve los datos de registro
    } catch (error) {
        throw error.response?.data?.message || 'Error al conectar con el servidor';
    }
};
