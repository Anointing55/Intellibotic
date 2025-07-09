// frontend/src/pages/Settings.jsx
import { AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiSave, FiArrowLeft, FiImage, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [botId, setBotId] = useState(null);
  const [bot, setBot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: '',
    greetingMessage: '',
    themeColor: '#6366f1',
  });

  // Extract botId from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('botId');
    if (id) {
      setBotId(id);
    }
  }, [location]);

  // Fetch bot data
  useEffect(() => {
    if (!botId) return;
    
    const fetchBot = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/bots/${botId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBot(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description || '',
          avatar: response.data.config?.avatar || '',
          greetingMessage: response.data.config?.greetingMessage || 'Hello! How can I help you today?',
          themeColor: response.data.config?.themeColor || '#6366f1',
        });
      } catch (error) {
        console.error('Error fetching bot:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBot();
  }, [botId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle color change
  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, themeColor: color }));
  };

  // Save settings
  const handleSave = async () => {
    if (!botId) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bots/${botId}`, {
        name: formData.name,
        description: formData.description,
        config: {
          ...(bot?.config || {}),
          avatar: formData.avatar,
          greetingMessage: formData.greetingMessage,
          themeColor: formData.themeColor
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving bot settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete bot
  const handleDelete = async () => {
    if (!botId) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  // Color options
  const colorOptions = [
    { name: 'Primary', value: '#6366f1' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </motion.button>
          
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Bot Settings
          </h1>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-start">
          {formData.avatar ? (
            <img 
              src={formData.avatar} 
              alt={formData.name} 
              className="w-20 h-20 rounded-xl object-cover mr-6 border-2 border-gray-200"
            />
          ) : (
            <div className="bg-gradient-to-r from-primary to-secondary w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-6">
              {formData.name.charAt(0)}
            </div>
          )}
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
            <p className="text-gray-600">
              {formData.description || "No description provided"}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              ID: {botId} • Created: {new Date(bot.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
              <FiCheck className="mr-2 text-xl" />
              Settings saved successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3">Delete Bot</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{formData.name}</span>? 
                This action cannot be undone and all bot data will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete Permanently
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Basic Settings
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter bot name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Describe your bot"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="input-field flex-grow"
                  placeholder="https://example.com/avatar.jpg"
                />
                <div className="ml-3 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FiImage className="text-gray-500" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Greeting Message
              </label>
              <textarea
                name="greetingMessage"
                value={formData.greetingMessage}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter greeting message"
                rows={3}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Theme Color */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Theme & Appearance
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-4">
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div 
                    className="w-full h-full" 
                    style={{ backgroundColor: formData.themeColor }}
                  />
                </div>
                <input
                  type="text"
                  value={formData.themeColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="input-field w-32"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Presets
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((color) => (
                  <motion.div
                    key={color.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorChange(color.value)}
                    className={`h-10 rounded-lg cursor-pointer flex items-center justify-center ${
                      formData.themeColor === color.value 
                        ? 'ring-2 ring-offset-2 ring-gray-800' 
                        : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {formData.themeColor === color.value && (
                      <FiCheck className="text-white" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Chat Preview
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-end">
                <div 
                  className="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm"
                  style={{ 
                    backgroundColor: formData.themeColor,
                    color: 'white',
                    borderBottomRightRadius: '4px'
                  }}
                >
                  <p>{formData.greetingMessage || 'Hello! How can I help you today?'}</p>
                  <div className="text-xs mt-1 opacity-70">
                    10:00 AM
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-medium text-gray-700">U</span>
                  </div>
                </div>
                <div className="max-w-[80%]">
                  <div className="rounded-2xl px-4 py-3 shadow-sm bg-white border border-gray-200 rounded-tl-none">
                    <p>Can you help me with something?</p>
                    <div className="text-xs mt-1 text-gray-500">
                      10:01 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-red-800 mb-4">
              Danger Zone
            </h3>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h4 className="font-medium text-red-700">Delete this bot</h4>
                <p className="text-red-600 text-sm mt-1">
                  Once deleted, this bot cannot be recovered. All data will be permanently removed.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-4 md:mt-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center"
              >
                <FiTrash2 className="mr-2" />
                Delete Bot
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="fixed bottom-6 right-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center shadow-lg"
        >
          {isSaving ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <FiSave className="mr-2" />
              Save Settings
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;
