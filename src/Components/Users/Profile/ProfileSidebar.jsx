import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSidebar = ({ userName }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token'); 
        localStorage.removeItem('userId');
        sessionStorage.removeItem('userId'); 
        window.location.href = '/';
    };

    return (
        <div className="col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="px-6 py-5 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                <div className="flex-shrink-0">
                    <div className="rounded-full w-16 h-16 border-2 border-indigo-100 p-1 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                        <span className="text-2xl font-bold text-indigo-600">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </div>
                </div>
                <div className="flex-grow">
                    <p className="text-gray-500 text-sm">Welcome back,</p>
                    <h4 className="text-gray-800 font-medium text-lg">{userName}</h4>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <Link to="/profile" className="flex items-center px-6 py-4 text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Profile Information</span>
                </Link>
                
                <Link to="/profile/edit" className="flex items-center px-6 py-4 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="font-medium">Edit Profile</span>
                </Link>
                
                <Link to="/wishlist" className="flex items-center px-6 py-4 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">My Wishlist</span>
                </Link>
                
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-6 py-4 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileSidebar;