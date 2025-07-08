import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MiniMap,
  useReactFlow,
  Panel
} from 'reactflow';

import 'reactflow/dist/style.css';  // ✅ Only this CSS is needed

import { motion } from 'framer-motion';
import {
  FiSave,
  FiX,
  FiMessageSquare,
  FiHelpCircle,
  FiCode,
  FiZap,
  FiSettings,
  FiChevronLeft,
  FiPlus
} from 'react-icons/fi';

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const nodeTypes = {
  message: MessageNode,
  question: QuestionNode,
  aiFunction: AiFunctionNode,
  custom: CustomNode,
};

const initialNodes = [];
const initialEdges = [];

// Custom Node Components
function MessageNode({ data }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-blue-500 w-64"
    >
      <div className="flex items-start">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-100 mr-3">
          <FiMessageSquare className="text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Send Message</div>
          <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">{data.content || "Enter your message..."}</div>
        </div>
      </div>
    </motion.div>
  );
}

function QuestionNode({ data }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-green-500 w-64"
    >
      <div className="flex items-start">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 mr-3">
          <FiHelpCircle className="text-green-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Ask Question</div>
          <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">{data.question || "Enter your question..."}</div>
          <div className="mt-2">
            {data.options?.map((opt, i) => (
              <div key={i} className="text-xs bg-blue-50 rounded px-2 py-1 mb-1">{opt}</div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AiFunctionNode({ data }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-purple-500 w-64"
    >
      <div className="flex items-start">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-purple-100 mr-3">
          <FiZap className="text-purple-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">AI Function</div>
          <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">{data.function || "Select function..."}</div>
        </div>
      </div>
    </motion.div>
  );
}

function CustomNode({ data }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-yellow-500 w-64"
    >
      <div className="flex items-start">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-yellow-100 mr-3">
          <FiCode className="text-yellow-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Custom Node</div>
          <div className="text-xs text-gray-600">{data.name}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Sidebar with node types
const nodeTypesList = [
  { type: 'message', label: 'Message', icon: FiMessageSquare, color: 'bg-blue-100 text-blue-600' },
  { type: 'question', label: 'Question', icon: FiHelpCircle, color: 'bg-green-100 text-green-600' },
  { type: 'aiFunction', label: 'AI Function', icon: FiZap, color: 'bg-purple-100 text-purple-600' },
  { type: 'custom', label: 'Custom Node', icon: FiCode, color: 'bg-yellow-100 text-yellow-600' },
];

const BotBuilder = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [botName, setBotName] = useState('Untitled Bot');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { setViewport } = useReactFlow();

  // Fetch bot data on mount
  useEffect(() => {
    const fetchBot = async () => {
      try {
        // In a real app, we would fetch from the backend
        // const response = await fetch(`/api/bots/${botId}`);
        // const botData = await response.json();
        
        // Mock data for now
        const botData = {
          id: botId,
          name: 'Customer Support Bot',
          flow_data: {
            nodes: [
              { id: '1', type: 'message', position: { x: 0, y: 0 }, data: { content: 'Hello! How can I help you today?' } },
              { id: '2', type: 'question', position: { x: 300, y: 0 }, data: { 
                question: 'What do you need help with?', 
                options: ['Account Issue', 'Billing', 'Technical Problem', 'Other'] 
              } },
              { id: '3', type: 'message', position: { x: 600, y: -100 }, data: { content: 'Let me transfer you to our account specialist.' } },
              { id: '4', type: 'message', position: { x: 600, y: 100 }, data: { content: 'I can help with billing questions.' } },
              { id: '5', type: 'aiFunction', position: { x: 900, y: 0 }, data: { function: 'Check Account Status' } },
            ],
            edges: [
              { id: 'e1-2', source: '1', target: '2' },
              { id: 'e2-3', source: '2', target: '3', sourceHandle: 'Account Issue' },
              { id: 'e2-4', source: '2', target: '4', sourceHandle: 'Billing' },
              { id: 'e4-5', source: '4', target: '5' },
            ],
            viewport: { x: 0, y: 0, zoom: 1 }
          }
        };
        
        setBotName(botData.name);
        setNodes(botData.flow_data.nodes || []);
        setEdges(botData.flow_data.edges || []);
        setViewport(botData.flow_data.viewport || { x: 0, y: 0, zoom: 1 });
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load bot');
        console.error(error);
        navigate('/dashboard');
      }
    };

    fetchBot();
  }, [botId, navigate, setNodes, setEdges, setViewport]);

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

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('label');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX,
        y: event.clientY,
      };
      
      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get current viewport
      const viewport = { x: 0, y: 0, zoom: 1 }; // We would actually get this from reactflow instance
      
      // Prepare data
      const flowData = {
        nodes,
        edges,
        viewport
      };
      
      // In a real app, we would send to backend
      // await fetch(`/api/bots/${botId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ flow_data: flowData })
      // });
      
      toast.success('Bot saved successfully!');
    } catch (error) {
      toast.error('Failed to save bot');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleCloseNodeEditor = () => {
    setSelectedNode(null);
  };

  const updateNodeContent = (content) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          node.data = { ...node.data, content };
        }
        return node;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-indigo-600 border-r-2 border-b-2 border-gray-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            onClick={() => navigate('/dashboard')}
          >
            <FiChevronLeft className="mr-1" /> Dashboard
          </motion.button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-sm mr-3">Editing</span>
            {botName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg px-4 py-2"
            onClick={() => navigate(`/chat/${botId}`)}
          >
            Test Bot
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 flex items-center"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Save
              </>
            )}
          </motion.button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          {/* Sidebar */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 250 }}
            className="bg-white border-r flex flex-col h-full"
          >
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">Node Library</h2>
              <p className="text-xs text-gray-500 mt-1">Drag nodes onto the canvas</p>
            </div>
            <div className="overflow-y-auto flex-1 p-3">
              {nodeTypesList.map((nodeType) => (
                <motion.div
                  key={nodeType.type}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/reactflow', nodeType.type);
                    event.dataTransfer.setData('label', nodeType.label);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  className={`p-3 mb-3 rounded-lg cursor-grab border border-gray-200 hover:shadow-md flex items-center ${nodeType.color}`}
                >
                  <nodeType.icon className="mr-3" size={18} />
                  <span className="text-sm font-medium">{nodeType.label}</span>
                </motion.div>
              ))}
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Recently Used</h3>
                <div className="space-y-2">
                  {nodes.slice(0, 3).map((node, i) => (
                    <div key={i} className="text-xs bg-gray-100 rounded px-3 py-2">
                      {node.type} node
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Flow Area */}
          <div className="flex-1 h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              onDragOver={onDragOver}
              onDrop={onDrop}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls className="bg-white shadow-md rounded-lg" />
              <Background color="#aaa" gap={16} />
              <Panel position="top-right" className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-2">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Undo</button>
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Redo</button>
                  <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-sm">
                    Auto Layout
                  </button>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {/* Node Editor Panel */}
          {selectedNode && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg z-10"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Node Settings</h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseNodeEditor}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </motion.button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Node Type</label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                  </div>
                </div>
                
                {selectedNode.type === 'message' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                    <textarea
                      value={selectedNode.data.content || ''}
                      onChange={(e) => updateNodeContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm h-32"
                      placeholder="Enter your message..."
                    />
                  </div>
                )}
                
                {selectedNode.type === 'question' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={selectedNode.data.question || ''}
                        onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? {...n, data: {...n.data, question: e.target.value}} : n))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="Enter your question..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                      <div className="space-y-2">
                        {selectedNode.data.options?.map((opt, i) => (
                          <div key={i} className="flex items-center">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...selectedNode.data.options];
                                newOptions[i] = e.target.value;
                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {...n, data: {...n.data, options: newOptions}} : n));
                              }}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button 
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newOptions = [...selectedNode.data.options];
                                newOptions.splice(i, 1);
                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {...n, data: {...n.data, options: newOptions}} : n));
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button 
                          className="text-indigo-600 text-sm flex items-center"
                          onClick={() => {
                            const newOptions = [...(selectedNode.data.options || []), `Option ${(selectedNode.data.options?.length || 0) + 1}`];
                            setNodes(nds => nds.map(n => n.id === selectedNode.id ? {...n, data: {...n.data, options: newOptions}} : n));
                          }}
                        >
                          <FiPlus className="mr-1" /> Add Option
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Delay before sending</span>
                      <select className="border rounded px-2 py-1 text-sm">
                        <option>0 seconds</option>
                        <option>1 second</option>
                        <option>2 seconds</option>
                        <option>5 seconds</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Save response to variable</span>
                      <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default BotBuilder;
