// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, 
  FiArrowLeft, 
  FiSettings, 
  FiRefreshCw,
  FiTrash2,
  FiUser,
  FiZap
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const Chat = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hello! I'm your customer support bot. How can I help you today?", sender: 'bot', timestamp: new Date(Date.now() - 300000) },
    { id: 2, text: "I'm having trouble with my account login", sender: 'user', timestamp: new Date(Date.now() - 240000) },
    { id: 3, text: "I'm sorry to hear that. Could you please tell me your email address associated with the account?", sender: 'bot', timestamp: new Date(Date.now() - 180000) },
    { id: 4, text: "example@email.com", sender: 'user', timestamp: new Date(Date.now() - 120000) },
    { id: 5, text: "Thank you! I see the issue. Your account requires verification. Would you like me to resend the verification email?", sender: 'bot', timestamp: new Date(Date.now() - 60000) },
  ]);
  
  const botNames = {
    '1': 'Customer Support Bot',
    '2': 'Sales Assistant',
    '3': 'HR Onboarding',
    '4': 'IT Helpdesk'
  };
  
  const botName = botNames[botId] || 'Intellibotic Assistant';

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: chatHistory.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me check that for you.",
        "Thanks for providing that information. Here's what I found...",
        "That's a great question! Based on your account details...",
        "I can definitely help with that. Here are my recommendations...",
        "I've processed your request. The next step would be..."
      ];
      
      const botResponse = {
        id: chatHistory.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setIsClearing(true);
    
    // Animation while clearing
    setTimeout(() => {
      setChatHistory([]);
      setIsClearing(false);
    }, 500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, x: -50 }
  };

  const typingVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 } 
    }
  };

  const dotVariants = {
    hidden: { opacity: 0.2, y: 0 },
    visible: { 
      opacity: 1, 
      y: -5,
      transition: { 
        yoyo: Infinity,
        duration: 0.6,
        ease: "easeInOut"
      } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-gray-100"
    >
      {/* Chat Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm py-4 px-6 flex items-center justify-between"
      >
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-4"
          >
            <FiArrowLeft size={20} />
          </motion.button>
          
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
              <FiZap size={20} />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{botName}</h1>
              <p className="text-sm text-gray-500">Testing in real-time</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearChat}
            disabled={isClearing}
            className={`p-2 rounded-lg text-gray-600 hover:bg-gray-100 ${
              isClearing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isClearing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5"
              >
                <FiRefreshCw />
              </motion.div>
            ) : (
              <FiTrash2 size={18} />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/builder/${botId}`)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <FiSettings size={18} />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {isClearing ? (
              <motion.div
                key="clearing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6"
                >
                  <FiRefreshCw size={24} />
                </motion.div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Clearing conversation</h3>
                <p className="text-gray-600">Starting fresh in a moment...</p>
              </motion.div>
            ) : (
              <>
                {chatHistory.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center py-20"
                  >
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl mb-6">
                      <FiZap size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Test Your Chatbot</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      Start a conversation with {botName} to test its responses. Type a message below to begin.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMessage("Hello!")}
                      className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg"
                    >
                      Say Hello
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {chatHistory.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        custom={index}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl p-4 relative ${
                            msg.sender === 'user' 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : 'bg-white border border-gray-200 shadow-sm rounded-bl-none'
                          }`}
                        >
                          <div className="flex items-start">
                            {msg.sender === 'bot' && (
                              <div className="mr-2 mt-0.5">
                                <div className="bg-blue-100 text-blue-600 p-1 rounded">
                                  <FiZap size={14} />
                                </div>
                              </div>
                            )}
                            <div>
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              <div 
                                className={`text-xs mt-1.5 ${
                                  msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Message triangle */}
                          <div 
                            className={`absolute bottom-0 ${
                              msg.sender === 'user' 
                                ? '-right-1.5 w-3 h-3 bg-blue-600' 
                                : '-left-1.5 w-3 h-3 bg-white border-l border-b border-gray-200'
                            }`}
                            style={{ 
                              clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
                              transform: msg.sender === 'user' ? 'rotate(270deg)' : 'rotate(180deg)'
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none p-4">
                            <div className="flex items-center">
                              <div className="bg-blue-100 text-blue-600 p-1 rounded mr-2">
                                <FiZap size={14} />
                              </div>
                              <motion.div
                                variants={typingVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex space-x-1"
                              >
                                <motion.span 
                                  variants={dotVariants}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.span 
                                  variants={dotVariants}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.span 
                                  variants={dotVariants}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end bg-white rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${botName}...`}
              className="flex-1 py-3 px-4 resize-none border-0 focus:ring-0 rounded-l-xl max-h-32"
              rows={1}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`m-2 p-2 rounded-lg ${
                message.trim() 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiSend size={20} />
            </motion.button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Press ⏎ Enter to send • Press ⇧ Shift + ⏎ Enter for new line
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
