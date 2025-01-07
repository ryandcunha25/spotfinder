import React, { useState } from 'react';
import axios from 'axios';
import loginBg1 from './Assets/login_bg.jpg';
import loginBg2 from './Assets/login_bg2.jpg';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useNavigate,
    useParams
} from "react-router-dom";


const LoginPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const fetchUserDetails = async () => {
    //       const token = localStorage.getItem('authToken');

    //       if (!token) return;

    //       try {
    //         const response = await axios.get('http://localhost:3000/authentication/user-details', {
    //           headers: {
    //             Authorization: token,
    //           },
    //         });
    //         setUser(response.data);
    //       } catch (error) {
    //         console.error('Error fetching user details:', error);
    //       }
    //     };

    //     fetchUserDetails();
    //   }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/authentication/login', formData);
            const token = response.data.token;
            localStorage.setItem('token', token);
            console.log('User:', response.data);
            setUser(user); // Store user details
            alert('User Logged in Successfully!');
            navigate('/homepage')
        } catch (err) {
            alert('Error logging in');
        }
    };
    return (
        <div className="w-full bg-cover bg-blend-darken" style={{ backgroundImage: `url(${loginBg1})`, }}>
            <section className="flex justify-center items-center min-h-screen w-full bg-center bg-cover"  >
                <div className="relative filter-none z-10 backdrop-blur-lg w-[400px] h-[450px] bg-transparent border-2 border-white/50 rounded-2xl backdrop-blur-lg flex justify-center items-center">
                    <div className="w-full">
                        <form action="" className="w-full" onSubmit={handleSubmit}>
                            <h2 className="text-2xl text-black text-center font-bold mb-4">Login</h2>
                            <div className="relative w-[310px] border-b-2 border-white mx-auto mb-8">
                                <label className="text-sm text-black block mb-2">Email</label>
                                <input type="email" required onChange={handleChange} name="email" placeholder="Enter email" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-gray-100 text-black text-lg px-2 placeholder-blue-300 focus:ring-0 peer" />
                                <ion-icon name="mail-outline" className="absolute right-2 top-[20px] text-black text-lg"></ion-icon>
                            </div>
                            <div className="relative w-[310px] border-b-2 border-white mx-auto mb-8">
                                <label className="text-sm text-black block mb-2">Password</label>
                                <input type="password" required onChange={handleChange} name="password" placeholder="Enter password" className="w-full h-[50px] bg-transparent border-b-2 border-gray-200 outline-none placeholder-gray-100 text-black text-lg px-2 focus:ring-0 peer" />
                                <ion-icon name="lock-closed-outline" className="absolute right-2 top-[20px] text-black text-lg"></ion-icon>
                            </div>
                            <div className="flex justify-between text-black text-sm mb-4 px-[5px] pl-5">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />Remember Me
                                </label>
                                <a href="#" className="hover:underline pr-5">Forget Password</a>
                            </div>
                            <button className="w-full h-10 rounded-full bg-white text-gray-800 font-semibold text-lg hover:bg-gray-200 px-6" >Log in</button>
                            <div className="text-center text-white text-sm mt-6">
                                <p>Don't have an account?
                                    <Link to="/signup" className="font-semibold hover:underline">Register</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
            <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>

        </div>
    )
}

export default LoginPage
