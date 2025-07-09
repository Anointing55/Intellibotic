// frontend/src/pages/Settings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUser, FiShield, FiDatabase, FiBell, FiMail, FiKey, FiGlobe, FiLock } from 'react-icons/fi';
import { FaCheck, FaSpinner } from 'react-icons/fa';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form states
  const [formData, setFormData] = useState({
    name: 'Anointing Omowumi',
    email: 'anointing@intellibotic.com',
    timezone: 'GMT+1 (Lagos)',
    notificationEmail: true,
    notificationPush: true,
    apiKey: 'sk_...aBcDeFgHiJkLmNoPqRsTuVwXyZ',
    twoFactor: true,
    dataRetention: 90,
    language: 'en-US',
    theme: 'light'
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success animation
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const cardVariants = {
    hover: { 
      y: -5, 
      boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
      transition: { duration: 0.3 }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'api', label: 'API Keys', icon: <FiKey /> },
    { id: 'data', label: 'Data & Storage', icon: <FiDatabase /> },
    { id: 'preferences', label: 'Preferences', icon: <FiGlobe /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Account Settings
            </motion.h1>
            <motion.p 
              className="text-gray-600 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Manage your account preferences and security settings
            </motion.p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`mt-4 md:mt-0 flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              isSaving 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tab Navigation */}
          <motion.div 
            className="w-full md:w-64"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activeTab === 'profile' && (
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={containerVariants}
              >
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiUser className="mr-2 text-blue-600" />
                    Profile Information
                  </h2>
                  <p className="text-gray-600 mt-1">Update your personal details</p>
                </div>
                
                <div className="p-6">
                  <motion.div variants={itemVariants} className="mb-6">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gray-700 mb-2">Timezone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option>GMT+1 (Lagos)</option>
                      <option>GMT (London)</option>
                      <option>GMT-5 (New York)</option>
                      <option>GMT+8 (Singapore)</option>
                    </select>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'security' && (
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={containerVariants}
              >
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiShield className="mr-2 text-blue-600" />
                    Security Settings
                  </h2>
                  <p className="text-gray-600 mt-1">Manage your account security</p>
                </div>
                
                <div className="p-6">
                  <motion.div 
                    variants={itemVariants} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-gray-600 text-sm mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        name="twoFactor"
                        checked={formData.twoFactor}
                        onChange={handleInputChange}
                        className="opacity-0 w-0 h-0"
                        id="twoFactorToggle"
                      />
                      <label 
                        htmlFor="twoFactorToggle"
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                          formData.twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span 
                          className={`absolute h-5 w-5 bg-white rounded-full transition-transform ${
                            formData.twoFactor ? 'transform translate-x-6' : 'translate-x-1'
                          } top-0.5`}
                        />
                      </label>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">Password</h3>
                      <p className="text-gray-600 text-sm mt-1">Last changed 3 months ago</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Change Password
                    </motion.button>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">Active Sessions</h3>
                      <p className="text-gray-600 text-sm mt-1">2 active sessions</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Sessions
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'api' && (
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={containerVariants}
              >
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiKey className="mr-2 text-blue-600" />
                    API Keys
                  </h2>
                  <p className="text-gray-600 mt-1">Manage your API access keys</p>
                </div>
                
                <div className="p-6">
                  <motion.div 
                    variants={itemVariants} 
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">Primary API Key</h3>
                        <p className="text-gray-600 text-sm mt-1">Created on Jan 12, 2024</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                          Regenerate
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                        >
                          Revoke
                        </motion.button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <div className="flex-1 p-3 bg-white border border-gray-300 rounded-lg font-mono text-sm overflow-x-auto">
                        {formData.apiKey}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <FiKey className="mr-2" />
                      Create New API Key
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'data' && (
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={containerVariants}
              >
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiDatabase className="mr-2 text-blue-600" />
                    Data & Storage
                  </h2>
                  <p className="text-gray-600 mt-1">Manage your data retention policies</p>
                </div>
                
                <div className="p-6">
                  <motion.div variants={itemVariants} className="mb-6">
                    <label className="block text-gray-700 mb-2">Conversation Data Retention</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        name="dataRetention"
                        min="7"
                        max="365"
                        value={formData.dataRetention}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                      <div className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center">
                        {formData.dataRetention} days
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      Chat conversation data will be automatically deleted after this period
                    </p>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Data Export</h3>
                    <p className="text-gray-600 mb-4">
                      Export all your chatbot data and configurations for backup or migration
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Export Data
                    </motion.button>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-800 flex items-center">
                      <FiLock className="mr-2" />
                      Danger Zone
                    </h3>
                    <p className="text-red-700 text-sm mt-1 mb-3">
                      These actions are irreversible. Proceed with caution.
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                      >
                        Delete Account
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                      >
                        Delete All Data
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Success Notification */}
        {!isSaving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center"
          >
            <FaCheck className="mr-2" />
            Settings saved successfully!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
