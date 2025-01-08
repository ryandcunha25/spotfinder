import React from "react";
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <>
            {/* HEADER */}
            <header className="py-4 shadow-sm bg-white">
                <div className="container flex items-center justify-evenly relative">
                    {/* Logo */}
                    <Link to="#">
                        <img src="" alt="logo" className="w-32" />
                    </Link>

                    {/* Searchbar */}
                    <div className="w-full max-w-xl relative flex">
                        <span className="absolute left-4 top-3 text-lg text-gray-400">
                            <i className="fa fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
                            placeholder="Search"
                        />
                        <button className="bg-red-500 border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition">
                            Search
                        </button>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="text-center text-gray-700 hover:text-primary transition relative"
                        >
                            <div className="text-2xl">
                                <i className="fa fa-heart"></i>
                            </div>
                            <div className="text-xs leading-3">Favourites</div>
                        </Link>

                        {/* Cart */}
                        <Link
                            to="cart.html"
                            className="text-center text-gray-700 hover:text-primary transition relative"
                        >
                            <div className="text-2xl">
                                <i className="fa fa-shopping-bag"></i>
                            </div>
                            <div className="text-xs leading-3">Bookings</div>
                        </Link>

                        {/* Account */}
                        <Link
                            to="/profile"
                            className="text-center text-gray-700 hover:text-primary transition relative"
                        >
                            <div className="text-2xl">
                                <i className="fa fa-user"></i>
                            </div>
                            <div className="text-xs leading-3">Account</div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* NAVIGATION BAR */}
            <nav className="bg-gray-800">
                <div className="container flex">
                    <div className="px-8 py-4 bg-primary flex items-center cursor-pointer">
                        <span className="text-white">
                            <i className="fa fa-bars"></i>
                        </span>
                        <span className="capitalize ml-2 text-white">All Categories</span>
                    </div>

                    {/* Links for Navbar */}
                    <div className="flex items-center justify-between flex-grow pl-12">
                        <div className="flex items-center space-x-6 capitalize">
                            <Link
                                to="/homepage"
                                className="text-gray-200 hover:text-white transition"
                            >
                                Home
                            </Link>
                            <Link
                                to="/spots"
                                className="text-gray-200 hover:text-white transition"
                            >
                                Spots
                            </Link>
                            <Link
                                to="#"
                                className="text-gray-200 hover:text-white transition"
                            >
                                About
                            </Link>
                            <Link
                                to="#"
                                className="text-gray-200 hover:text-white transition"
                            >
                                Contact Us
                            </Link>
                        </div>
                        <Link
                            to="login.html"
                            className="text-gray-200 hover:text-white transition"
                        >
                            Login/Register
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
