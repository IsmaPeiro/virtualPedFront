import axios from 'axios';

const usePetActions = (petName, setPetDetails, setError, setShowModal) => {
    const token = localStorage.getItem('token');

    const fetchPetDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/pet/getOneUserPet`, {
                params: { petName },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data);
        } catch (err) {
            setError('No se pudieron cargar los detalles de la mascota');
            setShowModal(true);
        }
    };

    const performAction = async (endpoint, additionalParams = {}) => {
        try {
            await axios.post(`http://localhost:8080/pet/${endpoint}`, null, {
                params: { petName, ...additionalParams },
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchPetDetails(); // Actualizar detalles después de la acción
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo realizar la acción');
            setShowModal(true);
        }
    };

    return {
        fetchPetDetails,
        handleFeedPet: () => performAction('feedPet'),
        handlePlayPet: () => performAction('playPet'),
        handlePetPet: () => performAction('petPet'),
        handleSleepPet: () => performAction('sleepPet'),
        handleChangeLocation: (newLocation) =>
            performAction('changeLocation', { newLocation }),
        handleUpdateAccessory: (accessory) =>
            performAction('updateAccessory', { accessory }),
    };
};

export default usePetActions;
