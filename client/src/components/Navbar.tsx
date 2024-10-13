// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// Define props interface
interface NavbarProps {
    isAuthenticated: boolean; // Prop for authentication status
    onLogout: () => void;     // Prop for logout function
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        onLogout(); // Call the onLogout function to update the auth state in App
        window.location.href = '/login'; // Redirect to login after logout
    };

    return (
        <nav className="bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border border-gray-200 p-4 shadow-lg fixed top-0 left-0 right-0 z-50"> {/* Add semi-transparent background and blur */}
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-black text-lg font-bold">JWT_AUTH APP</Link>
                <div className="flex space-x-4">
                    {!isAuthenticated && (
                        <>
                            <Link to="/register" className="text-black hover:text-blue-300 px-3 py-2 rounded">Register</Link>
                            <Link to="/login" className="text-black hover:text-blue-300 px-3 py-2 rounded">Login</Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <Link to="/profile" className="text-black hover:text-blue-300 px-3 py-2 rounded">Profile</Link>
                            <button 
                                onClick={handleLogout} 
                                className="text-black hover:text-blue-300 px-3 py-2 rounded"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
