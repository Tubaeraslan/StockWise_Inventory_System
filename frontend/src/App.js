import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';


function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    if (showRegister) {
      return <Register onRegister={() => setShowRegister(false)} onGoToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={setUser} onGoToRegister={() => setShowRegister(true)} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
