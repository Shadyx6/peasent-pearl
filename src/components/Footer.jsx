import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-amber-50 border-t border-amber-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <img 
            src="./assets/image/logo1.png" 
            alt="Pleasant Pearl" 
            className="h-12 w-auto mb-4"
          />
          
          {/* Simple tagline */}
          <p className="text-amber-700 text-sm mb-6 max-w-md">
            Handcrafted jewelry blending tradition with contemporary design
          </p>
          
          {/* Social links */}
          <div className="flex space-x-4 mb-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <FaTiktok className="w-5 h-5" />
            </a>

             <a 
              href="https://api.whatsapp.com/send/?phone=923171731789&text&type=phone_number&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-amber-500">
            &copy; {new Date().getFullYear()} Pleasant Pearl. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;