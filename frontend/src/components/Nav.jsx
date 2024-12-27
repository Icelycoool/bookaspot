import React, { useState } from "react";
import logo from "../assets/logo.svg";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-offwhite shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img className="w-10 h-10" src={logo} alt="Bookaspot logo" />
          <a className="text-primary text-2xl font-bold" href="#">Bookaspot</a>
        </div>

        {/* Links (Desktop View) */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <a href="#discover" className="hover:text-secondary">About</a>
          <a href="#discover" className="hover:text-secondary">Saved Amenities</a>
          <a href="#discover" className="hover:text-secondary">Discover</a>
        </div>
        <div className="hidden md:flex space-x-4">
          <button className="px-6 py-2 bg-secondary text-offwhite rounded-full shadow-sm hover:bg-secondaryHover focus:ring-2 focus:ring-secondaryHover-500">Sign Up</button>
          <button className="px-6 py-2 border bg-primary text-offwhite rounded-full shadow-sm hover:bg-primaryHover focus:ring-2 focus:ring-primaryHover-500">Login</button>
        </div>

        {/* Hamburger Menu (Mobile View) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-offwhite-500 shadow-md">
          <a href="#discover" className="block px-4 py-2 hover:bg-secondary" onClick={toggleMenu}> Discover</a>
          <a href="#signup" className="block px-4 py-2 hover:bg-secondary" onClick={toggleMenu}>Sign Up</a>
          <a href="#login" className="block px-4 py-2 hover:bg-secondary" onClick={toggleMenu}>Login</a>
        </div>
      )}
    </nav>
  );
};

export default Nav;
