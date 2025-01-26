import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-lg flex justify-between items-center">
      <i className="bx bx-menu text-gray-600 text-2xl"></i>
      {/* <a href="#" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
        Categories
      </a> */}
      <form action="#" className="flex items-center space-x-2">
        <input
          type="search"
          placeholder="Search..."
          className="p-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="search-btn p-2 text-blue-500 rounded-lg">
          <i className="bx bx-search text-lg"></i>
        </button>
      </form>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="switch-mode" hidden />
        <label htmlFor="switch-mode" className="switch-mode cursor-pointer">
          <span className="block w-10 h-6 bg-gray-300 rounded-full"></span>
        </label>
        <a href="#" className="relative">
          <i className="bx bxs-bell text-2xl text-gray-600"></i>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            8
          </span>
        </a>
        <a href="#" className="profile">
          <img src="img/people.png" alt="Profile" className="w-8 h-8 rounded-full border-2 border-gray-300" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
