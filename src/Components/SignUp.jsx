import React, { useState, useEffect } from 'react';
import loginBg1 from './Assets/login_bg.jpg';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { message } from 'antd';

const SignUp = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        cpassword: '',
    });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const startCountdown = () => {
        setCountdown(30);
        setResendDisabled(true);
    };

    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, resendDisabled]);

    const sendOtp = async () => {
        if (!formData.email) {
            message.error('Please enter your email first');
            return;
        }

        setIsSendingOtp(true);
        try {
            // First check if email exists
            const checkResponse = await axios.post(
                'https://84fa-115-98-235-107.ngrok-free.app/authentication/check-email',
                { email: formData.email }
            );

            if (checkResponse.data.exists) {
                message.error('This email is already registered. Please use a different email.');
                return;
            }
            
            await axios.post(
                'https://84fa-115-98-235-107.ngrok-free.app/authentication/send-otp',
                { email: formData.email }
            );
            setIsOtpSent(true);
            startCountdown();
            message.success('OTP sent to your email');
        } catch (err) {
            message.error('Error sending OTP: ' + err);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            message.error('Please enter the OTP');
            return;
        }

        setIsVerifyingOtp(true);
        try {
            const response = await axios.post(
                'https://84fa-115-98-235-107.ngrok-free.app/authentication/verify-otp',
                { email: formData.email, otp }
            );
            if (response.status === 200) {
                setIsVerified(true);
                setIsOtpSent(false);
                message.success('OTP verified successfully');
            } else {
                message.error('Invalid OTP');
            }
        } catch (err) {
            message.error('Error verifying OTP: ' + err);
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const resendOtp = async () => {
        if (!resendDisabled) {
            await sendOtp();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.phone.length !== 10) {
            message.error('Phone number must be exactly 10 digits');
            return;
        }
        if (formData.password.length < 8) {
            message.error('Password must be at least 8 characters long');
            return;
        }
        if (formData.password !== formData.cpassword) {
            message.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                'https://84fa-115-98-235-107.ngrok-free.app/authentication/signup',
                formData
            );
            message.success('User registered successfully');
            navigate('/');
        } catch (err) {
            message.error('Error registering user: ' + err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-900">
            {/* Darkened background image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-25"
                style={{ backgroundImage: `url(${loginBg1})` }}
            ></div>

            <section className="relative z-10 flex justify-center items-center min-h-screen px-4">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl font-bold text-center text-white mb-8">Create Account</h2>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    name="first_name"
                                    placeholder="First name"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    name="last_name"
                                    placeholder="Last name"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                onChange={handleChange}
                                name="email"
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-white/80 mb-1">Phone Number</label>
                            <input
                                type="number"
                                required
                                onChange={handleChange}
                                name="phone"
                                placeholder="1234567890"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* OTP Section */}
                        {!isVerified && isOtpSent && (
                            <div className="mb-5 bg-white/5 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-white/80 mb-1">Enter OTP</label>
                                <input
                                    type="text"
                                    required
                                    onChange={(e) => setOtp(e.target.value)}
                                    name="otp"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={verifyOtp}
                                        disabled={isVerifyingOtp}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                                    >
                                        {isVerifyingOtp ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : 'Verify OTP'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resendOtp}
                                        disabled={resendDisabled || isSendingOtp}
                                        className={`flex-1 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                                            resendDisabled || isSendingOtp
                                                ? "bg-gray-600 text-white/50 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                    >
                                        {isSendingOtp ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : resendDisabled ? `Resend (${countdown}s)` : "Resend"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isVerified && !isOtpSent && (
                            <button
                                type="button"
                                onClick={sendOtp}
                                disabled={isSendingOtp}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 mb-5 flex items-center justify-center"
                            >
                                {isSendingOtp ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : 'Send Verification OTP'}
                            </button>
                        )}

                        {/* Password Fields - Show after verification */}
                        {isVerified && (
                            <>
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        onChange={handleChange}
                                        name="password"
                                        placeholder="At least 8 characters"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-white/80 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        onChange={handleChange}
                                        name="cpassword"
                                        placeholder="Confirm your password"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registering...
                                        </>
                                    ) : 'Complete Registration'}
                                </button>
                            </>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-white/70 text-sm">
                                Already have an account?{' '}
                                <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default SignUp;