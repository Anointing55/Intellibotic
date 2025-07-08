// frontend/src/pages/DeveloperMode.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  FiCode, FiSave, FiPlay, FiDownload, FiUpload, 
  FiCopy, FiGitBranch, FiGitCommit, FiClock, 
  FiZap, FiChevronDown, FiChevronUp, FiTerminal,
  FiBookOpen, FiHelpCircle, FiShare2, FiRefreshCw
} from 'react-icons/fi';

const DeveloperMode = () => {
  const [code, setCode] = useState(`// Intellibotic Developer Mode
// Define your chatbot using JavaScript

class Chatbot {
  constructor(name) {
    this.name = name || "My Chatbot";
    this.nodes = [];
    this.flows = {};
    this.version = "1.0.0";
  }
  
  addNode(node) {
    this.nodes.push(node);
    return this;
  }
  
  addFlow(source, targets) {
    this.flows[source] = targets;
    return this;
  }
  
  toJSON() {
    return {
      name: this.name,
      version: this.version,
      nodes: this.nodes,
      flows: this.flows
    };
  }
}

// Example: Create a simple greeting bot
const greetingBot = new Chatbot("Greeting Bot");

// Add nodes
greetingBot
  .addNode({
    id: "start",
    type: "trigger",
    message: "Welcome! How can I help you today?"
  })
  .addNode({
    id: "greeting",
    type: "response",
    message: "Hello there! Nice to meet you."
  })
  .addNode({
    id: "farewell",
    type: "response",
    message: "Goodbye! Have a great day."
  });

// Define flows
greetingBot
  .addFlow("start", ["greeting", "farewell"])
  .addFlow("greeting", ["farewell"]);

// Export the bot configuration
const botConfig = greetingBot.toJSON();

// Intellibotic will automatically deploy this configuration
return botConfig;`);
  
  const [output, setOutput] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [botName, setBotName] = useState('Untitled Bot');
  const [showDocs, setShowDocs] = useState(false);
  
  const editorRef = useRef(null);
  
  // Sample documentation
  const documentation = [
    {
      title: "Chatbot Class",
      description: "The base class for creating chatbots",
      code: `class Chatbot {
  constructor(name) {
    this.name = name;
    this.nodes = [];
    this.flows = {};
  }
}`,
      methods: [
        { name: "addNode(node)", desc: "Adds a node to the chatbot" },
        { name: "addFlow(source, targets)", desc: "Defines connections between nodes" },
        { name: "toJSON()", desc: "Exports the bot configuration" }
      ]
    },
    {
      title: "Node Types",
      description: "Available node types for your chatbot",
      items: [
        { type: "trigger", desc: "Starting point of a conversation" },
        { type: "response", desc: "Simple text response" },
        { type: "question", desc: "Asks user for input" },
        { type: "condition", desc: "Branches based on conditions" },
        { type: "api", desc: "Calls external APIs" },
        { type: "function", desc: "Executes custom JavaScript" }
      ]
    },
    {
      title: "Example Bot",
      description: "Simple greeting bot",
      code: `const bot = new Chatbot("Greeting Bot");
bot.addNode({ id: "start", type: "trigger", message: "Hello!" });
bot.addFlow("start", ["response_node"]);`
    }
  ];
  
  // Sample versions
  useEffect(() => {
    setVersions([
      { id: 'v1', name: 'Initial version', timestamp: '2025-07-08 10:30', code: code },
      { id: 'v2', name: 'Added error handling', timestamp: '2025-07-08 14:15', code: '// Different code' }
    ]);
    setCurrentVersion('v1');
  }, []);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  
  const runCode = () => {
    setIsRunning(true);
    setErrors([]);
    setOutput(null);
    
    try {
      // Create a function from the code
      const func = new Function(code);
      
      // Execute the code
      const result = func();
      
      if (result && typeof result === 'object') {
        setOutput(result);
      } else {
        setErrors([{ message: "Code must return a bot configuration object" }]);
      }
    } catch (error) {
      setErrors([{ message: error.message, line: error.lineNumber }]);
    } finally {
      setIsRunning(false);
    }
  };
  
  const deployBot = () => {
    if (!output) {
      alert("Please run the code successfully first");
      return;
    }
    
    setIsDeploying(true);
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false);
      alert(`"${botName}" deployed successfully!`);
    }, 1500);
  };
  
  const saveVersion = () => {
    const newVersion = {
      id: `v${versions.length + 1}`,
      name: `Saved at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      code
    };
    
    setVersions(prev => [newVersion, ...prev]);
    setCurrentVersion(newVersion.id);
    alert("Version saved successfully!");
  };
  
  const loadVersion = (versionId) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setCode(version.code);
      setCurrentVersion(versionId);
    }
  };
  
  const exportBot = () => {
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName.replace(/\s+/g, '_')}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const importBot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = null; // Reset file input
  };
  
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-9 h-9 rounded-lg flex items-center justify-center">
                <FiCode className="text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold">Intellibotic Developer Mode</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="bg-gray-700 border-b border-transparent hover:border-gray-400 focus:border-indigo-400 focus:outline-none px-2 py-1 text-sm"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                onClick={() => setShowDocs(!showDocs)}
              >
                <FiBookOpen className="mr-2" /> {showDocs ? 'Hide Docs' : 'Show Docs'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm"
                onClick={deployBot}
                disabled={isDeploying}
              >
                <FiZap className={`mr-2 ${isDeploying ? 'animate-pulse' : ''}`} />
                {isDeploying ? 'Deploying...' : 'Deploy Bot'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documentation Panel */}
          {showDocs && (
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-5 h-fit">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiBookOpen className="mr-2 text-indigo-600" /> API Documentation
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDocs(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {documentation.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-indigo-500 pl-4 py-2"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                    
                    {doc.code && (
                      <pre className="bg-gray-800 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto mt-2">
                        {doc.code}
                      </pre>
                    )}
                    
                    {doc.methods && (
                      <div className="mt-3">
                        {doc.methods.map((method, i) => (
                          <div key={i} className="flex mt-2">
                            <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono">
                              {method.name}
                            </code>
                            <span className="text-xs text-gray-600 ml-2">{method.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {doc.items && (
                      <ul className="mt-3 space-y-2">
                        {doc.items.map((item, i) => (
                          <li key={i} className="flex">
                            <code className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">
                              {item.type}
                            </code>
                            <span className="text-xs text-gray-600 ml-2">{item.desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <FiHelpCircle className="mr-2 text-indigo-600" />
                  <p>Press F1 in the editor for more assistance</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Editor Column */}
          <div className={`${showDocs ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 xl:grid-cols-3 gap-6`}>
            {/* Code Editor */}
            <div className={`${showConsole ? 'xl:col-span-2' : 'xl:col-span-3'} bg-white rounded-xl shadow-sm overflow-hidden`}>
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FiGitBranch className="text-gray-500 mr-2" />
                    <select 
                      value={currentVersion || ''}
                      onChange={(e) => loadVersion(e.target.value)}
                      className="bg-transparent text-gray-700 py-1 px-2 rounded border border-gray-300 text-sm"
                    >
                      <option disabled>Select version</option>
                      {versions.map(version => (
                        <option key={version.id} value={version.id}>
                          {version.name} - {new Date(version.timestamp).toLocaleTimeString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-sm text-gray-700 hover:text-indigo-600"
                    onClick={saveVersion}
                  >
                    <FiGitCommit className="mr-1" /> Save Version
                  </motion.button>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700"
                    onClick={formatCode}
                  >
                    <FiRefreshCw className="mr-1" /> Format
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded text-sm text-indigo-700"
                    onClick={runCode}
                    disabled={isRunning}
                  >
                    <FiPlay className={`mr-1 ${isRunning ? 'animate-pulse' : ''}`} />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </motion.button>
                </div>
              </div>
              
              <div className="h-[500px]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={setCode}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    scrollbar: {
                      vertical: 'auto',
                      horizontal: 'auto'
                    },
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
              
              <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
                <div className="text-xs">
                  <span className="text-green-400">Connected</span>
                  <span className="mx-2">•</span>
                  <span>JavaScript</span>
                </div>
                <div className="flex space-x-3">
                  <label className="flex items-center text-xs cursor-pointer">
                    <FiUpload className="mr-1" /> Import
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".js"
                      onChange={importBot}
                    />
                  </label>
                  <button 
                    className="flex items-center text-xs hover:text-indigo-300"
                    onClick={exportBot}
                  >
                    <FiDownload className="mr-1" /> Export
                  </button>
                  <button 
                    className="flex items-center text-xs hover:text-indigo-300"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    <FiCopy className="mr-1" /> Copy
                  </button>
                </div>
              </div>
            </div>
            
            {/* Output & Console Panel */}
            <div className={`${showConsole ? 'xl:col-span-1' : 'hidden'} flex flex-col`}>
              <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col">
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 rounded-t-xl border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <FiTerminal className="text-gray-500 mr-2" />
                    <h3 className="font-medium">Output & Console</h3>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConsole(false)}
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {errors.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-red-600 flex items-center">
                        <FiZap className="mr-2" /> Errors Found
                      </h4>
                      {errors.map((error, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-3 text-sm">
                          <div className="font-medium text-red-800">{error.message}</div>
                          {error.line && (
                            <div className="text-red-600 mt-1">Line: {error.line}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : output ? (
                    <div className="space-y-4">
                      <h4 className="font-medium text-green-600 flex items-center">
                        <FiZap className="mr-2" /> Bot Configuration
                      </h4>
                      
                      <div>
                        <div className="text-xs text-gray-500">Bot Name</div>
                        <div className="font-medium">{output.name || 'Untitled Bot'}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Nodes</div>
                        <div className="space-y-2 mt-1">
                          {output.nodes && output.nodes.slice(0, 3).map((node, index) => (
                            <div key={index} className="flex items-start">
                              <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded mr-2">
                                {node.type}
                              </div>
                              <div className="text-sm truncate">{node.id}</div>
                            </div>
                          ))}
                          {output.nodes && output.nodes.length > 3 && (
                            <div className="text-xs text-gray-500">
                              + {output.nodes.length - 3} more nodes
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Flows</div>
                        <div className="space-y-1 mt-1">
                          {output.flows && Object.entries(output.flows).slice(0, 3).map(([source, targets], index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{source}</span> → 
                              <span className="ml-1">{targets.join(', ')}</span>
                            </div>
                          ))}
                          {output.flows && Object.keys(output.flows).length > 3 && (
                            <div className="text-xs text-gray-500">
                              + {Object.keys(output.flows).length - 3} more flows
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
                          onClick={deployBot}
                          disabled={isDeploying}
                        >
                          <FiZap className="inline mr-2" />
                          {isDeploying ? 'Deploying...' : 'Deploy This Bot'}
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-center py-8">
                      <div>
                        <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiTerminal className="text-gray-500" />
                        </div>
                        <p>Run your code to see the output here</p>
                        <p className="text-sm mt-2">Any errors will appear in this panel</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {output ? 'Valid bot configuration' : 'No output yet'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {errors.length > 0 ? `${errors.length} error${errors.length > 1 ? 's' : ''}` : 'No errors'}
                  </div>
                </div>
              </div>
              
              {/* Versions Panel */}
              <div className="bg-white rounded-xl shadow-sm mt-4">
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 rounded-t-xl border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-2" />
                    <h3 className="font-medium">Version History</h3>
                  </div>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {versions.length} versions
                  </span>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {versions.map((version) => (
                    <div 
                      key={version.id}
                      className={`px-4 py-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                        currentVersion === version.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                      }`}
                      onClick={() => loadVersion(version.id)}
                    >
                      <div className="font-medium">{version.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(version.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Show Console Button (when hidden) */}
            {!showConsole && (
              <div className="fixed right-8 bottom-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
                  onClick={() => setShowConsole(true)}
                >
                  <FiTerminal />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span>Developer Mode</span>
              <span className="mx-2">•</span>
              <span>{botName}</span>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white text-sm flex items-center">
                <FiShare2 className="mr-1" /> Share
              </button>
              <button className="text-gray-400 hover:text-white text-sm flex items-center">
                <FiHelpCircle className="mr-1" /> Help
              </button>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default DeveloperMode;
