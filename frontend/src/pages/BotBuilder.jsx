// src/pages/BotBuilder.jsx
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  Handle,
  Position
} from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiCode, 
  FiGitBranch, 
  FiDatabase, 
  FiPlus, 
  FiChevronLeft,
  FiSave,
  FiPlay,
  FiSettings,
  FiTrash2,
  FiX,
  FiZap,
  FiUser
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';

// Custom Node Components
const MessageNode = ({ data }) => {
  return (
    <motion.div 
      className="px-4 py-3 shadow-md rounded-lg bg-white border border-blue-200 w-64"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center mb-2">
        <div className="rounded-full bg-blue-100 p-2 mr-2">
          <FiMessageSquare className="text-blue-600" />
        </div>
        <div className="font-medium text-gray-900">Send Message</div>
      </div>
      <div className="text-sm text-gray-600 truncate">
        {data.label || "Type your message here..."}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" />
    </motion.div>
  );
};

const ConditionNode = ({ data }) => {
  return (
    <motion.div 
      className="px-4 py-3 shadow-md rounded-lg bg-white border border-purple-200 w-64"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center mb-2">
        <div className="rounded-full bg-purple-100 p-2 mr-2">
          <FiGitBranch className="text-purple-600" />
        </div>
        <div className="font-medium text-gray-900">Condition</div>
      </div>
      <div className="text-sm text-gray-600 truncate">
        {data.label || "Add condition..."}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-purple-500" />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="true" 
        className="w-2 h-2 bg-green-500"
        style={{ left: '25%' }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="false" 
        className="w-2 h-2 bg-red-500"
        style={{ left: '75%' }}
      />
    </motion.div>
  );
};

const CodeNode = ({ data }) => {
  return (
    <motion.div 
      className="px-4 py-3 shadow-md rounded-lg bg-white border border-yellow-200 w-64"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center mb-2">
        <div className="rounded-full bg-yellow-100 p-2 mr-2">
          <FiCode className="text-yellow-600" />
        </div>
        <div className="font-medium text-gray-900">Execute Code</div>
      </div>
      <div className="text-sm text-gray-600 truncate">
        {data.label || "Write your code..."}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-yellow-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-yellow-500" />
    </motion.div>
  );
};

const StartNode = () => {
  return (
    <motion.div 
      className="px-4 py-3 shadow-md rounded-lg bg-white border-2 border-green-500 w-48"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-green-100 p-2 mr-2">
          <FiZap className="text-green-600" />
        </div>
        <div className="font-medium text-gray-900">Start</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-500" />
    </motion.div>
  );
};

const UserInputNode = ({ data }) => {
  return (
    <motion.div 
      className="px-4 py-3 shadow-md rounded-lg bg-white border border-indigo-200 w-64"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center mb-2">
        <div className="rounded-full bg-indigo-100 p-2 mr-2">
          <FiUser className="text-indigo-600" />
        </div>
        <div className="font-medium text-gray-900">User Input</div>
      </div>
      <div className="text-sm text-gray-600 truncate">
        {data.label || "What should users say?"}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-500" />
    </motion.div>
  );
};

// Node types
const nodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  code: CodeNode,
  start: StartNode,
  userInput: UserInputNode
};

const BotBuilder = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize with some nodes
  useState(() => {
    setNodes([
      {
        id: '1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Start' }
      },
      {
        id: '2',
        type: 'userInput',
        position: { x: 250, y: 150 },
        data: { label: 'What can I help you with?' }
      },
      {
        id: '3',
        type: 'condition',
        position: { x: 250, y: 250 },
        data: { label: 'Is it urgent?' }
      },
      {
        id: '4',
        type: 'message',
        position: { x: 100, y: 350 },
        data: { label: 'Please contact support immediately' }
      },
      {
        id: '5',
        type: 'message',
        position: { x: 400, y: 350 },
        data: { label: 'I can help with that!' }
      }
    ]);

    setEdges([
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true' },
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false' }
    ]);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('text/plain');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1500);
  };

  const handleTestBot = () => {
    navigate(`/chat/${botId}`);
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const closeNodeEditor = () => {
    setSelectedNode(null);
  };

  const updateNodeData = (newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData
            }
          };
        }
        return node;
      })
    );
  };

  const nodeTypesList = [
    { id: 'message', icon: <FiMessageSquare />, name: 'Message', color: 'blue' },
    { id: 'userInput', icon: <FiUser />, name: 'User Input', color: 'indigo' },
    { id: 'condition', icon: <FiGitBranch />, name: 'Condition', color: 'purple' },
    { id: 'code', icon: <FiCode />, name: 'Execute Code', color: 'yellow' },
    { id: 'database', icon: <FiDatabase />, name: 'Database', color: 'green' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gray-50"
    >
      <ReactFlowProvider>
        {/* Sidebar */}
        <motion.div
          animate={{ width: isSidebarOpen ? '280px' : '0px' }}
          className={`h-full bg-white shadow-lg z-10 overflow-hidden ${isSidebarOpen ? 'border-r border-gray-200' : ''}`}
        >
          <div className="h-full flex flex-col" style={{ minWidth: '280px' }}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Node Library</h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={18} />
                </motion.button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Core Nodes</h3>
              
              <div className="space-y-3">
                {nodeTypesList.map((nodeType) => (
                  <motion.div
                    key={nodeType.id}
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/reactflow', nodeType.id);
                      event.dataTransfer.setData('text/plain', nodeType.name);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <div className={`flex items-center p-3 rounded-lg border cursor-pointer bg-white shadow-sm border-${nodeType.color}-200 group-hover:border-${nodeType.color}-300 transition-colors`}>
                      <div className={`rounded-lg p-2 mr-3 bg-${nodeType.color}-100 text-${nodeType.color}-600`}>
                        {nodeType.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{nodeType.name}</div>
                        <div className="text-xs text-gray-500">Drag to canvas</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-6 mb-3">AI Nodes</h3>
              
              <div className="space-y-3">
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center p-3 rounded-lg border cursor-pointer bg-white shadow-sm border-blue-200 group-hover:border-blue-300">
                    <div className="rounded-lg p-2 mr-3 bg-blue-100 text-blue-600">
                      <FiMessageSquare />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">AI Response</div>
                      <div className="text-xs text-gray-500">Generate with AI</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center p-3 rounded-lg border cursor-pointer bg-white shadow-sm border-purple-200 group-hover:border-purple-300">
                    <div className="rounded-lg p-2 mr-3 bg-purple-100 text-purple-600">
                      <FiGitBranch />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">AI Condition</div>
                      <div className="text-xs text-gray-500">Conditional AI logic</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg"
              >
                <FiPlus className="mr-2" />
                Add Custom Node
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 h-full flex flex-col" ref={reactFlowWrapper}>
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  <FiChevronLeft size={20} />
                </motion.button>
              )}
              
              <div>
                <h1 className="font-semibold text-gray-900">Customer Support Bot</h1>
                <p className="text-sm text-gray-500">Bot ID: {botId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-lg flex items-center"
                  >
                    <FiSave className="mr-1.5" /> Saved successfully!
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestBot}
                className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg flex items-center"
              >
                <FiPlay className="mr-2" /> Test Bot
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg flex items-center ${
                  isSaving ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <FiSave className="mr-2" />
                )}
                Save
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <FiSettings size={18} />
              </motion.button>
            </div>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            fitView
            className="bg-gray-50"
          >
            <Controls className="bg-white shadow-md rounded-lg border border-gray-200" />
            <MiniMap 
              className="bg-white shadow-md rounded-lg border border-gray-200" 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'start': return '#10B981';
                  case 'condition': return '#8B5CF6';
                  case 'code': return '#F59E0B';
                  case 'userInput': return '#6366F1';
                  default: return '#3B82F6';
                }
              }}
            />
            <Background color="#aaa" gap={20} />
            
            <Panel position="top-right" className="bg-white shadow-md rounded-lg p-2">
              <div className="text-sm font-medium text-gray-700">
                {nodes.length} nodes • {edges.length} connections
              </div>
            </Panel>
          </ReactFlow>
        </div>
        
        {/* Node Editor Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-6 top-24 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-20"
            >
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Edit {selectedNode.type === 'message' ? 'Message' : 
                          selectedNode.type === 'condition' ? 'Condition' : 
                          selectedNode.type === 'code' ? 'Code' : 
                          selectedNode.type === 'userInput' ? 'User Input' : 'Node'}
                  </h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeNodeEditor}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-5">
                {selectedNode.type === 'message' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Content
                    </label>
                    <textarea
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeData({ label: e.target.value })}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type your message here..."
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buttons (Optional)
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="text"
                            placeholder="Button text"
                            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
                          />
                          <button className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-200">
                            <FiPlus />
                          </button>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm">
                          <div className="flex justify-between">
                            <span>Contact Support</span>
                            <button className="text-red-500 hover:text-red-700">
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode.type === 'condition' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition Expression
                    </label>
                    <input
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeData({ label: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="e.g., user.plan === 'premium'"
                    />
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          True Branch Label
                        </label>
                        <input
                          value="Yes"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          False Branch Label
                        </label>
                        <input
                          value="No"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode.type === 'code' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      JavaScript Code
                    </label>
                    <textarea
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeData({ label: e.target.value })}
                      className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="// Write your code here..."
                    />
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={closeNodeEditor}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={closeNodeEditor}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ReactFlowProvider>
    </motion.div>
  );
};

export default BotBuilder;
