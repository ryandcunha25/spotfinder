import React from 'react';
import { Link } from 'react-router-dom';

const ProfileInfo = ({ userData }) => {
    const fields = [
        { label: "User ID", value: userData.id, icon: "identification" },
        { label: "Name", value: `${userData.first_name} ${userData.last_name}`, icon: "user" },
        { label: "Email", value: userData.email, icon: "mail" },
        { label: "Phone Number", value: userData.phone || "Not provided", icon: "phone" },
    ];

    return (
        <div className="col-span-9 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                    <p className="text-gray-500">View and manage your personal details</p>
                </div>
                <Link 
                    to="/profile/edit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {field.icon === "identification" && (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                )}
                                {field.icon === "user" && (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                )}
                                {field.icon === "mail" && (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                )}
                                {field.icon === "phone" && (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                )}
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500">{field.label}</p>
                            <p className="text-lg font-semibold text-gray-800 truncate">
                                {field.value || <span className="text-gray-400">Not provided</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileInfo;