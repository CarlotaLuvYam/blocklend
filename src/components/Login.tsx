import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletLogin, setWalletLogin] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleWalletLogin = async () => {
    setError('');
    if (!account) {
      await connectWallet();
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: account })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Wallet login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l ${!walletLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setWalletLogin(false)}
        >
          Email Login
        </button>
        <button
          className={`px-4 py-2 rounded-r ${walletLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setWalletLogin(true)}
        >
          Wallet Login
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!walletLogin ? (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          <button
            onClick={handleWalletLogin}
            className="w-full bg-purple-600 text-white py-2 rounded mb-2"
          >
            {account ? `Login with ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      )}
      <div className="mt-4 text-center">
        Don't have an account?{' '}
        <button className="text-blue-600 underline" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
