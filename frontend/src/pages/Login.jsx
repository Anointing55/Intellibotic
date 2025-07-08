// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });
      
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
            >
              <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center">
                <FiLogIn className="text-white text-3xl" />
              </div>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-bold text-white"
            >
              Welcome to Intellibotic
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/90 mt-2"
            >
              Sign in to your account
            </motion.p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-6"
              >
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </motion.div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <FiLogIn className="mr-2" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center text-sm text-gray-600"
            >
              <p>Hardcoded credentials:</p>
              <p className="font-mono mt-1 bg-gray-100 p-2 rounded-md">
                Username: <span className="text-primary">Anointing Omowumi</span><br />
                Password: <span className="text-secondary">Ayobami55</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
