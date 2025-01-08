import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import  placeholderProfile from "/placeholderProfile.png";

const Nav = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profile = localStorage.getItem("profile");

    if (token && profile) {
      setIsLoggedIn(true);
      setUserProfile(profile);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profile");
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate("/login");
  };

  return (
    <nav className="bg-offwhite shadow-md fixed top-0 w-full z-40">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img className="w-10 h-10" src={logo} alt="Bookaspot logo" />
          <Link className="text-primary text-2xl font-bold" to="/">Bookaspot</Link>
        </div>

        <div className="hidden md:flex space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/signup">
                <button className="px-6 py-2 bg-secondary text-offwhite rounded-full shadow-sm hover:bg-secondaryHover focus:ring-2 focus:ring-secondaryHover-500">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="px-6 py-2 border bg-primary text-offwhite rounded-full shadow-sm hover:bg-primaryHover focus:ring-2 focus:ring-primaryHover-500">Login</button>
              </Link>
            </>
          ) : (
            <>
                <div className="flex items-center space-x-4">
                <Link to="/profile">
                  {userProfile && userProfile !== "null" ? (
                    <img
                      src={`${apiUrl}/api/profile_images/${userProfile}`}
                      alt="User Profile"
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <img src={placeholderProfile} className="w-12 h-12 rounded-full"/>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-secondary text-offwhite rounded-full shadow-sm hover:bg-secondaryHover focus:ring-2 focus:ring-secondaryHover-500"
                >
                  Logout
                </button>
              </div>
            </>
          )}
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
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="block px-4 py-2 hover:bg-secondary" onClick={toggleMenu}>Sign Up</Link>
              <Link to="/login" className="block px-4 py-2 hover:bg-secondary" onClick={toggleMenu}>Login</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="px-4 py-2 block text-center text-primary hover:text-primaryHover hover:underline"> Profile </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 bg-secondary text-offwhite rounded-full hover:bg-secondaryHover"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
