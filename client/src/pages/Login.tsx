// src/pages/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast

interface LoginProps {
    updateAuthState: () => void; // Ensure this is declared
}

const Login: React.FC<LoginProps> = ({ updateAuthState }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use navigate to redirect after login

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            toast.success('Login successful!'); // Show success toast
            updateAuthState(); // Call this to update the auth state
            setTimeout(() => {
                navigate('/profile'); // Redirect to profile after successful login
            }, 3000); // Allow toast to display for 3 seconds
        } catch (err) {
            console.error('Login error:', err); // Log the error
            toast.error('Login failed. Please check your credentials.'); // Show error toast
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl mb-4">Login</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full mb-3 p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full mb-3 p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>

                {/* Forgot Password Link */}
                <p className="mt-4 text-center">
                    <Link to="/request-reset" className="text-blue-500 hover:underline">Forgot your password?</Link>
                </p>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" /> {/* Add ToastContainer */}
        </div>
    );
};

export default Login;
