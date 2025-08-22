import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import loginBg1 from '../Assets/venueownerbg.png';
import { message } from 'antd';

const VenueOwnerSignup = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Loading states
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form state
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
    amenitiesString: '',
    contact: '',
    category: [],
    categoryString: '',
    images: []
  });

  // Error states
  const [errors, setErrors] = useState({
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
    amenitiesString: '',
    contact: '',
    categoryString: '',
    images: ''
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const backendurl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


  // Steps configuration
  const [steps, setSteps] = useState([
    { id: 1, name: 'Personal Details', status: 'current' },
    { id: 2, name: 'OTP Verification', status: 'upcoming' },
    { id: 3, name: 'Venue Details', status: 'upcoming' }
  ]);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validateFormStep1 = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateFormStep3 = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.venueName.trim()) {
      newErrors.venueName = 'Venue name is required';
      isValid = false;
    } else if (formData.venueName.length < 3) {
      newErrors.venueName = 'Venue name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.venueDescription.trim()) {
      newErrors.venueDescription = 'Venue description is required';
      isValid = false;
    } else if (formData.venueDescription.length < 20) {
      newErrors.venueDescription = 'Description must be at least 20 characters';
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
      isValid = false;
    } else if (isNaN(formData.capacity) || formData.capacity <= 0) {
      newErrors.capacity = 'Please enter a valid capacity number';
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(formData.price) || formData.price < 0) {
      newErrors.price = 'Please enter a valid price';
      isValid = false;
    }

    if (!formData.amenitiesString.trim()) {
      newErrors.amenitiesString = 'At least one amenity is required';
      isValid = false;
    }

    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
      isValid = false;
    } else if (!validatePhone(formData.contact)) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
      isValid = false;
    }

    if (!formData.categoryString.trim()) {
      newErrors.categoryString = 'At least one category is required';
      isValid = false;
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update steps status when currentStep changes
  useEffect(() => {
    const updatedSteps = steps.map(step => {
      if (step.id < currentStep) return { ...step, status: 'complete' };
      if (step.id === currentStep) return { ...step, status: 'current' };
      return { ...step, status: 'upcoming' };
    });
    setSteps(updatedSteps);
  }, [currentStep]);

  // Countdown timer
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      categoryString: value,
      category: value.split(',').map(item => item.trim()).filter(item => item !== '')
    });

    if (errors.categoryString) {
      setErrors({
        ...errors,
        categoryString: ''
      });
    }
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      amenitiesString: value,
      amenities: value.split(',').map(item => item.trim()).filter(item => item !== '')
    });

    if (errors.amenitiesString) {
      setErrors({
        ...errors,
        amenitiesString: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
      message.warning('You can upload a maximum of 5 images');
      return;
    }

    const fileNames = Array.from(files).map((file) => file.name);
    setFormData({
      ...formData,
      images: fileNames,
    });

    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
  };

  const sendOtp = async () => {
    if (!validateFormStep1()) return;

    setSendOtpLoading(true);
    try {
      await axios.post(`${backendurl}/authentication/send-otp`, { email: formData.email });
      setIsOtpSent(true);
      setCurrentStep(2);
      startCountdown();
      message.success('OTP sent to your email');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        message.error('Email already registered');
        setErrors({
          ...errors,
          email: 'Email already registered'
        });
      } else {
        message.error('Error sending OTP: ' + (err.message || 'Please try again later'));
      }
    } finally {
      setSendOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!isResendDisabled) {
      setResendOtpLoading(true);
      try {
        await axios.post(`${backendurl}/authentication/send-otp`, { email: formData.email });
        startCountdown();
        message.success('OTP resent to your email');
      } catch (err) {
        message.error('Error resending OTP: ' + err.message);
      } finally {
        setResendOtpLoading(false);
      }
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      message.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyOtpLoading(true);
    try {
      const response = await axios.post(`${backendurl}/authentication/verify-otp`, {
        email: formData.email,
        otp
      });
      if (response.status === 200) {
        setIsVerified(true);
        setCurrentStep(3);
        message.success('OTP verified successfully');
      } else {
        message.error('Invalid OTP');
      }
    } catch (err) {
      message.error('Incorrect OTP. Try Again.');
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormStep3()) return;

    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        amenities: Array.isArray(formData.amenities) ? formData.amenities : formData.amenities.split(',').map(item => item.trim()),
        category: Array.isArray(formData.category) ? formData.category : formData.category.split(',').map(item => item.trim())
      };

      const response = await axios.post(`${backendurl}/owner_authentication/register`, payload);
      message.success('Registration Successful!');
      navigate('/venueownerslogin');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred during registration. Please try again.';
      message.error(errorMsg);

      // Handle specific field errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.path] = err.msg;
          return acc;
        }, {});
        setErrors({
          ...errors,
          ...backendErrors
        });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Step navigation component
  const StepNavigation = () => (
    <nav className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.id} className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
            {step.status === 'complete' ? (
              <>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-14 h-10 bg-green-600 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="ml-2 text-sm font-medium text-white">{step.name}</span>
                </div>
                {index !== steps.length - 1 && (
                  <div className="hidden md:block w-full h-1 mx-2 bg-green-600"></div>
                )}
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-14 h-10 border-2 border-blue-600 rounded-full">
                    <span className="text-blue-500">{step.id}</span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-blue-600">{step.name}</span>
                </div>
                {index !== steps.length - 1 && (
                  <div className="hidden md:block w-full h-1 mx-2 bg-gray-200"></div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-14 h-10 border-2 border-gray-300 rounded-full">
                    <span className="text-gray-500">{step.id}</span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-500">{step.name}</span>
                </div>
                {index !== steps.length - 1 && (
                  <div className="hidden md:block w-full h-1 mx-2 bg-gray-200"></div>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Background image */}
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

          {/* Step Navigation */}
          <StepNavigation />

          <form onSubmit={handleSubmit} className="w-full">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
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
                      required
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.fullName ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="8"
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength="8"
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendOtpLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center ${sendOtpLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  {sendOtpLoading && <LoadingSpinner />}
                  {sendOtpLoading ? 'Sending OTP...' : 'Verify Email'}
                </button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-6 text-white">OTP Verification</h3>
                <p className="text-white/70 mb-4">We've sent a 6-digit code to {formData.email}</p>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full max-w-xs">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength="6"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center tracking-widest text-2xl font-mono placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="------"
                      style={{ letterSpacing: '0.5em' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={verifyOtpLoading || otp.length !== 6}
                    className={`w-fit md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center ${verifyOtpLoading ? 'opacity-75 cursor-not-allowed' : ''
                      } ${otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {verifyOtpLoading && <LoadingSpinner />}
                    {verifyOtpLoading ? 'Verifying OTP...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isResendDisabled || resendOtpLoading}
                    className={`w-1/2 md:w-auto py-3 px-6 rounded-lg font-medium transition flex items-center justify-center ${isResendDisabled || resendOtpLoading
                      ? 'bg-gray-600 text-white/50 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {resendOtpLoading && <LoadingSpinner />}
                    {resendOtpLoading ? 'Resending OTP...' : isResendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
                {otp.length > 0 && otp.length < 6 && (
                  <p className="mt-2 text-sm text-red-400">OTP must be 6 digits</p>
                )}
              </div>
            )}

            {/* Step 3: Venue Details */}
            {currentStep === 3 && (
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
                      required
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.venueName ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.venueName && <p className="mt-1 text-sm text-red-400">{errors.venueName}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.location ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      min="1"
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.capacity ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.capacity && <p className="mt-1 text-sm text-red-400">{errors.capacity}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.price ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-medium mb-2">Venue Description</label>
                  <textarea
                    name="venueDescription"
                    value={formData.venueDescription}
                    onChange={handleChange}
                    rows="4"
                    required
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.venueDescription ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  ></textarea>
                  {errors.venueDescription && <p className="mt-1 text-sm text-red-400">{errors.venueDescription}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Amenities (comma separated)</label>
                    <input
                      type="text"
                      name="amenitiesString"
                      value={formData.amenitiesString}
                      onChange={handleAmenitiesChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.amenitiesString ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="WiFi, Parking, AC, Projector"
                    />
                    {errors.amenitiesString && <p className="mt-1 text-sm text-red-400">{errors.amenitiesString}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Venue Contact</label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.contact ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.contact && <p className="mt-1 text-sm text-red-400">{errors.contact}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-medium mb-2">Category (comma separated)</label>
                  <input
                    type="text"
                    name="categoryString"
                    value={formData.categoryString}
                    onChange={handleCategoryChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.categoryString ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Wedding, Conference, Party"
                  />
                  {errors.categoryString && <p className="mt-1 text-sm text-red-400">{errors.categoryString}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-medium mb-2">Venue Images (Max 5)</label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    required
                    accept="image/*"
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.images ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                  />
                  {errors.images && <p className="mt-1 text-sm text-red-400">{errors.images}</p>}
                  {formData.images.length > 0 && (
                    <p className="mt-2 text-sm text-white/70">
                      Selected files: {formData.images.join(', ')}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 flex items-center justify-center ${submitLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  {submitLoading && <LoadingSpinner />}
                  {submitLoading ? 'Registering...' : 'Complete Registration'}
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