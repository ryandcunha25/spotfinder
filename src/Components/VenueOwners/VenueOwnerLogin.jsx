import React, { useState } from 'react';
import loginBg1 from '../Assets/venueownerbg.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useNavigate
} from "react-router-dom";
import axios from 'axios';

const VenueOwnerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerId: '',
    password: '',
  });


  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);
    try {
      const response = await axios.post("http://localhost:5000/owner_authentication/login", formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      console.log(response)
      console.log("Owner Details:", response.data.ownerDetails); // You can handle this data as needed
      alert('Login Successful!');
      localStorage.setItem('token', response.data.token); // Store token
      localStorage.setItem('ownerId', response.data.ownerDetails.ownerId); // Store token
      localStorage.setItem('fullName', response.data.ownerDetails.fullName); // Store token
      console.log(response.data.ownerDetails.ownerId); // Store token
      navigate("/dashboard")

    } catch (error) {
      setSuccessMessage("");
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center p-20"
      style={{ backgroundImage: `url(${loginBg1})` }}
    >
      <div className="md:w-1/2 p-8 bg-transparent bg-opacity-90 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-3xl text-center font-bold mb-8 text-red-100">Venue Owner Login</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <div className="md:col-span-6">
              <label htmlFor="ownerId" className="block text-white font-medium mb-2">Owner ID</label>
              <input
                type="text"
                id="ownerId"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter 6-digit Venue ID"
              />
            </div>
            <div className="md:col-span-6">
              <label htmlFor="password" className="block text-white font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <div className="text-center text-white text-md mt-6">
          <p>Don't have an owner account? <a href="/venueownersregistration" className="font-semibold hover:underline">Sign up here!</a></p>
        </div>
      </div>
    </div>
  );
};

export default VenueOwnerLogin;
