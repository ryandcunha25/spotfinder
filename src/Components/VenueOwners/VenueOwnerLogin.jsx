import React, { useState } from 'react';
import loginBg1 from '../Assets/venueownerbg.png';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const VenueOwnerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerId: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("https://84fa-115-98-235-107.ngrok-free.app/owner_authentication/login", formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('ownerId', response.data.ownerDetails.ownerId);
      localStorage.setItem('fullName', response.data.ownerDetails.fullName);
      navigate("/dashboard");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-8 md:p-20 relative"
      style={{ backgroundImage: `url(${loginBg1})` }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40"></div>
      
      <div className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl relative z-10 transition-all duration-300 hover:shadow-lg">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-100 to-yellow-100 mb-2">
            Venue Owner Portal
          </h2>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-100 text-center animate-fade-in">
              {errorMessage}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-2">
              <label htmlFor="ownerId" className="block text-white font-medium">Owner ID</label>
              <input
                type="text"
                id="ownerId"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all"
                placeholder="Enter 6-digit Venue ID"
              />
            </div>
            <div className="md:col-span-6 space-y-2">
              <label htmlFor="password" className="block text-white font-medium">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all"
                placeholder="Enter Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/30'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <div className="text-center text-white/80 text-md mt-8">
          <p>Don't have an owner account?{' '}
            <a href="/venueownersregistration" className="font-semibold text-yellow-300 hover:text-yellow-200 underline underline-offset-4 hover:no-underline transition">
              Sign up here!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenueOwnerLogin;