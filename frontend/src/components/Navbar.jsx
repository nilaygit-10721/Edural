// src/components/Navbar.jsx
import React from "react";
import hat from "../assets/navbar-hat.png";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img src={hat} alt="Edural" className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl text-gray-800">Edural</span>
          </div>

          {/* Navigation Links + Signup Button */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
            <a href="#home" className="hover:text-green-600">
              Home
            </a>
            <a href="#about" className="hover:text-green-600">
              About
            </a>
            <a href="#labs" className="hover:text-green-600">
              Labs
            </a>
            <a href="#games" className="hover:text-green-600">
              Games
            </a>
            <a href="#login" className="hover:text-green-600">
              Login
            </a>
            {/* Signup button now inside this container */}
            <a
              href="#signup"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Signup
            </a>
          </div>

          {/* Mobile menu button (optional) */}
          <div className="md:hidden">
            <a
              href="#signup"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Signup
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
