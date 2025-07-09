// frontend/src/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BotBuilder from './pages/BotBuilder';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import AddFeature from './pages/AddFeature';
import DeveloperMode from './pages/DeveloperMode';
import Instructions from './pages/Instructions';

const AppRouter = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default AppRouter;
