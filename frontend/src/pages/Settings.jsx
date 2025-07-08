// frontend/src/pages/Settings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiTrash2, FiUpload, FiDownload, FiMessageSquare, FiUser, FiBell, FiLock, FiGlobe } from 'react-icons/fi';

const Settings = () => {
  const [botName, setBotName] = useState('Customer Support Bot');
  const [botDescription, setBotDescription] = useState('Handles common customer inquiries');
  const [botAvatar, setBotAvatar] = useState('IB');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      alert('Bot deleted successfully');
      window.location.href = '/dashboard';
    }
  };

  const colorOptions = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Amber', value: '#f59e0b' },
  ];

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
            <div className="flex items-center">
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Intellibotic</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 flex items-center"
                onClick={handleSave}
                disabled={isSaving}
              >
                <FiSave className={`mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bot Settings</h2>
              
              <nav className="space-y-1">
                {[
                  { id: 'general', icon: FiMessageSquare, label: 'General' },
                  { id: 'appearance', icon: FiUser, label: 'Appearance' },
                  { id: 'behavior', icon: FiBell, label: 'Behavior' },
                  { id: 'security', icon: FiLock, label: 'Security' },
                  { id: 'integrations', icon: FiGlobe, label: 'Integrations' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 5 }}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                      activeTab === tab.id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="mr-3 text-lg" />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
              
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</h3>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <FiDownload className="mr-3 text-lg" />
                    Export Bot
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <FiUpload className="mr-3 text-lg" />
                    Import Bot
                  </motion.button>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="mr-2" />
                  Delete Bot
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Main Settings Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Tab Content */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
                      <input
                        type="text"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bot Description</label>
                      <textarea
                        value={botDescription}
                        onChange={(e) => setBotDescription(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bot Avatar</label>
                      <div className="flex items-center">
                        <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                          {botAvatar}
                        </div>
                        <input
                          type="text"
                          value={botAvatar}
                          onChange={(e) => setBotAvatar(e.target.value.slice(0, 2))}
                          className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                        />
                        <span className="ml-2 text-sm text-gray-500">(2 characters max)</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Welcome Message</label>
                      <input
                        type="text"
                        defaultValue="Hello! How can I assist you today?"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {colorOptions.map((color) => (
                          <motion.button
                            key={color.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full ${primaryColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setPrimaryColor(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chat Window Theme</label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="theme-light"
                              name="theme"
                              defaultChecked
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="theme-light" className="ml-3 block text-sm text-gray-700">
                              Light Theme
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="theme-dark"
                              name="theme"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="theme-dark" className="ml-3 block text-sm text-gray-700">
                              Dark Theme
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="theme-auto"
                              name="theme"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="theme-auto" className="ml-3 block text-sm text-gray-700">
                              Auto (System Preference)
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message Density</label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="density-comfortable"
                              name="density"
                              defaultChecked
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="density-comfortable" className="ml-3 block text-sm text-gray-700">
                              Comfortable (Default)
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="density-compact"
                              name="density"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="density-compact" className="ml-3 block text-sm text-gray-700">
                              Compact
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
                      <textarea
                        rows={4}
                        defaultValue="/* Add custom CSS here */"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'behavior' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Behavior Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Response Speed</label>
                      <input
                        type="range"
                        min="100"
                        max="3000"
                        step="100"
                        defaultValue="1500"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Instant</span>
                        <span>Standard (1.5s)</span>
                        <span>Deliberate (3s)</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Typing Indicator</label>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="typing-indicator"
                            defaultChecked
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <label htmlFor="typing-indicator" className="ml-3 block text-sm text-gray-700">
                            Show typing indicator
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Response Style</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option>Concise and direct</option>
                        <option>Friendly and conversational</option>
                        <option>Professional and formal</option>
                        <option>Technical and detailed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fallback Message</label>
                      <input
                        type="text"
                        defaultValue="I'm sorry, I didn't understand that. Could you rephrase your question?"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Other tabs would have similar structure */}
              
              {activeTab !== 'general' && activeTab !== 'appearance' && activeTab !== 'behavior' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiSettings size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Configuration coming soon</h3>
                    <p className="text-gray-600">
                      We're still working on the {activeTab} settings panel. Check back in a future update!
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      
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

export default Settings;
