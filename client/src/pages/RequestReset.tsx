// src/pages/RequestReset.tsx
import React, { useState } from 'react';
import axios from 'axios';

const RequestReset: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/request-reset', { email });
        alert('Password reset email sent!');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl mb-4">Request Password Reset</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full mb-3 p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Request Reset</button>
            </form>
        </div>
    );
};

export default RequestReset;
