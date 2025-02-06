import React, { useState } from 'react';
import loginBg1 from './Assets/login_bg.jpg';
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from 'axios';

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
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
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
                setIsOtpSent(false); // Hide OTP input field
                alert('OTP verified successfully');
                navigate('/homepage');
            } else {
                alert('Invalid OTP');
            }
        } catch (err) {
            alert('Error verifying OTP: ' + err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password length validation
        if (formData.password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        try {
            await axios.post('http://localhost:5000/authentication/signup', formData);
            alert('User registered successfully');
        } catch (err) {
            alert('Error registering user: ' + err);
        }
    };

    return (
        <div className="w-full bg-cover bg-blend-darken min-h-screen" style={{ backgroundImage: `url(${loginBg1})` }}>
            <section className="flex justify-center items-center min-h-screen w-full bg-center bg-cover">
                <div className="relative w-[500px] bg-transparent border-2 border-white/50 rounded-2xl backdrop-blur-lg p-6">
                    <form className="w-full" onSubmit={handleSubmit}>
                        <h2 className="text-2xl text-black text-center font-bold mb-6">Sign Up</h2>

                        {/* Row 1: First Name and Last Name */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm text-black block mb-2">First Name</label>
                                <input type="text" required onChange={handleChange} name="first_name" placeholder="Enter first name" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-gray-100 text-black text-lg px-2 focus:ring-0 peer" />
                            </div>
                            <div>
                                <label className="text-sm text-black block mb-2">Last Name</label>
                                <input type="text" required onChange={handleChange} name="last_name" placeholder="Enter last name" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-gray-100 text-black text-lg px-2 focus:ring-0 peer" />
                            </div>
                        </div>

                        {/* Row 2: Email and Phone Number */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm text-black block mb-2">Email</label>
                                <input type="email" required onChange={handleChange} name="email" placeholder="Enter email" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-white text-black text-lg px-2 placeholder-gray-100 focus:ring-0 peer" />
                            </div>
                            <div>
                                <label className="text-sm text-black block mb-2">Phone Number</label>
                                <input type="number" required onChange={handleChange} name="phone" placeholder="Enter phone number" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-white text-black text-lg px-2 focus:ring-0 peer" />
                            </div>
                        </div>

                        {/* OTP Section */}
                        {!isVerified && isOtpSent ? (
                            <div className="mb-4">
                                <label className="text-sm text-black block mb-2">Enter OTP</label>
                                <input type="text" required onChange={(e) => setOtp(e.target.value)} name="otp" placeholder="Enter OTP" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 placeholder-white outline-none text-black text-lg px-2 focus:ring-0 peer" />
                                <button type="button" onClick={verifyOtp} className="w-full h-10 rounded-full bg-blue-500 text-white font-semibold text-lg hover:bg-blue-700 mt-2">Verify OTP</button>
                            </div>
                        ) : (
                            !isVerified && (
                                <button type="button" onClick={sendOtp} className="w-full h-10 rounded-full bg-blue-500 text-white font-semibold text-lg hover:bg-blue-700 mb-4">Send OTP</button>
                            )
                        )}

                        {/* Password and Confirm Password Fields (Visible only after OTP verification) */}
                        {isVerified && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-sm text-black block mb-2">Password</label>
                                    <input type="password" required onChange={handleChange} name="password" placeholder="Enter password" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-white text-black text-lg px-2 focus:ring-0 peer" />
                                </div>
                                <div>
                                    <label className="text-sm text-black block mb-2">Confirm Password</label>
                                    <input type="password" required onChange={handleChange} name="cpassword" placeholder="Confirm password" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-white text-black text-lg px-2 focus:ring-0 peer" />
                                </div>
                            </div>
                        )}

                        {isVerified && (
                            <div className="text-center">
                                <button type="submit" className="w-full h-10 rounded-full bg-white text-gray-800 font-semibold text-lg hover:bg-gray-200 px-6">Sign Up</button>
                            </div>
                        )}

                        <div className="text-center text-white text-md mt-6">
                            <p>Already have an account? <Link to="/" className="font-semibold hover:underline">Login</Link></p>
                            <p>Are you a venue owner? <Link to="/venueownersregistration" className="font-semibold hover:underline">Sign up as one!</Link></p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default SignUp;
