import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePetActions from '../hooks/usePetActions';
import ErrorModal from './ErrorModal';
import PetDetails from './PetDetails';
import axios from 'axios';
import './PetDetailsPage.css';

const PetDetailsPage = () => {
    const { petName } = useParams();
    const navigate = useNavigate();
    const [petDetails, setPetDetails] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [accessories, setAccessories] = useState([]);
    const [selectedAccessory, setSelectedAccessory] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

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

                setDataLoaded(true);
            } catch (err) {
                if (!dataLoaded) {
                    setError('No se pudieron cargar las ubicaciones o accesorios');
                    setShowModal(true);
                }
            }
        };

        if (!dataLoaded) {
            fetchLocationsAndAccessories();
        }

        fetchPetDetails();
        const interval = setInterval(fetchPetDetails, 120000);
        return () => clearInterval(interval);
    }, [fetchPetDetails, dataLoaded]);

    const getBackgroundClass = () => {
        switch (petDetails?.petLocation) {
            case 'HOME':
                return 'petDetails-background-home';
            case 'PARK':
                return 'petDetails-background-park';
            case 'VET':
                return 'petDetails-background-vet';
            default:
                return 'petDetails-background-default';
        }
    };

    return (
        <div className="petDetails-page">
            {showModal && <ErrorModal error={error} onClose={() => setShowModal(false)} />}
            <button className="petDetails-back-btn" onClick={() => navigate('/pets')}>
                Volver a Mis Mascotas
            </button>
            {petDetails ? (
                <div className="petDetails-container">
                    <div className={`petDetails-image-container ${getBackgroundClass()}`}>
                        <img
                            src={`/assets/pets/${petDetails.type}_${petDetails.color}_${petDetails.petMood}.png`}
                            alt={petDetails.petName}
                            onError={(e) => (e.target.src = '/assets/pets/default.png')}
                        class="petDetails-image"/>
                        {petDetails.accessories &&
    petDetails.accessories.map((accessory) => (
        <img
            key={accessory}
            src={`/assets/accessories/${accessory}.png`}
            alt={accessory}
            className={`accessory petDetails-accessory-${accessory.toLowerCase()}-${petDetails.type.toLowerCase()}`}
            onError={(e) => (e.target.src = '/assets/accessories/default.png')}
        />
    ))}
                    </div>
                    <div className="petDetails-stats-container">
                        <PetDetails petDetails={petDetails} />
                    </div>
                    <div className="petDetails-actions-container">
                        <button className="petDetails-action-btn" onClick={handleFeedPet}>
                            Alimentar
                        </button>
                        <button className="petDetails-action-btn" onClick={handlePlayPet}>
                            Jugar
                        </button>
                        <button className="petDetails-action-btn" onClick={handlePetPet}>
                            Acariciar
                        </button>
                        <button className="petDetails-action-btn" onClick={handleSleepPet}>
                            Dormir
                        </button>
                        <div className="petDetails-actions-dropdown">
                            <select
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                value={selectedLocation}
                            >
                                <option value="">Selecciona una ubicación</option>
                                {locations.map((location, index) => (
                                    <option key={index} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="petDetails-action-btn"
                                onClick={() => handleChangeLocation(selectedLocation)}
                            >
                                Cambiar ubicación
                            </button>
                            <select
                                onChange={(e) => setSelectedAccessory(e.target.value)}
                                value={selectedAccessory}
                            >
                                <option value="">Selecciona un accesorio</option>
                                {accessories.map((accessory, index) => (
                                    <option key={index} value={accessory}>
                                        {accessory}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="petDetails-action-btn"
                                onClick={() => handleUpdateAccessory(selectedAccessory)}
                            >
                                Actualizar accesorio
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="petDetails-loading-text">Cargando detalles de la mascota...</p>
            )}
        </div>
    );
};

export default PetDetailsPage;
