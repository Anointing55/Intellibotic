// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiChevronRight, FiEdit, FiTrash2, FiMoreVertical, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [bots, setBots] = useState([]);
  
  // Mock bot data - in a real app, this would come from an API
  const mockBots = [
    {
      id: 1,
      name: "Customer Support Bot",
      description: "Handles customer inquiries and support tickets",
      lastModified: "2025-07-05",
      status: "active",
      conversations: 142
    },
    {
      id: 2,
      name: "Sales Assistant",
      description: "Guides users through product selection and purchase",
      lastModified: "2025-07-01",
      status: "active",
      conversations: 89
    },
    {
      id: 3,
      name: "HR Onboarding",
      description: "Helps new employees with onboarding process",
      lastModified: "2025-06-28",
      status: "draft",
      conversations: 32
    },
    {
      id: 4,
      name: "IT Helpdesk",
      description: "Resolves common IT issues and tickets",
      lastModified: "2025-06-20",
      status: "active",
      conversations: 210
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setBots(mockBots);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateNewBot = () => {
    // In a real app, this would create a new bot in the backend
    navigate('/builder/new');
  };

  const handleBotClick = (botId) => {
    navigate(`/builder/${botId}`);
  };

  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-900"
              >
                My Chatbots
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-gray-600"
              >
                Create, manage, and deploy your intelligent chatbots
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 md:mt-0"
            >
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search chatbots..."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-64"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6 mb-8"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Create New Bot Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                custom={0}
                onClick={handleCreateNewBot}
                className="cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl p-6 h-64 flex flex-col items-center justify-center transition-all duration-300 group-hover:border-blue-400">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <motion.div
                      whileHover={{ rotate: 180, scale: 1.1 }}
                      className="text-blue-600"
                    >
                      <FiPlus size={32} />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Create New Bot</h3>
                  <p className="text-center text-blue-500 text-sm">Start building your intelligent chatbot</p>
                </div>
              </motion.div>

              {/* Bot Cards */}
              <AnimatePresence>
                {filteredBots.map((bot, index) => (
                  <motion.div
                    key={bot.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    custom={index + 1}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="cursor-pointer"
                    onClick={() => handleBotClick(bot.id)}
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-64 flex flex-col justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{bot.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bot.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bot.status === 'active' ? 'Active' : 'Draft'}
                            </span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle menu click
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiMoreVertical />
                          </button>
                        </div>
                        <p className="mt-3 text-gray-600 text-sm line-clamp-3">{bot.description}</p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiActivity className="mr-1" />
                            <span>{bot.conversations} conversations</span>
                          </div>
                          <span>Modified: {bot.lastModified}</span>
                        </div>
                        
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBotClick(bot.id);
                          }}
                          className="mt-4 w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <span>Edit Bot</span>
                          <FiChevronRight />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredBots.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  <FiSearch className="text-blue-500" size={48} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No bots found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find any chatbots matching "{searchQuery}". Try a different search term or create a new bot.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateNewBot}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" />
                  Create New Bot
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
      
      {/* Stats Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white border-t border-gray-200 py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-medium text-gray-900">Total Bots</h4>
              <p className="text-2xl font-bold text-blue-600">{bots.length}</p>
            </div>
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-medium text-gray-900">Active Bots</h4>
              <p className="text-2xl font-bold text-green-600">
                {bots.filter(bot => bot.status === 'active').length}
              </p>
            </div>
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-medium text-gray-900">Total Conversations</h4>
              <p className="text-2xl font-bold text-indigo-600">
                {bots.reduce((sum, bot) => sum + bot.conversations, 0)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">In Draft</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {bots.filter(bot => bot.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
