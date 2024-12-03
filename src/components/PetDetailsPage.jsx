import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePetActions from '../hooks/usePetActions';
import ErrorModal from './ErrorModal';
import PetDetails from './PetDetails';
import axios from 'axios';

const PetDetailsPage = () => {
    const { petName } = useParams();
    const navigate = useNavigate();
    const [petDetails, setPetDetails] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Para controlar la visibilidad del modal
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [accessories, setAccessories] = useState([]);
    const [selectedAccessory, setSelectedAccessory] = useState('');

    const {
        fetchPetDetails,
        handleFeedPet,
        handlePlayPet,
        handlePetPet,
        handleSleepPet,
        handleChangeLocation,
        handleUpdateAccessory,
    } = usePetActions(petName, setPetDetails, setError, setShowModal);

    useEffect(() => {
        const fetchLocationsAndAccessories = async () => {
            const token = localStorage.getItem('token');
            try {
                const locationsResponse = await axios.get(
                    'http://localhost:8080/enum/petLocations',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLocations(locationsResponse.data);

                const accessoriesResponse = await axios.get(
                    'http://localhost:8080/enum/petAccessories',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAccessories(accessoriesResponse.data);
            } catch (err) {
                setError('No se pudieron cargar las ubicaciones o accesorios');
                setShowModal(true);
            }
        };

        fetchPetDetails();
        fetchLocationsAndAccessories();

        const interval = setInterval(fetchPetDetails, 120000);
        return () => clearInterval(interval);
    }, [fetchPetDetails]);

    return (
        <div>
            {showModal && <ErrorModal error={error} onClose={() => setShowModal(false)} />}
            {petDetails ? (
                <div>
                    <PetDetails petDetails={petDetails} />
                    <button onClick={handleFeedPet}>Alimentar</button>
                    <button onClick={handlePlayPet}>Jugar</button>
                    <button onClick={handlePetPet}>Acariciar</button>
                    <button onClick={handleSleepPet}>Dormir</button>
                    <button onClick={() => navigate('/pets')}>Volver a Mis Mascotas</button>

                    <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation}>
                        <option value="">Selecciona una ubicación</option>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleChangeLocation(selectedLocation)}>Cambiar ubicación</button>

                    <select onChange={(e) => setSelectedAccessory(e.target.value)} value={selectedAccessory}>
                        <option value="">Selecciona un accesorio</option>
                        {accessories.map((accessory, index) => (
                            <option key={index} value={accessory}>
                                {accessory}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleUpdateAccessory(selectedAccessory)}>Actualizar accesorio</button>
                </div>
            ) : (
                <p>Cargando detalles de la mascota...</p>
            )}
        </div>
    );
};

export default PetDetailsPage;
