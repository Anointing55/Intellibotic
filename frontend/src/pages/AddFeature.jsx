// frontend/src/pages/AddFeature.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiX, FiCode, FiGitBranch, FiBox, FiSave } from 'react-icons/fi';

const AddFeature = () => {
  const [featureType, setFeatureType] = useState('ai');
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeColor, setNodeColor] = useState('#8b5cf6');
  const [nodeIcon, setNodeIcon] = useState('FiBox');
  const [fields, setFields] = useState([{ name: '', type: 'text' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Icons available for nodes
  const icons = [
    { name: 'FiBox', component: <FiBox /> },
    { name: 'FiCode', component: <FiCode /> },
    { name: 'FiGitBranch', component: <FiGitBranch /> },
    { name: 'FiMessageSquare', component: <FiBox /> }, // Placeholder
    { name: 'FiDatabase', component: <FiBox /> }, // Placeholder
    { name: 'FiUser', component: <FiBox /> }, // Placeholder
  ];

  // Add a new field to the node configuration
  const addField = () => {
    setFields([...fields, { name: '', type: 'text' }]);
  };

  // Remove a field
  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  // Update field property
  const updateField = (index, property, value) => {
    const newFields = [...fields];
    newFields[index][property] = value;
    setFields(newFields);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate save process
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setNodeName('');
        setNodeDescription('');
        setFields([{ name: '', type: 'text' }]);
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  // Render the node preview
  const renderNodePreview = () => {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="px-4 py-3 shadow-md rounded-md w-48 mx-auto"
        style={{ backgroundColor: nodeColor, color: getContrastColor(nodeColor) }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="mr-2">
              {icons.find(icon => icon.name === nodeIcon)?.component}
            </div>
            <div className="text-xs font-bold truncate">{nodeName || 'New Node'}</div>
          </div>
        </div>
        <div className="text-xs truncate">{nodeDescription || 'Node description'}</div>
      </motion.div>
    );
  };

  // Helper to get contrast text color
  const getContrastColor = (hex) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            Add New Feature Node
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Create custom node types to extend your chatbot's capabilities. 
            Once created, these nodes will be available in the drag-and-drop builder.
          </motion.p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <FiCheck className="mr-2 text-xl" />
            Node type created successfully! It's now available in the builder.
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Node Configuration
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Node Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['ai', 'logic', 'custom'].map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setFeatureType(type)}
                      className={`py-3 rounded-lg text-center ${
                        featureType === type
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {type.toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Node Name
                </label>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  className="input-field"
                  placeholder="e.g., AI Response, Conditional Logic"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                  className="input-field"
                  placeholder="Describe what this node does"
                  rows={2}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Node Color
                </label>
                <input
                  type="color"
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon) => (
                    <motion.div
                      key={icon.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNodeIcon(icon.name)}
                      className={`h-10 rounded-lg flex items-center justify-center cursor-pointer ${
                        nodeIcon === icon.name
                          ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {icon.component}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Configuration Fields
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addField}
                    className="flex items-center text-sm text-primary hover:text-primary/80"
                  >
                    <FiPlus className="mr-1" />
                    Add Field
                  </motion.button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex space-x-3"
                    >
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                        className="input-field flex-1"
                        placeholder="Field name"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                        className="input-field w-32"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">True/False</option>
                        <option value="select">Options</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeField(index)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
                      >
                        <FiX size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSaving || !nodeName}
                className={`w-full py-3 rounded-lg flex items-center justify-center ${
                  isSaving || !nodeName
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white shadow-md'
                }`}
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
                    Create Node Type
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
          
          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6 flex flex-col"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Node Preview
            </h2>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                {renderNodePreview()}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  How it will appear in the builder
                </h3>
                <p className="text-gray-600 mb-6">
                  This preview shows how your new node will look in the drag-and-drop interface.
                </p>
                
                <div className="inline-block bg-gray-800 text-white text-sm px-4 py-2 rounded-lg">
                  Drag me to the canvas
                </div>
              </motion.div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Node Types Guide
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 mr-3">
                    <FiBox />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">AI Nodes</div>
                    <p className="text-gray-600 text-sm">Integrate AI services, generate responses, analyze text</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-secondary/10 text-secondary rounded-lg p-2 mr-3">
                    <FiGitBranch />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Logic Nodes</div>
                    <p className="text-gray-600 text-sm">Add conditions, loops, and control flow to your bot</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-accent/10 text-accent rounded-lg p-2 mr-3">
                    <FiCode />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Custom Nodes</div>
                    <p className="text-gray-600 text-sm">Create your own functionality with custom code</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Placeholder FiCheck icon since we're using react-icons
const FiCheck = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default AddFeature;
