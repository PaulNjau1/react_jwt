// src/pages/VerifyEmail.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail: React.FC = () => {
    const { token } = useParams<{ token: string }>();

    useEffect(() => {
        const verifyEmail = async () => {
            await axios.get(`http://localhost:5000/api/verify-email/${token}`);
            alert('Email verified successfully!');
        };

        verifyEmail().catch(error => {
            console.error('Verification failed', error);
        });
    }, [token]);

    return <div className="text-center mt-20">Verifying your email...</div>;
};

export default VerifyEmail;
