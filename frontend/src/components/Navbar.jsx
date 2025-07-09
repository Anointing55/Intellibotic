// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiMessageSquare, FiSettings, FiCode, 
  FiPlus, FiHelpCircle, FiMenu, FiX, FiUser 
} from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/builder/1', label: 'Bot Builder', icon: <FaRobot /> },
    { path: '/chat/1', label: 'Chat Test', icon: <FiMessageSquare /> },
    { path: '/add-feature', label: 'Add Feature', icon: <FiPlus /> },
    { path: '/dev-mode', label: 'Developer Mode', icon: <FiCode /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings /> },
    { path: '/instructions', label: 'Instructions', icon: <FiHelpCircle /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex flex-col h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white w-64 fixed left-0 top-0">
        <div className="p-6">
          <div className="flex items-center mb-10">
            <div className="bg-white p-2 rounded-lg mr-3">
              <FaRobot className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-xl font-bold">Intellibotic</h1>
          </div>
          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-500 text-white shadow-inner'
                        : 'hover:bg-blue-500 hover:bg-opacity-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-auto p-6">
          {user && (
            <div className="flex items-center p-3 bg-blue-500 bg-opacity-30 rounded-lg">
              <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                <FiUser />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <button 
                  onClick={logout}
                  className="text-sm opacity-80 hover:opacity-100 mt-1"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white z-50">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <FaRobot className="text-white text-2xl mr-2" />
            <h1 className="text-lg font-bold">Intellibotic</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-700"
          >
            <nav>
              <ul>
                {navItems.map((item) => (
                  <li key={item.path} className="border-b border-blue-600">
                    <Link
                      to={item.path}
                      className={`flex items-center p-4 ${
                        isActive(item.path) ? 'bg-blue-500' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
                {user && (
                  <li className="border-b border-blue-600">
                    <button
                      onClick={logout}
                      className="flex items-center p-4 w-full"
                    >
                      <FiUser className="mr-3" />
                      Logout ({user.name})
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Navbar;
