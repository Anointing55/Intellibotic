// frontend/src/pages/DeveloperMode.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiPlay, FiSave, FiTerminal, FiCopy, FiChevronDown, FiChevronUp, FiMaximize, FiMinimize } from 'react-icons/fi';
import { FaRobot, FaJs } from 'react-icons/fa';
import Editor from '@monaco-editor/react';

const DeveloperMode = () => {
  const [code, setCode] = useState(`// Welcome to Intellibotic Developer Mode
// Write your custom chatbot logic here

function handleMessage(userInput, context) {
  // Access conversation context
  const { sessionId, userId, variables } = context;
  
  // Example: Simple echo response
  if (userInput.toLowerCase().includes('hello')) {
    return {
      text: "Hello! How can I assist you today?",
      buttons: ["Help", "Products", "Support"]
    };
  }
  
  // Example: Access variables
  if (userInput.toLowerCase().includes('name')) {
    return {
      text: \`Your name is \${variables.name || 'not set yet'}\`,
      actions: [{ type: 'SET_VARIABLE', name: 'lastAsked', value: 'name' }]
    };
  }
  
  // Fallback response
  return {
    text: "I'm still learning. Could you rephrase that?",
    suggestions: ["What can you do?", "Help me with an issue"]
  };
}

// Export the handler function
module.exports = { handleMessage };
`);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [activeTab, setActiveTab] = useState('script');
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [activeFile, setActiveFile] = useState('main.js');
  
  const editorRef = useRef(null);
  
  const files = [
    { id: 'main.js', name: 'main.js', icon: <FaJs className="text-yellow-400" /> },
    { id: 'utils.js', name: 'utils.js', icon: <FaJs className="text-yellow-400" /> },
    { id: 'config.json', name: 'config.json', icon: <FiCode className="text-blue-400" /> },
    { id: 'package.json', name: 'package.json', icon: <FiCode className="text-green-400" /> },
  ];
  
  const themes = [
    { id: 'vs-dark', name: 'Dark' },
    { id: 'vs', name: 'Light' },
    { id: 'hc-black', name: 'High Contrast' },
  ];
  
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };
  
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [
      ...prev,
      { type: 'info', message: 'Running script...', timestamp: new Date() }
    ]);
    
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(prev => [
        ...prev,
        { type: 'success', message: 'Script executed successfully!', timestamp: new Date() },
        { type: 'log', message: 'Hello! How can I assist you today?', timestamp: new Date() }
      ]);
    }, 1500);
  };
  
  const handleSaveCode = () => {
    setIsSaved(true);
    setConsoleOutput(prev => [
      ...prev,
      { type: 'info', message: 'Code saved successfully', timestamp: new Date() }
    ]);
    
    setTimeout(() => setIsSaved(false), 3000);
  };
  
  const handleClearConsole = () => {
    setConsoleOutput([]);
  };
  
  const toggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const addToConsole = (type, message) => {
    setConsoleOutput(prev => [
      ...prev,
      { type, message, timestamp: new Date() }
    ]);
  };
  
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
  
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-600 p-3 rounded-xl mr-4">
              <FiCode className="text-white text-2xl" />
            </div>
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Developer Mode
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Advanced code editor for custom chatbot logic
              </motion.p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                isRunning 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <FiPlay className="mr-2" />
                  Run Code
                </>
              )}
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSaveCode}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                isSaved 
                  ? 'bg-green-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              } text-white`}
            >
              <FiSave className="mr-2" />
              {isSaved ? 'Saved!' : 'Save Code'}
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleFullscreen}
              className="flex items-center px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white"
            >
              {isFullscreen ? <FiMinimize className="mr-2" /> : <FiMaximize className="mr-2" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* File Explorer Panel */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white flex items-center">
                <FaRobot className="mr-2 text-blue-400" />
                Project Files
              </h3>
            </div>
            
            <div className="p-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFile(file.id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    activeFile === file.id ? 'bg-blue-500 bg-opacity-20' : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{file.icon}</span>
                  <span className="text-gray-200 font-mono text-sm">{file.name}</span>
                </motion.div>
              ))}
              
              <div className="mt-6 p-3 bg-gray-700 rounded-lg">
                <h4 className="text-gray-400 text-sm font-bold mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">axios@1.4.0</span>
                  <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">lodash@4.17.21</span>
                  <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">moment@2.29.4</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Editor Area */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-3 bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            {/* Editor Tabs */}
            <div className="flex border-b border-gray-700 bg-gray-800">
              <button
                onClick={() => setActiveTab('script')}
                className={`px-4 py-3 font-medium text-sm relative ${
                  activeTab === 'script' 
                    ? 'text-blue-400' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Script Editor
                {activeTab === 'script' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="editorTabIndicator"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`px-4 py-3 font-medium text-sm relative ${
                  activeTab === 'test' 
                    ? 'text-blue-400' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Test Cases
                {activeTab === 'test' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="editorTabIndicator"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-4 py-3 font-medium text-sm relative ${
                  activeTab === 'docs' 
                    ? 'text-blue-400' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Documentation
                {activeTab === 'docs' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="editorTabIndicator"
                  />
                )}
              </button>
              
              <div className="flex-1"></div>
              
              <div className="flex items-center pr-4">
                <label className="text-gray-400 text-sm mr-2">Theme:</label>
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value)}
                  className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
                
                <label className="text-gray-400 text-sm ml-4 mr-2">Font:</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
                >
                  {[12, 14, 16, 18, 20].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Monaco Editor */}
            <div className="flex-1 min-h-[400px]">
              <Editor
                height="100%"
                language="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={editorTheme}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'Fira Code, monospace',
                  fontLigatures: true,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto'
                  }
                }}
              />
            </div>
            
            {/* Console Header */}
            <div 
              className="bg-gray-750 border-t border-gray-700 p-3 flex justify-between items-center cursor-pointer"
              onClick={toggleConsole}
            >
              <div className="flex items-center">
                <FiTerminal className="text-gray-400 mr-2" />
                <span className="text-gray-300 font-medium">Console Output</span>
                <span className="ml-2 bg-gray-700 rounded-full px-2 py-0.5 text-xs text-gray-400">
                  {consoleOutput.length} messages
                </span>
              </div>
              <div className="text-gray-500">
                {isConsoleOpen ? <FiChevronDown /> : <FiChevronUp />}
              </div>
            </div>
            
            {/* Console Content */}
            <AnimatePresence>
              {isConsoleOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-850 overflow-hidden"
                >
                  <div className="p-3 max-h-60 overflow-y-auto">
                    {consoleOutput.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">
                        No console messages. Run your code to see output.
                      </div>
                    ) : (
                      consoleOutput.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start py-2 px-3 border-l-4 ${
                            log.type === 'error' 
                              ? 'border-red-500 bg-red-900 bg-opacity-20' 
                              : log.type === 'success' 
                                ? 'border-green-500 bg-green-900 bg-opacity-20' 
                                : log.type === 'warning'
                                  ? 'border-yellow-500 bg-yellow-900 bg-opacity-20'
                                  : 'border-blue-500 bg-blue-900 bg-opacity-20'
                          } mb-2 rounded`}
                        >
                          <div className={`w-3 h-3 rounded-full mr-3 mt-1.5 ${
                            log.type === 'error' 
                              ? 'bg-red-500' 
                              : log.type === 'success' 
                                ? 'bg-green-500' 
                                : log.type === 'warning'
                                  ? 'bg-yellow-500'
                                  : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className={`font-mono text-sm ${
                                log.type === 'error' 
                                  ? 'text-red-400' 
                                  : log.type === 'success' 
                                    ? 'text-green-400' 
                                    : log.type === 'warning'
                                      ? 'text-yellow-400'
                                      : 'text-blue-400'
                              }`}>
                                {log.type.toUpperCase()}
                              </span>
                              <span className="text-gray-500 text-xs">{formatTimestamp(log.timestamp)}</span>
                            </div>
                            <div className="text-gray-200 text-sm mt-1">{log.message}</div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                  <div className="bg-gray-800 p-2 flex justify-end border-t border-gray-700">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleClearConsole}
                      className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                    >
                      Clear Console
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
        
        {/* Documentation Panel */}
        <motion.div 
          className="mt-6 bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white flex items-center">
              <FiCode className="mr-2 text-blue-400" />
              Developer Documentation
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-gray-750 rounded-lg p-5">
              <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <FiCode className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">Core Functions</h4>
              <p className="text-gray-400 text-sm mb-3">
                Implement these required functions in your script:
              </p>
              <div className="bg-gray-850 p-3 rounded font-mono text-sm text-gray-300">
                handleMessage(input, context) {'{...}'}
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-5">
              <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <FaRobot className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">Context Object</h4>
              <p className="text-gray-400 text-sm mb-3">
                Access these properties in the context parameter:
              </p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">●</span> 
                  <code>userId</code> - Current user ID
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">●</span> 
                  <code>sessionId</code> - Conversation session ID
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">●</span> 
                  <code>variables</code> - User-specific variables
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">●</span> 
                  <code>botId</code> - Current bot ID
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-5">
              <div className="bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <FiTerminal className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">Response Format</h4>
              <p className="text-gray-400 text-sm mb-3">
                Return an object with these optional properties:
              </p>
              <div className="bg-gray-850 p-3 rounded font-mono text-sm text-gray-300">
                {'{'}
                <br />
                &nbsp;&nbsp;text: "Response text",
                <br />
                &nbsp;&nbsp;buttons: ["Option1", "Option2"],
                <br />
                &nbsp;&nbsp;actions: [{'{{'} type: "SET_VARIABLE", ...{'}}'}]
                <br />
                {'}'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperMode;
