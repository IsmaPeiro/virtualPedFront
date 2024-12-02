import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PetDetailsPage = () => {
    const { petName } = useParams();
    const navigate = useNavigate();
    const [petDetails, setPetDetails] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Para controlar la visibilidad del modal
    const [locations, setLocations] = useState([]); // Para almacenar las ubicaciones posibles
    const [selectedLocation, setSelectedLocation] = useState(''); // Para almacenar la ubicación seleccionada
    const [accessories, setAccessories] = useState([]); // Para almacenar los accesorios posibles
    const [selectedAccessory, setSelectedAccessory] = useState(''); // Para almacenar el accesorio seleccionado

    // Cargar los detalles de la mascota al montar el componente
    useEffect(() => {
        const fetchPetDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                    params: { petName },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPetDetails(response.data); // Actualizamos petDetails con los datos actuales
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los detalles de la mascota');
                setShowModal(true); // Mostrar el modal si hay un error
            }
        };

        const fetchLocations = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8080/enum/petLocations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLocations(response.data); // Establecemos las ubicaciones posibles
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las ubicaciones');
                setShowModal(true); // Mostrar el modal si hay un error
            }
        };

        const fetchAccessories = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8080/enum/petAccessories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAccessories(response.data); // Establecemos los accesorios posibles
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los accesorios');
                setShowModal(true); // Mostrar el modal si hay un error
            }
        };

        fetchPetDetails();
        fetchLocations();
        fetchAccessories();

        // Actualizar los detalles de la mascota cada 120000 ms (120 segundos)
        const interval = setInterval(fetchPetDetails, 120000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, [petName]);

    const handleFeedPet = async () => {
        const token = localStorage.getItem('token');
        try {
            // Alimentar la mascota en el backend
            await axios.post('http://localhost:8080/pet/feedPet', petName, {
                params: { petName },
                headers: { Authorization: `Bearer ${token}` },
            });

            // Después de alimentar, recargamos los detalles más recientes de la mascota
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data); // Actualizamos petDetails con los nuevos valores

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo alimentar la mascota');
            setShowModal(true); // Mostrar el modal si hay un error
        }
    };

    const handlePlayPet = async () => {
        const token = localStorage.getItem('token');
        try {
            // Enviar solicitud para hacer que la mascota juegue
            await axios.post('http://localhost:8080/pet/playPet', null, {
                params: { petName },
                headers: { Authorization: `Bearer ${token}` },
            });

            // Después de jugar, recargamos los detalles más recientes de la mascota
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data); // Actualizamos petDetails con los nuevos valores

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo hacer jugar a la mascota');
            setShowModal(true); // Mostrar el modal si hay un error
        }
    };

    const handlePetPet = async () => {
        const token = localStorage.getItem('token');
        try {
            // Enviar solicitud para acariciar a la mascota
            await axios.post('http://localhost:8080/pet/petPet', null, {
                params: { petName },
                headers: { Authorization: `Bearer ${token}` },
            });

            // Después de acariciar, recargamos los detalles más recientes de la mascota
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data); // Actualizamos petDetails con los nuevos valores

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo acariciar la mascota');
            setShowModal(true); // Mostrar el modal si hay un error
        }
    };

    // Nueva función para dormir a la mascota
    const handleSleepPet = async () => {
        const token = localStorage.getItem('token');
        try {
            // Enviar solicitud para dormir a la mascota
            await axios.post('http://localhost:8080/pet/sleepPet', null, {
                params: { petName },
                headers: { Authorization: `Bearer ${token}` },
            });

            // Después de dormir, recargamos los detalles más recientes de la mascota
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data); // Actualizamos petDetails con los nuevos valores

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo dormir a la mascota');
            setShowModal(true); // Mostrar el modal si hay un error
        }
    };

    const handleChangeLocation = async () => {
        const token = localStorage.getItem('token');
        if (!selectedLocation) {
            setError('Debe seleccionar una ubicación');
            setShowModal(true);
            return;
        }

        try {
            // Enviar solicitud para cambiar la ubicación de la mascota
            await axios.post('http://localhost:8080/pet/changeLocation', null, {
                params: { petName, newLocation: selectedLocation },
                headers: { Authorization: `Bearer ${token}` },
            });

            // Después de cambiar la ubicación, recargamos los detalles más recientes de la mascota
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data); // Actualizamos petDetails con los nuevos valores
            setSelectedLocation(''); // Limpiamos la selección de ubicación

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo cambiar la ubicación de la mascota');
            setShowModal(true); // Mostrar el modal si hay un error
        }
    };

    const handleUpdateAccessory = async () => {
        const token = localStorage.getItem('token');
        if (!selectedAccessory) {
            setError('Debe seleccionar un accesorio');
            setShowModal(true);
            return;
        }

        try {
            // Enviar solicitud para actualizar el accesorio de la mascota
            await axios.post('http://localhost:8080/pet/updateAccessory', null, {
                params: { petName, accessory: selectedAccessory },
                headers: { Authorization: `Bearer ${token}` },
            });

            // Después de actualizar el accesorio, recargamos los detalles más recientes de la mascota
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data); // Actualizamos petDetails con los nuevos valores
            setSelectedAccessory(''); // Limpiamos la selección de accesorio

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo actualizar el accesorio');
            setShowModal(true); // Mostrar el modal si hay un error
        }
    };

    const closeModal = () => setShowModal(false); // Función para cerrar el modal

    const handleGoBack = () => {
        navigate('/pets'); // Regresar a la página de mascotas
    };

    return (
        <div>
            {/* Modal para mostrar el error */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        zIndex: 9999,
                        width: '300px',
                        textAlign: 'center',
                    }}
                >
                    <h3 style={{ color: 'red' }}>{error}</h3>
                    <button onClick={closeModal}>Cerrar</button>
                </div>
            )}

            {/* Información de la mascota */}
            {petDetails ? (
    <div>
        <h1>Detalles de {petDetails.petName}</h1>
        <ul>
            {Object.entries(petDetails).map(([key, value]) => (
                key !== 'id' && key !== 'owner' ? (
                    <li key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
                        {Array.isArray(value) ? value.join(', ') : value}
                    </li>
                ) : null
            ))}
        </ul>
                    <button onClick={handleFeedPet}>Alimentar</button>
                    <button onClick={handlePlayPet}>Jugar</button>
                    <button onClick={handlePetPet}>Acariciar</button>
                    <button onClick={handleSleepPet}>Dormir</button>
                    <button onClick={handleGoBack}>Volver a Mis Mascotas</button>

                    {/* Selección de ubicación */}
                    <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation}>
                        <option value="">Selecciona una ubicación</option>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleChangeLocation}>Cambiar ubicación</button>

                    {/* Selección de accesorio */}
                    <select onChange={(e) => setSelectedAccessory(e.target.value)} value={selectedAccessory}>
                        <option value="">Selecciona un accesorio</option>
                        {accessories.map((accessory, index) => (
                            <option key={index} value={accessory}>
                                {accessory}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleUpdateAccessory}>Actualizar accesorio</button>
                </div>
            ) : (
                <p>Cargando detalles de la mascota...</p> // Mensaje mientras se carga
            )}
        </div>
    );
};

export default PetDetailsPage;
