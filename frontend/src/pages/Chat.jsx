// frontend/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiSend, FiArrowLeft, FiLoader, FiTrash2, FiMessageSquare } from 'react-icons/fi';

const Chat = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [botName, setBotName] = useState('ChatBot');
  const [botAvatar, setBotAvatar] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch bot details
  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/bots/${botId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBotName(response.data.name);
        setBotAvatar(response.data.config?.avatar || '');
      } catch (error) {
        console.error('Error fetching bot details:', error);
      }
    };
    
    fetchBotDetails();
  }, [botId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);
    
    try {
      // In a real app, this would call the bot's API
      // For now, simulate a response with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate bot response
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsSending(false);
    }
  };

  // Simple bot response generation
  const generateBotResponse = (input) => {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('hello') || inputLower.includes('hi')) {
      return "Hello there! How can I assist you today?";
    }
    
    if (inputLower.includes('how are you')) {
      return "I'm just a bot, but I'm functioning perfectly! How can I help you?";
    }
    
    if (inputLower.includes('thank')) {
      return "You're welcome! Is there anything else I can help with?";
    }
    
    if (inputLower.includes('bye') || inputLower.includes('goodbye')) {
      return "Goodbye! Feel free to chat again anytime.";
    }
    
    const responses = [
      "That's interesting! Can you tell me more?",
      "I understand. How else can I assist you?",
      "Thanks for sharing that information.",
      "I'm here to help with any questions you have.",
      "Could you clarify that for me?",
      "I'm still learning, but I'll do my best to help!",
      "That's a great point. What would you like to do next?",
      "I've noted your input. Is there anything specific you need help with?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm py-4 px-6 flex items-center justify-between"
      >
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </motion.button>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-3">
              {botAvatar ? (
                <img 
                  src={botAvatar} 
                  alt={botName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FiMessageSquare size={20} />
              )}
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">{botName}</h1>
              <p className="text-xs text-gray-500">Testing Mode</p>
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearChat}
          className="flex items-center text-red-500 hover:text-red-600"
        >
          <FiTrash2 className="mr-1" />
          Clear Chat
        </motion.button>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full mb-6">
                  <FiMessageSquare className="text-white text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Start a Conversation</h2>
                <p className="text-gray-600 max-w-md">
                  Send a message to test {botName}. Try asking a question or saying hello!
                </p>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: message.sender === 'user' ? 50 : -50 }}
                  transition={{ duration: 0.3 }}
                  className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="mr-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                        {botAvatar ? (
                          <img 
                            src={botAvatar} 
                            alt={botName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <FiMessageSquare size={16} />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] md:max-w-[70%]`}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </motion.div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="ml-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium text-gray-700">U</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-t border-gray-200 py-4 px-4"
      >
        <div className="max-w-3xl mx-auto flex">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent border-none resize-none transition-all"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '150px' }}
            />
            
            <div className="absolute right-3 bottom-3 flex items-center">
              {isSending && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"
                />
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                className={`p-2 rounded-full ${
                  inputText.trim() && !isSending
                    ? 'bg-primary text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiSend size={18} />
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-2 text-center">
          <p className="text-xs text-gray-500">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
