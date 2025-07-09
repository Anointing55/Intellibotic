// frontend/src/pages/AddFeature.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiX, FiCode, FiCpu, FiGitBranch, FiShuffle, 
  FiDatabase, FiMessageSquare, FiCalendar, FiSettings 
} from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

const AddFeature = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureConfig, setFeatureConfig] = useState({
    name: '',
    description: '',
    type: '',
    settings: {}
  });
  const [isCreating, setIsCreating] = useState(false);

  const featureTypes = [
    {
      id: 'ai',
      title: 'AI Response',
      icon: <FiCpu className="text-blue-500" size={24} />,
      color: 'from-blue-400 to-blue-600',
      description: 'Add AI-generated responses using our advanced language models',
      fields: [
        { name: 'model', label: 'AI Model', type: 'select', options: ['GPT-4', 'Claude 3', 'Llama 3', 'Mistral'] },
        { name: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 1, step: 0.1 },
        { name: 'maxTokens', label: 'Max Tokens', type: 'number', placeholder: 'Enter max tokens' },
        { name: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'Enter system instructions...' }
      ]
    },
    {
      id: 'logic',
      title: 'Logic Branch',
      icon: <FiGitBranch className="text-purple-500" size={24} />,
      color: 'from-purple-400 to-purple-600',
      description: 'Create conditional logic paths based on user input',
      fields: [
        { name: 'conditionType', label: 'Condition Type', type: 'select', options: ['Text Match', 'Intent', 'Variable', 'Date/Time'] },
        { name: 'variable', label: 'Variable Name', type: 'text', placeholder: 'e.g. user_name' },
        { name: 'operator', label: 'Operator', type: 'select', options: ['equals', 'contains', 'starts with', 'ends with', 'greater than'] },
        { name: 'value', label: 'Value', type: 'text', placeholder: 'Enter comparison value' }
      ]
    },
    {
      id: 'custom',
      title: 'Custom Code',
      icon: <FiCode className="text-green-500" size={24} />,
      color: 'from-green-400 to-green-600',
      description: 'Execute custom JavaScript code within your chatbot flow',
      fields: [
        { name: 'code', label: 'JavaScript Code', type: 'code', placeholder: '// Write your custom logic here' },
        { name: 'timeout', label: 'Timeout (ms)', type: 'number', placeholder: '3000' },
        { name: 'variables', label: 'Input Variables', type: 'text', placeholder: 'e.g. user_id, session_data' }
      ]
    },
    {
      id: 'data',
      title: 'Data Operation',
      icon: <FiDatabase className="text-amber-500" size={24} />,
      color: 'from-amber-400 to-amber-600',
      description: 'Read or write data to databases and external APIs',
      fields: [
        { name: 'operation', label: 'Operation', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'Query'] },
        { name: 'endpoint', label: 'Endpoint/Query', type: 'text', placeholder: 'Enter URL or SQL query' },
        { name: 'variables', label: 'Variables', type: 'text', placeholder: 'e.g. user_id=123' },
        { name: 'mapping', label: 'Response Mapping', type: 'textarea', placeholder: 'Map response to variables...' }
      ]
    },
    {
      id: 'message',
      title: 'Message Node',
      icon: <FiMessageSquare className="text-cyan-500" size={24} />,
      color: 'from-cyan-400 to-cyan-600',
      description: 'Send predefined text messages to users',
      fields: [
        { name: 'content', label: 'Message Content', type: 'textarea', placeholder: 'Enter message text...' },
        { name: 'format', label: 'Format', type: 'select', options: ['Plain Text', 'Markdown', 'HTML'] },
        { name: 'buttons', label: 'Quick Replies', type: 'text', placeholder: 'Add comma-separated buttons' }
      ]
    },
    {
      id: 'workflow',
      title: 'Sub-workflow',
      icon: <FiShuffle className="text-pink-500" size={24} />,
      color: 'from-pink-400 to-pink-600',
      description: 'Call another workflow or bot as a subroutine',
      fields: [
        { name: 'workflow', label: 'Workflow to Call', type: 'select', options: ['Onboarding', 'Support', 'Sales', 'Feedback'] },
        { name: 'variables', label: 'Pass Variables', type: 'text', placeholder: 'e.g. user_id=user.id' },
        { name: 'returnVar', label: 'Return Variable', type: 'text', placeholder: 'Name for return value' }
      ]
    }
  ];

  const handleSelectFeature = (feature) => {
    setSelectedFeature(feature);
    setFeatureConfig({
      name: '',
      description: '',
      type: feature.id,
      settings: {}
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeatureConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingChange = (fieldName, value) => {
    setFeatureConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [fieldName]: value
      }
    }));
  };

  const handleCreateFeature = () => {
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
      setIsCreating(false);
      setSelectedFeature(null);
      // Reset form
      setFeatureConfig({
        name: '',
        description: '',
        type: '',
        settings: {}
      });
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    hover: { 
      y: -5, 
      scale: 1.03,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Add New Feature
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Enhance your chatbot with powerful features. Select a feature type to configure and add to your bot.
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {selectedFeature ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className={`p-6 bg-gradient-to-r ${selectedFeature.color} text-white`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
                      {selectedFeature.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedFeature.title}</h2>
                      <p className="opacity-90">{selectedFeature.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedFeature(null)}
                    className="p-2 rounded-full hover:bg-black hover:bg-opacity-20"
                  >
                    <FiX size={24} />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
                    
                    <div className="mb-5">
                      <label className="block text-gray-700 mb-2">Feature Name</label>
                      <input
                        type="text"
                        name="name"
                        value={featureConfig.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Greeting Message"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={featureConfig.description}
                        onChange={handleInputChange}
                        placeholder="Describe what this feature does..."
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Configuration</h3>
                    
                    {selectedFeature.fields.map((field, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-gray-700 mb-2">{field.label}</label>
                        
                        {field.type === 'select' ? (
                          <select
                            value={featureConfig.settings[field.name] || ''}
                            onChange={(e) => handleSettingChange(field.name, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option, i) => (
                              <option key={i} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : field.type === 'range' ? (
                          <div>
                            <input
                              type="range"
                              min={field.min}
                              max={field.max}
                              step={field.step || 1}
                              value={featureConfig.settings[field.name] || field.min}
                              onChange={(e) => handleSettingChange(field.name, e.target.value)}
                              className="w-full"
                            />
                            <div className="text-right text-gray-600">
                              {featureConfig.settings[field.name] || field.min}
                            </div>
                          </div>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={featureConfig.settings[field.name] || ''}
                            onChange={(e) => handleSettingChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            rows="3"
                          ></textarea>
                        ) : (
                          <input
                            type={field.type}
                            value={featureConfig.settings[field.name] || ''}
                            onChange={(e) => handleSettingChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFeature(null)}
                    className="px-6 py-3 mr-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateFeature}
                    disabled={isCreating || !featureConfig.name}
                    className={`px-6 py-3 rounded-lg font-medium text-white flex items-center ${
                      isCreating || !featureConfig.name 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        Create Feature
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featureTypes.map((feature) => (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  variants={cardVariants}
                  onClick={() => handleSelectFeature(feature)}
                  className={`bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer border border-gray-200 transition-all`}
                >
                  <div className={`p-6 bg-gradient-to-r ${feature.color} text-white`}>
                    <div className="flex items-center">
                      <div className="mr-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="mt-3 opacity-90 text-sm">{feature.description}</p>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">FEATURE</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiPlus size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-md overflow-hidden border border-dashed border-gray-300 flex flex-col items-center justify-center p-10 text-center"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                  <FiSettings className="text-gray-500" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Custom Feature</h3>
                <p className="text-gray-500 mb-4">Request a custom feature tailored to your needs</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium"
                >
                  Request Feature
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-12 bg-white rounded-2xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <FaRobot className="text-blue-600 mr-3" size={24} />
            <h3 className="text-xl font-bold text-gray-800">How to add features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
              <p className="text-gray-600">Select a feature type from the cards above</p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
              <p className="text-gray-600">Configure the feature settings to match your needs</p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
              <p className="text-gray-600">Drag and drop the feature into your bot workflow</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFeature;
