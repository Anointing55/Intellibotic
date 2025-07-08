// frontend/src/pages/AddFeature.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  FiSave,
  FiCode,
  FiCopy,
  FiTrash2,
  FiBox,
  FiPlus,
  FiX,
  FiDownload,
  FiUpload
} from 'react-icons/fi';

const AddFeature = () => {
  const [featureName, setFeatureName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI');
  const [icon, setIcon] = useState('FiBox');
  const [color, setColor] = useState('#6366f1');
  const [inputs, setInputs] = useState(1);
  const [outputs, setOutputs] = useState(1);
  const [code, setCode] = useState(`// Define your node's functionality here
function process(input) {
  // Your custom logic goes here
  const result = {
    output: input.data,
    nextNode: 'default'
  };
  
  return result;
}`);
  const [savedFeatures, setSavedFeatures] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFeatureId, setCurrentFeatureId] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  // Icons available for nodes
  const icons = [
    { id: 'FiBox', name: 'Box' },
    { id: 'FiCode', name: 'Code' },
    { id: 'FiCpu', name: 'Processor' },
    { id: 'FiDatabase', name: 'Database' },
    { id: 'FiGitBranch', name: 'Branch' },
    { id: 'FiGlobe', name: 'Globe' },
    { id: 'FiMessageSquare', name: 'Message' },
    { id: 'FiUser', name: 'User' },
    { id: 'FiCloud', name: 'Cloud' },
    { id: 'FiShield', name: 'Security' },
  ];

  // Color options
  const colorOptions = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { id: 'FiDatabase', name: 'Database' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  // Load saved features from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('intellibotic_features')) || [];
    setSavedFeatures(saved);
  }, []);

  // Save features to localStorage
  useEffect(() => {
    localStorage.setItem('intellibotic_features', JSON.stringify(savedFeatures));
  }, [savedFeatures]);

  const handleSave = () => {
    if (!featureName.trim()) {
      alert('Please enter a feature name');
      return;
    }

    const newFeature = {
      id: currentFeatureId || Date.now().toString(),
      name: featureName,
      description,
      category,
      icon,
      color,
      inputs,
      outputs,
      code,
      createdAt: new Date().toISOString(),
    };

    if (isEditing) {
      // Update existing feature
      setSavedFeatures(prev => 
        prev.map(f => f.id === currentFeatureId ? newFeature : f)
      );
    } else {
      // Add new feature
      setSavedFeatures(prev => [...prev, newFeature]);
    }

    resetForm();
    alert(`Feature "${featureName}" saved successfully!`);
  };

  const resetForm = () => {
    setFeatureName('');
    setDescription('');
    setCategory('AI');
    setIcon('FiBox');
    setColor('#6366f1');
    setInputs(1);
    setOutputs(1);
    setCode(`// Define your node's functionality here
function process(input) {
  // Your custom logic goes here
  const result = {
    output: input.data,
    nextNode: 'default'
  };
  
  return result;
}`);
    setIsEditing(false);
    setCurrentFeatureId(null);
  };

  const editFeature = (feature) => {
    setFeatureName(feature.name);
    setDescription(feature.description);
    setCategory(feature.category);
    setIcon(feature.icon);
    setColor(feature.color);
    setInputs(feature.inputs);
    setOutputs(feature.outputs);
    setCode(feature.code);
    setIsEditing(true);
    setCurrentFeatureId(feature.id);
  };

  const deleteFeature = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" feature?`)) {
      setSavedFeatures(prev => prev.filter(f => f.id !== id));
    }
  };

  const duplicateFeature = (feature) => {
    const newFeature = {
      ...feature,
      id: Date.now().toString(),
      name: `${feature.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setSavedFeatures(prev => [...prev, newFeature]);
  };

  const exportFeature = (feature) => {
    const json = JSON.stringify(feature, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${feature.name.replace(/\s+/g, '_')}_feature.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importFeature = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const feature = JSON.parse(event.target.result);
        if (!feature.name || !feature.code) {
          throw new Error('Invalid feature file');
        }
        
        // Add imported feature
        const newFeature = {
          ...feature,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        setSavedFeatures(prev => [...prev, newFeature]);
        alert(`Feature "${feature.name}" imported successfully!`);
      } catch (error) {
        alert('Error importing feature: Invalid file format');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset file input
  };

  const getIconComponent = (iconId) => {
    const Icon = ({ className }) => {
      const iconMap = {
        FiBox: <FiBox className={className} />,
        FiCode: <FiCode className={className} />,
        FiCpu: <FiBox className={className} />, // Placeholder
        FiDatabase: <FiDatabase className={className} />,
        FiGitBranch: <FiBox className={className} />, // Placeholder
        FiGlobe: <FiBox className={className} />, // Placeholder
        FiMessageSquare: <FiBox className={className} />, // Placeholder
        FiUser: <FiUser className={className} />,
        FiCloud: <FiBox className={className} />, // Placeholder
        FiShield: <FiBox className={className} />, // Placeholder
      };
      return iconMap[iconId] || <FiBox className={className} />;
    };
    return <Icon />;
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
            <div className="flex items-center">
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Intellibotic</h1>
              <h2 className="ml-8 text-xl text-gray-700">Add Custom Feature Node</h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="relative cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  <FiUpload className="mr-2" /> Import Node
                </motion.div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json"
                  onChange={importFeature}
                />
              </label>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Feature Node' : 'Create New Feature Node'}
              </h2>
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  <FiX size={20} />
                </motion.button>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
                <input
                  type="text"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Sentiment Analysis, Weather API, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe what this node does..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="AI">AI & Machine Learning</option>
                    <option value="API">API Integration</option>
                    <option value="Data">Data Processing</option>
                    <option value="Logic">Logic & Conditions</option>
                    <option value="Custom">Custom Function</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {icons.map((iconOption) => (
                      <motion.button
                        key={iconOption.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg flex items-center justify-center ${
                          icon === iconOption.id 
                            ? 'bg-indigo-100 border-2 border-indigo-500' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setIcon(iconOption.id)}
                        title={iconOption.name}
                      >
                        {getIconComponent(iconOption.id, 'text-lg')}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {colorOptions.map((colorOption) => (
                      <motion.button
                        key={colorOption.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-8 h-8 rounded-full ${color === colorOption.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                        style={{ backgroundColor: colorOption.value }}
                        onClick={() => setColor(colorOption.value)}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Input Handles</label>
                    <select
                      value={inputs}
                      onChange={(e) => setInputs(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} input{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output Handles</label>
                    <select
                      value={outputs}
                      onChange={(e) => setOutputs(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} output{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Node Logic (JavaScript)</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <Editor
                    height="300px"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={setCode}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto'
                      },
                      automaticLayout: true,
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <p>Your function should accept an input object and return a result object.</p>
                  <p className="mt-1">Example: <code className="bg-gray-100 p-1 rounded">{"function process(input) { return { output: input.data, nextNode: 'default' } }"}</code></p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                  onClick={resetForm}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                  onClick={handleSave}
                >
                  <FiSave className="mr-2" />
                  {isEditing ? 'Update Feature' : 'Create Feature'}
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Preview & Saved Features</h2>
                <div className="text-sm text-gray-500">
                  {savedFeatures.length} saved feature{savedFeatures.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Node Preview */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Node Preview</h3>
                
                {featureName ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <div 
                      className="px-4 py-3 shadow-md rounded-md w-56 mx-auto"
                      style={{ backgroundColor: color }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="bg-white/20 p-1 rounded mr-2 text-white">
                          {getIconComponent(icon, 'text-lg')}
                        </div>
                        <div className="text-sm font-semibold text-white truncate">{featureName}</div>
                      </div>
                      <div className="text-xs text-white/80 truncate">{description || 'No description'}</div>
                      
                      {/* Handles */}
                      <div className="absolute top-1/2 transform -translate-y-1/2 -left-2">
                        {Array.from({ length: inputs }).map((_, i) => (
                          <div 
                            key={`in-${i}`} 
                            className="w-4 h-4 rounded-full bg-white border-2 border-gray-400 mb-1 last:mb-0"
                          />
                        ))}
                      </div>
                      
                      <div className="absolute top-1/2 transform -translate-y-1/2 -right-2">
                        {Array.from({ length: outputs }).map((_, i) => (
                          <div 
                            key={`out-${i}`} 
                            className="w-4 h-4 rounded-full bg-white border-2 border-gray-400 mb-1 last:mb-0"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiBox size={24} />
                    </div>
                    <p>Create a feature to see preview</p>
                  </div>
                )}
              </div>
              
              {/* Saved Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Feature Library</h3>
                
                {savedFeatures.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiPlus size={24} />
                    </div>
                    <p>No features saved yet</p>
                    <p className="mt-2 text-sm">Create your first custom feature node</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {savedFeatures.map((feature) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="border border-gray-200 rounded-lg p-4 relative group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              <div 
                                className="w-6 h-6 rounded flex items-center justify-center mr-2 text-white"
                                style={{ backgroundColor: feature.color }}
                              >
                                {getIconComponent(feature.icon, 'text-sm')}
                              </div>
                              <h4 className="font-medium text-gray-900 truncate">{feature.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{feature.description || 'No description'}</p>
                          </div>
                          
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-indigo-600"
                              onClick={() => editFeature(feature)}
                              title="Edit"
                            >
                              <FiBox size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-indigo-600"
                              onClick={() => duplicateFeature(feature)}
                              title="Duplicate"
                            >
                              <FiCopy size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-indigo-600"
                              onClick={() => exportFeature(feature)}
                              title="Export"
                            >
                              <FiDownload size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-red-600"
                              onClick={() => deleteFeature(feature.id, feature.name)}
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-3 text-xs">
                          <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {feature.category}
                          </span>
                          <span className="text-gray-500">
                            {new Date(feature.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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

export default AddFeature;
