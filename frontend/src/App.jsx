// frontend/src/App.jsx
import React from 'react';
import AppRouter from './Router';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;
