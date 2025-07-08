// src/components/ChatInterface.jsx
import { useState } from 'react';
import axios from 'axios';

export default function ChatInterface({ botId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      const res = await axios.post(`/api/chat/${botId}`, {
        message: input
      });
      
      setMessages(prev => [
        ...prev, 
        { text: res.data.response, sender: 'bot' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { text: "Error processing request", sender: 'bot' }
      ]);
    }
  };

  return (
    <div className="chat-container">
      {/* Message display */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
