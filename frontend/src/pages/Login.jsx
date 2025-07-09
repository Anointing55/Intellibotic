// src/pages/Login.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validCredentials = [
    { username: 'Anointing Omowumi', password: 'Intellibotic123' },
    { username: 'Ayobami55', password: 'Intellibotic123' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const isValid = validCredentials.some(
        cred => 
          cred.username === credentials.username && 
          cred.password === credentials.password
      );

      if (isValid) {
        // Store token in localStorage
        localStorage.setItem('authToken', 'dummy-auth-token-123456');
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-10"
        >
          <motion.h1 
            className="text-4xl font-bold text-blue-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Intellibotic
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Advanced Visual Chatbot Builder
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Welcome Back
            </motion.h2>

            <form onSubmit={handleLogin}>
              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-5"
              >
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
                  >
                    <FiAlertCircle className="mr-2" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center ${
                  isLoading ? 'cursor-not-allowed' : ''
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <motion.div 
            className="bg-gray-50 px-8 py-4 text-center text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © {new Date().getFullYear()} Intellibotic. All rights reserved.
          </motion.div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center text-gray-600 text-sm"
        >
          <p>Demo credentials:</p>
          <p className="mt-1">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Anointing Omowumi</span> or 
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-1">Ayobami55</span>
            <span className="mx-2">•</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Intellibotic123</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
