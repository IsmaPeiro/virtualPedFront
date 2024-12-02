import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PetsPage from './components/PetsPage';

const App = () => {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        setToken(token);
        navigate('/pets');
    };

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                    }
                />
                <Route path="/pets" element={<PetsPage token={token} />} />
            </Routes>
        </div>
    );
};

export default App;
