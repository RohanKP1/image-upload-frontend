import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ClustersPage from './components/ClustersPage';

function App() {
  const [token, setToken] = useState(null);
  // Default to login page if not authenticated
  const [currentPage, setCurrentPage] = useState('login');
  // Use an explicit authMode so "login" is the default shown when not authenticated
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setCurrentPage('home');
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    // reset UI state
    setCurrentPage('login');
    setAuthMode('login');
  };

  // Custom setToken to also set currentPage to 'home' after login/signup
  const handleSetToken = (tok) => {
    setToken(tok);
    setCurrentPage('home');
  };

  if (!token) {
    return authMode === 'signup'
      ? <SignupPage setToken={handleSetToken} onSwitchToLogin={() => setAuthMode('login')} />
      : <LoginPage setToken={handleSetToken} onSwitchToSignup={() => setAuthMode('signup')} />;
  }

  return (
    <div className="App bg-gray-50 min-h-screen">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage token={token} />}
        {currentPage === 'clusters' && <ClustersPage token={token} />}
      </main>
    </div>
  );
}

export default App;
