// src/pages/ResetPassword.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post(`http://localhost:5000/api/reset-password/${token}`, { newPassword });
        alert('Password has been reset!');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl mb-4">Reset Password</h2>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full mb-3 p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
