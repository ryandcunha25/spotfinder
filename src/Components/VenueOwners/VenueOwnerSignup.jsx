import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import loginBg1 from '../Assets/venueownerbg.png';


const VenueOwnerSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
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
    try {
      await axios.post('http://localhost:5000/authentication/send-otp', { email: formData.email });
      setIsOtpSent(true);
      alert('OTP sent to your email');
    } catch (err) {
      alert('Error sending OTP: ' + err);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/authentication/verify-otp', { email: formData.email, otp });
      if (response.status === 200) {
        setIsVerified(true);
        alert('OTP verified successfully');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      alert('Error verifying OTP: ' + err);
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
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center p-20"
      style={{ backgroundImage: `url(${loginBg1})` }}
    >      <div className="md:w-3/4 p-8 bg-transparent bg-opacity-90 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-3xl text-center font-bold mb-8 text-red-200">Register your Venue!</h2>

        <form onSubmit={handleSubmit} className="w-full">
          {!isVerified ? (
            // Show Personal Details and Verify Gmail Button
            <>
              <h3 className="text-xl font-semibold mb-4 text-red-300">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                <div
                  className='col-span-6'>
                  <label
                    className="block text-white font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div
                  className='col-span-6'>
                  <label
                    className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div className='col-span-4'>
                  <label className="block text-white font-medium mb-2">Phone</label>
                  <input type="number" name="phone" value={formData.phone} onChange={handleChange} length={10} required className="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div className="col-span-4">
                  <label className="block text-white font-medium mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="col-span-4">
                  <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-12">
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition">
                    {isOtpSent ? "Resend OTP" : "Verify Gmail"}
                  </button>
                </div>

                {isOtpSent && (
                  <div className="col-span-12 mt-4 flex justify-center items-center gap-4">
                    <input
                      type="number"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-50 px-3 py-2 border rounded-lg text-center"
                      placeholder="Enter OTP"
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                      Verify OTP
                    </button>
                  </div>
                )}

              </div>
            </>
          ) : (
            // Show Venue Details and Submit Button
            <>
              {/* Venue Details */}
              <h3 className="text-xl font-semibold mb-4 text-red-300">Venue Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="venueName" className="block text-white font-medium mb-2">Venue Name</label>
                  <input
                    type="text"
                    id="venueName"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-white font-medium mb-2">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="capacity" className="block text-white font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-white font-medium mb-2">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="venueDescription" className="block text-white font-medium mb-2">Venue Description</label>
                <textarea
                  id="venueDescription"
                  name="venueDescription"
                  value={formData.venueDescription}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="amenities" className="block text-white font-medium mb-2">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    id="amenities"
                    name="amenities"
                    value={formData.amenities.join(', ')} // Join the array into a string for display
                    onChange={handleAmenitiesChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-white font-medium mb-2">Venue Contact</label>
                  <input
                    type="number"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="category" className="block text-white font-medium mb-2">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category.join(', ')} // Join the array into a string for display
                  onChange={handleCategoryChange} // Convert string back into an array on change
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="images" className="block text-white font-medium mb-2">Venue Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </form>

        <div className="text-center text-white text-md mt-6">
          <p>Already have an owner account? <Link to="/venueownerslogin" className="font-semibold hover:underline">Login</Link></p>
          <p>Are you a user? <Link to="/signup" className="font-semibold hover:underline">Sign up as one!</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VenueOwnerSignup;
