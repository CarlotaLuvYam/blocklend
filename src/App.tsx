import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import LoanApplication from './components/LoanApplication';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Header />
        <nav className="flex justify-end space-x-4 p-4">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
              <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
            </>
          )}
          {isAuthenticated && (
            <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply" element={<LoanApplication />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Web3Provider>
  );
}

const HomePage = () => (
  <>
    <Hero />
    <Features />
    <HowItWorks />
  </>
);

export default App;