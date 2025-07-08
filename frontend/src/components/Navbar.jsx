import ReactFlow from '@reactflow/core';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiLogOut, FiPlus, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('intellibotic_token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Intellibotic</h1>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => navigate('/dashboard')}
            >
              <FiPlus className="mr-2" /> New Bot
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={() => navigate('/settings')}
              >
                <FiSettings />
              </motion.button>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <FiUser />
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={handleLogout}
              >
                <FiLogOut />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
