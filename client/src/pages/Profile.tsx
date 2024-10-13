// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Import the custom axios instance

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch the profile data when the component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axiosInstance.get('http://localhost:5000/api/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setProfileData(response.data);
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            }
        };
        fetchProfile();
    }, []);

    // Function to handle editing the profile
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Function to handle updating the profile (username only)
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        try {
            const response = await axiosInstance.put('http://localhost:5000/api/profile', 
                { username },  // Only send username, exclude email
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage(response.data.message);
            setProfileData(response.data.user);
            setIsEditing(false); // Stop editing after successful update
        } catch (error) {
            setMessage('Error updating profile.');
            console.error('Error updating profile:', error);
        }
    };

    if (!profileData) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="flex flex-col items-center mt-20">
            <h1 className="text-2xl mb-4">Profile</h1>
            <div className="bg-white p-6 rounded shadow-md w-80">
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Username:</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="w-full p-2 border rounded" 
                                required 
                            />
                        ) : (
                            <p className="text-gray-700">{profileData.username}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Email:</label>
                        {/* Disable email field during editing */}
                        <input 
                            type="email" 
                            value={email} 
                            disabled // Make this field non-editable
                            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed" 
                        />
                    </div>
                    {isEditing && (
                        <div className="flex justify-between">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Update
                            </button>
                            <button type="button" onClick={handleEdit} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
                <button onClick={handleEdit} className="mt-4 bg-gray-300 text-black px-4 py-2 rounded">
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
                {message && <p className="text-red-500 mt-2">{message}</p>}
            </div>
        </div>
    );
};

export default Profile;
