import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ReactFlowProvider,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel
} from '@reactflow/core';
import '@reactflow/core/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import { FiSave, FiMessageSquare, FiCode, FiGitBranch, FiChevronRight, FiX, FiPlus, FiTrash2, FiSettings, FiPlay } from 'react-icons/fi';

// Custom Node Types
const MessageNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-primary">
    <div className="flex items-center">
      <FiMessageSquare className="mr-2 text-primary" />
      <div className="text-xs font-bold text-primary">Message</div>
    </div>
    <div className="mt-1 text-sm">{data.label || 'Send message'}</div>
  </div>
);

const ConditionNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-secondary">
    <div className="flex items-center">
      <FiGitBranch className="mr-2 text-secondary" />
      <div className="text-xs font-bold text-secondary">Condition</div>
    </div>
    <div className="mt-1 text-sm">{data.label || 'Check condition'}</div>
  </div>
);

const CodeNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-accent">
    <div className="flex items-center">
      <FiCode className="mr-2 text-accent" />
      <div className="text-xs font-bold text-accent">Code</div>
    </div>
    <div className="mt-1 text-sm">{data.label || 'Run code'}</div>
  </div>
);

const nodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  code: CodeNode
};

const BotBuilder = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [botName, setBotName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Fetch bot data
  useEffect(() => {
    const fetchBot = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/bots/${botId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBotName(response.data.name);
        
        // Initialize nodes and edges from bot config
        if (response.data.config?.nodes) {
          setNodes(response.data.config.nodes);
        }
        if (response.data.config?.edges) {
          setEdges(response.data.config.edges);
        }
      } catch (error) {
        console.error('Error fetching bot:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBot();
  }, [botId]);
  
  // Save bot configuration
  const saveBot = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bots/${botId}`, {
        config: { nodes, edges }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show success feedback
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Error saving bot:', error);
      setIsSaving(false);
      return false;
    }
  };
  
  // Handle node drag from sidebar
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  // Handle node drop on canvas
  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    const type = event.dataTransfer.getData('application/reactflow');
    const position = { x: event.clientX, y: event.clientY };
    
    // Create new node
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        content: ''
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);
  
  // Handle edge creation
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);
  
  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter(node => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter(edge => 
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    setSelectedNode(null);
  };
  
  // Node click handler
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && !event.target.closest('.node-sidebar') && !event.target.closest('.sidebar-toggle')) {
        setShowSidebar(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Toggle */}
      <motion.button
        whileHover={{ x: showSidebar ? 0 : 5 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-4 left-4 z-10 p-2 rounded-full bg-white shadow-lg sidebar-toggle ${
          showSidebar ? 'text-primary' : 'text-gray-600'
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <FiChevronRight
          className={`transition-transform ${showSidebar ? 'rotate-180' : ''}`}
          size={20}
        />
      </motion.button>

      {/* Node Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: showSidebar ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25 }}
        className="absolute md:relative z-20 h-full w-64 bg-white shadow-xl node-sidebar"
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Bot Builder</h2>
          <p className="text-sm text-gray-600 truncate">{botName}</p>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Nodes</h3>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-3"
          >
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'message')}
              className="flex items-center p-3 bg-primary/10 border border-primary/30 rounded-lg cursor-grab"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <FiMessageSquare className="text-primary" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Message</div>
                <div className="text-xs text-gray-500">Send a message to user</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-3"
          >
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'condition')}
              className="flex items-center p-3 bg-secondary/10 border border-secondary/30 rounded-lg cursor-grab"
            >
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                <FiGitBranch className="text-secondary" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Condition</div>
                <div className="text-xs text-gray-500">Branch based on conditions</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
          >
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'code')}
              className="flex items-center p-3 bg-accent/10 border border-accent/30 rounded-lg cursor-grab"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                <FiCode className="text-accent" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Code</div>
                <div className="text-xs text-gray-500">Run custom JavaScript</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Node Settings</h3>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={16} />
              </button>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  setNodes((nds) => nds.map((node) => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, label: e.target.value } } 
                      : node
                  ));
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, label: e.target.value }
                  });
                }}
                className="input-field"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Content</label>
              <textarea
                rows={3}
                value={selectedNode.data.content || ''}
                onChange={(e) => {
                  setNodes((nds) => nds.map((node) => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, content: e.target.value } } 
                      : node
                  ));
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, content: e.target.value }
                  });
                }}
                className="input-field"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={deleteSelectedNode}
              className="w-full flex items-center justify-center py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              <FiTrash2 className="mr-2" />
              Delete Node
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Main Flow Area */}
      <div className="flex-1 h-full">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap />
            
            {/* Top Panel */}
            <Panel position="top-right" className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3">
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveBot}
                  className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
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
                      Save
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/chat/${botId}`)}
                  className="flex items-center bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg"
                >
                  <FiPlay className="mr-2" />
                  Test Chat
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/settings?botId=${botId}`)}
                  className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  <FiSettings className="mr-2" />
                  Settings
                </motion.button>
              </div>
            </Panel>
            
            {/* Help Panel */}
            <Panel position="bottom-left" className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3 text-sm">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                    <span className="mr-3">Message</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-1"></div>
                    <span className="mr-3">Condition</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
                    <span>Code</span>
                  </div>
                </div>
                <div>
                  <p>Drag nodes from sidebar • Click to select • Connect nodes</p>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default BotBuilder;
