// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiMessageSquare, FiSettings, FiCode, FiPlusCircle, FiBookOpen, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiMessageSquare /> },
    { path: '/add-feature', label: 'Add Feature', icon: <FiPlusCircle /> },
    { path: '/dev-mode', label: 'Developer Mode', icon: <FiCode /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings /> },
    { path: '/instructions', label: 'Instructions', icon: <FiBookOpen /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg p-1 mr-3"
              >
                <div className="bg-gradient-to-r from-primary to-secondary w-8 h-8 rounded-md" />
              </motion.div>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold tracking-tight"
              >
                Intellibotic
              </motion.span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all ${
                    location.pathname === link.path
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </motion.span>
                </Link>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white flex items-center"
              >
                <FiLogOut className="mr-2" />
                Logout
              </motion.button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === link.path
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/20'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <button className="w-full mt-4 px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600 text-white flex items-center justify-center">
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
