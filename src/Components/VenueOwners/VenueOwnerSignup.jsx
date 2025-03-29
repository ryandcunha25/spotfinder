import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import loginBg1 from '../Assets/venueownerbg.png';

const VenueOwnerSignup = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    venueName: '',
    venueDescription: '',
    location: '',
    capacity: '',
    price: '',
    amenities: [],
    contact: '',
    category: [],
    images: []
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isResendDisabled]);

  const startCountdown = () => {
    setCountdown(30);
    setIsResendDisabled(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value.split(',').map((item) => item.trim()),
    });
  };

  const handleAmenitiesChange = (e) => {
    setFormData({
      ...formData,
      amenities: e.target.value.split(',').map((item) => item.trim()),
    });
  };

  const handleFileChange = (e) => {
    const fileNames = Array.from(e.target.files).map((file) => file.name);
    setFormData({
      ...formData,
      images: fileNames,
    });
  };

  const sendOtp = async () => {
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/authentication/send-otp', { email: formData.email });
      setIsOtpSent(true);
      startCountdown();
      alert('OTP sent to your email');
    } catch (err) {
      alert('Error sending OTP: ' + err.message);
    }
  };

  const resendOtp = async () => {
    if (!isResendDisabled) {
      await sendOtp();
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/authentication/verify-otp', {
        email: formData.email,
        otp
      });
      if (response.status === 200) {
        setIsVerified(true);
        alert('OTP verified successfully');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      alert('Error verifying OTP: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!Array.isArray(formData.category)) {
        formData.category = formData.category.split(',').map((item) => item.trim());
      }
      const response = await axios.post('http://localhost:5000/owner_authentication/register', formData);
      alert('Registration Successful!');
      navigate('/venueownerslogin');
    } catch (error) {
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Darkened background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={loginBg1}
          className="w-full h-full object-cover opacity-50"
          alt="Venue background"
        />
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-8">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8">
          <h2 className="text-3xl text-center font-bold mb-8 text-white">Register your Venue!</h2>

          <form onSubmit={handleSubmit} className="w-full">
            {!isVerified ? (
              <>
                <h3 className="text-xl font-semibold mb-6 text-white">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* <div className="mb-6">
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={isResendDisabled}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                      isResendDisabled 
                        ? 'bg-gray-600 text-white/50 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isOtpSent 
                      ? `Resend OTP ${isResendDisabled ? `(${countdown}s)` : ''}`
                      : 'Verify Email'}
                  </button>
                </div> */}

                <div className="mb-6">
                  {!isOtpSent ? (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="w-full py-3 px-4 rounded-lg font-medium transition bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Verify Email
                    </button>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <input
                        type="number"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        // required
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter 6-digit OTP"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
                      >
                        Verify OTP
                      </button>
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={isResendDisabled}
                        className={`w-full md:w-auto py-3 px-6 rounded-lg font-medium transition ${isResendDisabled
                            ? 'bg-gray-600 text-white/50 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                      >
                        {isResendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Venue Details
              <>
                <h3 className="text-xl font-semibold mb-6 text-white">Venue Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Venue Name</label>
                    <input
                      type="text"
                      name="venueName"
                      value={formData.venueName}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-medium mb-2">Venue Description</label>
                  <textarea
                    name="venueDescription"
                    value={formData.venueDescription}
                    onChange={handleChange}
                    rows="4"
                    // required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Amenities (comma separated)</label>
                    <input
                      type="text"
                      value={formData.amenities.join(', ')}
                      onChange={handleAmenitiesChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Venue Contact</label>
                    <input
                      type="number"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-medium mb-2">Category (comma separated)</label>
                  <input
                    type="text"
                    value={formData.category.join(', ')}
                    onChange={handleCategoryChange}
                    // required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-medium mb-2">Venue Images</label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    // required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200"
                >
                  Complete Registration
                </button>
              </>
            )}
          </form>

          <div className="text-center text-white/80 text-sm mt-6">
            <p>Already have an owner account? <Link to="/venueownerslogin" className="text-blue-400 hover:text-blue-300 font-medium">Login</Link></p>
            <p className="mt-2">Are you a user? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign up as one!</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueOwnerSignup;