// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiPlus, FiSearch, FiLoader, FiTrash2, FiEdit, FiMessageSquare } from 'react-icons/fi';

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const navigate = useNavigate();

  // Fetch bots from API
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/bots', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBots(response.data);
      } catch (error) {
        console.error('Error fetching bots:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBots();
  }, []);

  // Filter bots based on search term
  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bot.description && bot.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Create new bot
  const handleCreateBot = async () => {
    if (!newBotName.trim()) return;
    
    setIsCreating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/bots', {
        name: newBotName,
        description: "A new intelligent chatbot",
        config: { nodes: [], edges: [] }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBots([...bots, response.data]);
      setNewBotName('');
      navigate(`/builder/${response.data.id}`);
    } catch (error) {
      console.error('Error creating bot:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete bot
  const handleDeleteBot = async (botId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this bot?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBots(bots.filter(bot => bot.id !== botId));
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  // Edit bot
  const handleEditBot = (botId, e) => {
    e.stopPropagation();
    // For now, we'll navigate to settings, but could open modal
    navigate(`/settings?botId=${botId}`);
  };

  // Navigate to bot builder
  const goToBotBuilder = (botId) => {
    navigate(`/builder/${botId}`);
  };

  // Navigate to chat
  const goToChat = (botId, e) => {
    e.stopPropagation();
    navigate(`/chat/${botId}`);
  };

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Chatbot Dashboard</h1>
        <p className="text-gray-600">Create, manage, and test your intelligent chatbots</p>
      </motion.div>

      {/* Search and Create Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your bots..."
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex space-x-3">
            <input
              type="text"
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              placeholder="New bot name"
              className="input-field flex-grow"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateBot}
              disabled={isCreating || !newBotName.trim()}
              className="btn-primary flex items-center whitespace-nowrap"
            >
              {isCreating ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Create Bot
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bot Grid */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </motion.div>
      ) : filteredBots.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-12 text-center"
        >
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMessageSquare className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No bots found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No bots match your search. Try a different term.' : 'Create your first bot to get started!'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm('');
              document.querySelector('input[placeholder="New bot name"]')?.focus();
            }}
            className="btn-primary"
          >
            <FiPlus className="mr-2" />
            Create New Bot
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => goToBotBuilder(bot.id)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 truncate">{bot.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Created: {new Date(bot.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center">
                    <FiMessageSquare className="text-white text-xl" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                  {bot.description || "No description provided"}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleEditBot(bot.id, e)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                      title="Edit Bot"
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDeleteBot(bot.id, e)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600"
                      title="Delete Bot"
                    >
                      <FiTrash2 />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => goToChat(bot.id, e)}
                    className="flex items-center text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg"
                  >
                    <FiMessageSquare className="mr-1" />
                    Test Chat
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>ID: {bot.id}</span>
                <span>
                  Last updated: {bot.updated_at ? 
                    new Date(bot.updated_at).toLocaleDateString() : 
                    'Never'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
