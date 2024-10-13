// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RequestReset from './pages/RequestReset';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('accessToken'));

    // Function to update authentication state
    const updateAuthState = () => {
        setIsAuthenticated(!!localStorage.getItem('accessToken'));
    };

    useEffect(() => {
        // Check if the user is authenticated on mount
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} onLogout={updateAuthState} />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login updateAuthState={updateAuthState} />} /> {/* Pass the function here */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/request-reset" element={<RequestReset />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
            </Routes>
        </Router>
    );
};

export default App;
