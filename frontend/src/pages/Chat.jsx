// frontend/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiArrowLeft, FiTrash2, FiUser, FiBot, FiDownload, FiShare2 } from 'react-icons/fi';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botName] = useState('Customer Support Bot');
  const [userName] = useState('Anointing Omowumi');
  const messagesEndRef = useRef(null);

  // Initial bot greeting
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { 
          id: 1, 
          text: "Hello! I'm your customer support assistant. How can I help you today?", 
          sender: 'bot', 
          timestamp: new Date() 
        }
      ]);
    }, 500);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me check that for you.",
        "That's a great question! Here's what I can tell you...",
        "I can definitely help with that. First, could you provide more details?",
        "Thanks for sharing. Based on what you've said, I recommend...",
        "I've processed your request. Here are the next steps...",
        "I see. Let me guide you through the solution.",
        "Thanks for your patience. Here's the information you requested."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newBotMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setIsTyping(false);
    
    // Show new greeting after clearing
    setTimeout(() => {
      setMessages([
        { 
          id: 1, 
          text: "Hello again! How can I assist you today?", 
          sender: 'bot', 
          timestamp: new Date() 
        }
      ]);
    }, 300);
  };

  const exportChat = () => {
    const chatData = messages.map(msg => ({
      sender: msg.sender === 'user' ? userName : botName,
      text: msg.text,
      time: msg.timestamp.toLocaleTimeString()
    }));
    
    const json = JSON.stringify(chatData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName.replace(/\s+/g, '_')}_chat_history.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareChat = () => {
    if (navigator.share) {
      navigator.share({
        title: `Chat with ${botName}`,
        text: 'Check out this conversation I had with my chatbot!',
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 mr-2"
            onClick={() => window.history.back()}
          >
            <FiArrowLeft size={20} />
          </motion.button>
          
          <div className="flex-1 flex items-center">
            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IB</span>
            </div>
            <div className="ml-3">
              <h1 className="font-bold text-gray-900">{botName}</h1>
              <p className="text-xs text-gray-600">Testing conversation flow</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={shareChat}
              title="Share chat"
            >
              <FiShare2 size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={exportChat}
              title="Export chat"
            >
              <FiDownload size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
              onClick={clearChat}
              title="Clear chat"
            >
              <FiTrash2 size={18} />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 md:px-8 md:py-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-1 p-1 rounded-full ${message.sender === 'user' ? 'bg-indigo-700' : 'bg-gray-100'}`}>
                    {message.sender === 'user' ? (
                      <FiUser className="text-white" size={14} />
                    ) : (
                      <FiBot className="text-indigo-600" size={14} />
                    )}
                  </div>
                  <div>
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex mb-4 justify-start"
            >
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex items-center">
                  <div className="mr-3 p-1 rounded-full bg-gray-100">
                    <FiBot className="text-indigo-600" size={14} />
                  </div>
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse", delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse", delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end bg-gray-100 rounded-2xl px-4 py-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32"
              rows={1}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`ml-3 p-3 rounded-full ${
                inputValue.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <FiSend size={18} />
            </motion.button>
          </div>
          
          <div className="mt-3 text-center text-xs text-gray-500">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
