import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';


function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
