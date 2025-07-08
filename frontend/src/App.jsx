// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BotBuilder from './pages/BotBuilder';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import AddFeature from './pages/AddFeature';
import DeveloperMode from './pages/DeveloperMode';
import Instructions from './pages/Instructions';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-grow p-4 md:p-8"
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:botId" element={<BotBuilder />} />
          <Route path="/chat/:botId" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-feature" element={<AddFeature />} />
          <Route path="/dev-mode" element={<DeveloperMode />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </motion.div>
    </div>
  );
}

export default App;
