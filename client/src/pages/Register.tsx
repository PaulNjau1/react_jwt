// src/pages/Register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { username, email, password });
            toast.success('Registration successful! Please verify your email.'); // Show success toast
            setTimeout(() => {
                navigate('/login'); // Redirect to login after a delay to allow toast to display
            }, 2000); // 3 seconds delay
        } catch (err) {
            console.error('Registration error:', err); // Log the error
            toast.error('Registration failed. Please try again.'); // Show error toast
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl mb-4">Register</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full mb-3 p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
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
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>.
                </p>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" /> {/* Add ToastContainer */}
        </div>
    );
};

export default Register;
