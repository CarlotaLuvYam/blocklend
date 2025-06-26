import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import LoanApplication from './components/LoanApplication';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apply" element={<LoanApplication />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
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