import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import ProfileSidebar from './ProfileSidebar';
import ProfileInfo from './ProfileInfo';
import EditProfile from './EditProfile';

const Accounts = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const backendurl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                message.warning("Please log in to view your profile");
                navigate("/login");
                setError('User is not authenticated');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${backendurl}/token/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Unable to fetch user details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const handleUpdate = (updatedData) => {
        setUser(updatedData);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading profile</h3>
                    <p className="mt-2 text-sm text-gray-500">{error}</p>
                    <div className="mt-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="max-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <ProfileSidebar userName={user.first_name} />

                    <Routes>
                        <Route index element={<ProfileInfo userData={user} />} />
                        <Route path="/edit" element={<EditProfile userData={user} onUpdate={handleUpdate} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Accounts;