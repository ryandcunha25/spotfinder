import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loginBg1 from './Assets/login_bg.jpg';
import { Link, useNavigate } from "react-router-dom";
import { message, Modal, Input, Spin } from 'antd';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const backendurl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    // Check for remembered email on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${backendurl}/authentication/login`, formData);
            const { token, userdetails } = response.data;

            // Store credentials based on remember me choice
            if (rememberMe) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userdetails.id);
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userId', userdetails.id);
                localStorage.removeItem('rememberedEmail');
            }

            message.success('Login successful! Redirecting...');
            navigate('/homepage');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Incorrect credentials! Please try again.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setForgotPasswordModalVisible(true);
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            message.error('Please enter your email address');
            return;
        }

        setForgotPasswordLoading(true);
        try {
            await axios.post(`${backendurl}/authentication/forgot-password`, {
                email: resetEmail
            });
            message.success('Password reset link sent to your email!');
            setForgotPasswordModalVisible(false);
            setResetEmail('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send reset link';
            message.error(errorMessage);
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-900">
            {/* Darkened background image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={loginBg1}
                    className="w-full h-full object-cover opacity-25"
                    alt="Venue background"
                />
            </div>

            <section className="relative z-10 flex justify-center items-center min-h-screen px-4">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-white/80 mt-2">Login to your venue booking account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                    name="email"
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                                />
                                <svg className="absolute left-3 top-3.5 h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                                />
                                <svg className="absolute left-3 top-3.5 h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMe}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/10"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="font-medium text-blue-400 hover:text-blue-300"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                disabled={loading}
                            >
                                {loading ? <Spin size="small" /> : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-white/70">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-medium text-blue-400 hover:text-blue-300"
                            >
                                Register here
                            </Link>
                        </p>
                        <p className="text-white/70 text-sm">
                            Wanna sign in as an owner?{' '}
                            <Link to="/venueownerslogin" className="text-blue-400 hover:text-blue-300 font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* Forgot Password Modal */}
            <Modal
                title="Reset Password"
                visible={forgotPasswordModalVisible}
                onOk={handleResetPassword}
                onCancel={() => setForgotPasswordModalVisible(false)}
                confirmLoading={forgotPasswordLoading}
                okText="Send Reset Link"
                cancelText="Cancel"
            >
                <p className="mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                <Input
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full"
                />
            </Modal>
        </div>
    );
};

export default LoginPage;