// frontend/src/pages/DeveloperMode.jsx
import { FiPlus } from 'react-icons/fi';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { FiPlay, FiSave, FiCode, FiTerminal, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const DeveloperMode = () => {
  const [code, setCode] = useState(`// Welcome to Developer Mode!
// Write your bot logic in JavaScript

function handleMessage(message) {
  // Process incoming messages
  const response = \`You said: \${message}\`;
  
  // Return a response
  return response;
}

// Test your function
console.log(handleMessage("Hello, world!"));
`);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [editorHeight, setEditorHeight] = useState('70vh');
  const [activeTab, setActiveTab] = useState('script.js');
  const [tabs, setTabs] = useState([
    { id: 'script.js', name: 'script.js', content: code, unsaved: false },
    { id: 'utils.js', name: 'utils.js', content: '// Utility functions', unsaved: false },
  ]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const editorRef = useRef(null);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Handle code change
  const handleCodeChange = (value) => {
    setCode(value);
    
    // Mark current tab as unsaved
    setTabs(tabs.map(tab => 
      tab.id === activeTab ? { ...tab, content: value, unsaved: true } : tab
    ));
  };

  // Run the code
  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    // Capture console.log output
    const originalLog = console.log;
    console.log = (...args) => {
      setOutput(prev => [...prev, args.join(' ')]);
      originalLog.apply(console, args);
    };
    
    try {
      // Create a function from the code
      const func = new Function(code);
      
      // Execute the function
      func();
      
      // Add success message
      setOutput(prev => [...prev, 'Execution completed successfully!']);
    } catch (error) {
      // Add error message
      setOutput(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      // Restore console.log
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  // Save current file
  const saveFile = () => {
    setTabs(tabs.map(tab => 
      tab.id === activeTab ? { ...tab, unsaved: false } : tab
    ));
    
    // Show success message
    setOutput(prev => [...prev, `Saved ${activeTab}`]);
  };

  // Add a new file
  const addNewFile = () => {
    if (!newFileName) return;
    
    const fileName = newFileName.endsWith('.js') ? newFileName : `${newFileName}.js`;
    const newTab = {
      id: fileName,
      name: fileName,
      content: '// New JavaScript file',
      unsaved: true
    };
    
    setTabs([...tabs, newTab]);
    setActiveTab(fileName);
    setCode('// New JavaScript file');
    setNewFileName('');
    setShowAddFile(false);
  };

  // Close a tab
  const closeTab = (tabId, e) => {
    e.stopPropagation();
    
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
      setCode(newTabs[0].content);
    }
  };

  // Toggle console visibility
  const toggleConsole = () => {
    setShowConsole(!showConsole);
    setEditorHeight(showConsole ? '85vh' : '70vh');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-800 py-4 px-6 flex items-center justify-between border-b border-gray-700"
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg mr-4">
            <FiCode className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Developer Mode</h1>
            <p className="text-sm text-gray-400">Write custom JavaScript logic for your bots</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveFile}
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <FiSave className="mr-2" />
            Save
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runCode}
            disabled={isRunning}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isRunning 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <FiPlay className="mr-2" />
            )}
            Run Code
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-gray-800 px-4 flex items-center border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              whileHover={{ backgroundColor: '#374151' }}
              className={`flex items-center py-2 px-4 cursor-pointer border-r border-gray-700 ${
                activeTab === tab.id ? 'bg-gray-700' : 'bg-gray-800'
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setCode(tab.content);
              }}
            >
              <FiCode className="mr-2 text-gray-400" />
              <span className="mr-2">{tab.name}</span>
              {tab.unsaved && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => closeTab(tab.id, e)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <FiX size={14} />
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddFile(true)}
          className="ml-3 p-1 text-gray-400 hover:text-white"
        >
          <FiPlus />
        </motion.button>
      </div>

      {/* Add File Modal */}
      {showAddFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddFile(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Create New File</h3>
            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">File Name</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                placeholder="e.g., utils.js"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">Use .js extension for JavaScript files</p>
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddFile(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNewFile}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white"
              >
                Create File
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Editor */}
      <motion.div
        animate={{ height: editorHeight }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </motion.div>

      {/* Console Toggle */}
      <div 
        className="bg-gray-800 py-2 px-4 border-t border-gray-700 flex items-center justify-between cursor-pointer"
        onClick={toggleConsole}
      >
        <div className="flex items-center">
          <FiTerminal className="mr-2 text-gray-400" />
          <span>Console</span>
        </div>
        {showConsole ? <FiChevronDown /> : <FiChevronUp />}
      </div>

      {/* Console Output */}
      {showConsole && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '15vh' }}
          exit={{ height: 0 }}
          className="bg-gray-800 p-4 overflow-y-auto font-mono text-sm"
        >
          {output.length === 0 ? (
            <div className="text-gray-500 italic">Run your code to see output here...</div>
          ) : (
            output.map((line, index) => (
              <div key={index} className="py-1 border-b border-gray-700 last:border-b-0">
                <span className="text-gray-500 mr-3">{index + 1}</span>
                <span className={line.startsWith('Error:') ? 'text-red-400' : 'text-gray-300'}>
                  {line}
                </span>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Help Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
      >
        <div className="flex items-start mb-2">
          <div className="bg-primary/20 text-primary p-1 rounded mr-3">
            <FiCode size={18} />
          </div>
          <div>
            <h3 className="font-bold text-gray-200">Developer Tips</h3>
            <p className="text-gray-400 text-sm">
              Use <code className="bg-gray-700 px-1 rounded">console.log()</code> to debug your code.
              The output will appear in the console below.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperMode;
