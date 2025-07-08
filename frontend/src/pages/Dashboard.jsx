// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiSettings, FiLogOut, FiDownload, FiUpload, FiEdit, FiTrash2, FiPlay } from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  // Mock bot data (in a real app, this would come from an API)
  useEffect(() => {
    const fetchBots = () => {
      setTimeout(() => {
        const mockBots = [
          { id: '1', name: 'Customer Support Bot', description: 'Handles common customer inquiries', lastEdited: '2025-07-05', nodeCount: 12 },
          { id: '2', name: 'Lead Generation Bot', description: 'Qualifies leads and schedules meetings', lastEdited: '2025-07-02', nodeCount: 18 },
          { id: '3', name: 'E-commerce Assistant', description: 'Helps users find products and place orders', lastEdited: '2025-06-28', nodeCount: 25 },
          { id: '4', name: 'HR Onboarding Bot', description: 'Guides new hires through onboarding process', lastEdited: '2025-06-20', nodeCount: 15 },
          { id: '5', name: 'Technical Support Bot', description: 'Troubleshoots technical issues', lastEdited: '2025-06-15', nodeCount: 22 },
          { id: '6', name: 'Restaurant Booking Bot', description: 'Reserves tables and takes special requests', lastEdited: '2025-06-10', nodeCount: 14 },
        ];
        setBots(mockBots);
        setLoading(false);
      }, 800);
    };

    fetchBots();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('intellibotic_token');
    navigate('/login');
  };

  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
      setShowImportModal(true);
    }
  };

  const confirmImport = () => {
    // In a real app, this would upload to /api/import-bot
    alert(`Importing bot from: ${importFile.name}`);
    setShowImportModal(false);
    setImportFile(null);
  };

  const createNewBot = () => {
    navigate('/builder/new');
  };

  const openBotBuilder = (id) => {
    navigate(`/builder/${id}`);
  };

  const deleteBot = (id, e) => {
    e.stopPropagation();
    setBots(prev => prev.filter(bot => bot.id !== id));
  };

  const testBot = (id, e) => {
    e.stopPropagation();
    navigate(`/chat/${id}`);
  };

  const editBot = (id, e) => {
    e.stopPropagation();
    navigate(`/settings/${id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50"
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Intellibotic</h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-indigo-100 text-indigo-700 rounded-full p-2 hover:bg-indigo-200 transition-colors"
                onClick={() => setShowImportModal(true)}
              >
                <FiUpload size={18} />
              </motion.button>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={() => navigate('/settings')}
              >
                <FiSettings className="mr-2" /> Settings
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 flex items-center"
                onClick={handleLogout}
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Chatbots</h2>
            <p className="text-gray-600 mt-2">Create, manage, and deploy intelligent chatbots</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-3 flex items-center"
            onClick={createNewBot}
          >
            <FiPlus className="mr-2" /> Create New Bot
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-t-2 border-indigo-600 border-r-2 border-b-2 border-gray-200 rounded-full"
            />
          </div>
        ) : filteredBots.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bots found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or create a new bot</p>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2"
              onClick={createNewBot}
            >
              Create New Bot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.map((bot, index) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                onClick={() => openBotBuilder(bot.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-block mb-2">
                        {bot.nodeCount} nodes
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{bot.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{bot.description}</p>
                    </div>
                    <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <div className="bg-indigo-500 w-8 h-8 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Edited {bot.lastEdited}</span>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        onClick={(e) => testBot(bot.id, e)}
                      >
                        <FiPlay />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        onClick={(e) => editBot(bot.id, e)}
                      >
                        <FiEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={(e) => deleteBot(bot.id, e)}
                      >
                        <FiTrash2 />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Bot ID: {bot.id}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Exporting bot: ${bot.name}`);
                    }}
                  >
                    <FiDownload className="mr-1" /> Export
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImportModal(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Import Bot</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowImportModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              {importFile ? (
                <div className="flex items-center justify-center text-indigo-600">
                  <FiDownload className="mr-2" size={24} />
                  <p className="font-medium truncate">{importFile.name}</p>
                </div>
              ) : (
                <>
                  <FiUpload className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600 mb-2">Drag & drop your bot JSON file here</p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <label className="bg-indigo-600 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-indigo-700">
                    Browse Files
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".json"
                      onChange={handleImport}
                    />
                  </label>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${!importFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!importFile}
                onClick={confirmImport}
              >
                Import Bot
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">© 2025 Intellibotic. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Documentation</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Support</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Dashboard;
