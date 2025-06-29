import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { CiShoppingCart } from 'react-icons/ci';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems] = useState(3); // Replace with actual cart state

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collection' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile menu button and logo */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#D87D8F] focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Logo - centered on mobile */}
          <div className="flex-shrink-0 flex items-center md:flex-shrink-0 md:flex-grow-0">
            <NavLink to="/" className="mx-auto md:mx-0">
              <img 
                src="./assets/image/logo1.png" 
                alt="logo" 
                className="h-15 w-auto md:h-18 lg:h-20" 
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-grow md:space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium flex flex-col items-center
                  ${isActive ? 'text-[#D87D8F]' : 'text-gray-700 hover:text-[#D87D8F]'}`
                }
              >
                <span>{link.name}</span>
                <span className={`mt-1 h-0.5 w-5 ${({ isActive }) => isActive ? 'bg-[#D87D8F]' : 'bg-transparent'}`}></span>
              </NavLink>
            ))}
          </div>

          {/* Cart - right side */}
          <div className="flex items-center">
            <NavLink 
              to="/cart" 
              className="group relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <CiShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-[#D87D8F] transition-colors duration-200" />
              {cartItems > 0 && (
                <span style={{ backgroundColor: "#D87D8F" }} className="absolute -top-0 -right-0 flex items-center justify-center w-5 h-5 text-black text-xs font-bold rounded-full shadow-sm z-10">
  {cartItems}
</span>

              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium
                ${isActive ? 'bg-[#D87D8F]/10 text-[#D87D8F]' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Cart
            {cartItems > 0 && (
              <span className="bg-[#D87D8F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;