import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ProfileSidebar = ({ userName }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token'); 
        localStorage.removeItem('userId');
        sessionStorage.removeItem('userId'); 
        console.log("User logged out!")
        window.location.href = 'http://localhost:3000'; // Redirect to login page
      };
    return (
        <div className="col-span-3">
            {/* Profile */}
         {/* Sidebar */}
      <div className="col-span-3">
        {/* Profile */}
        <div className="px-4 py-3 shadow flex items-center gap-4">
          <div className="flex-shrink-0">
            <img
              src=""
              alt=""
              className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover"
            />
          </div>
          <div className="flex-grow">
            <p className="text-gray-600">Hello,</p>
            <h4 className="text-gray-800">{userName}</h4>
          </div>
        </div>

        {/* Profile Links */}
        <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
          <div className="space-y-1 pl-8">
            <Link href="#" className="relative text-primary block font-medium capitalize transition">
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa fa-address-card"></i>
              </span>
              Manage account
            </Link>
            <Link href="#" className="relative hover:text-primary block font-medium capitalize transition">
              Profile Info
            </Link>
            <Link href="#" className="relative hover:text-primary block font-medium capitalize transition">
              Change password
            </Link>
          </div>
        </div>

        {/* Wishlist Links */}
        <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
          <div className="space-y-1 pl-8">
            <Link href="#" className="relative text-primary block font-medium capitalize transition">
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa fa-heart"></i>
              </span>
              My Wishlist
            </Link>
          </div>
        </div>

        {/* Logout Link */}
        <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
          <div className="space-y-1 pl-8">
            <button
              onClick={handleLogout}
              className="relative text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa fa-sign-out"></i>
              </span>
              LogOut
            </button>
          </div>
        </div>
      </div>

    
    </div>
    );
};

const ProfileInfo = ({ userData }) => {
    const fields = [
        { label: "UserId", value: userData.id},
        { label: "Name", value: userData.first_name + " "+ userData.last_name},
        { label: "Email", value: userData.email },
        { label: "Phone number", value: userData.phone },
    ];

    return (
        <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
            <h4 className="text-lg font-medium capitalize mb-4">Profile Information</h4>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <label htmlFor={field.label} className="text-gray-600 mb-2 block">
                                {field.label}:
                            </label>
                            <input
                                type="text"
                                size="50"
                                value={field.value}
                                readOnly
                                className="input-box"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Accounts = () => {
    const userData = {
        name: "John Doe",
        customerId: "12345",
        email: "john.doe@example.com",
        phone: "9876543210",
    };

    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                setError('User is not authenticated');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/token/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                console.log(response.data);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Unable to fetch user details');
            }
        };

        fetchUserDetails();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container grid grid-cols-12 items-start gap-6 p-16">
            <ProfileSidebar userName={user.first_name} />
            <ProfileInfo userData={user} />
        </div>
    );
};

export default Accounts;
