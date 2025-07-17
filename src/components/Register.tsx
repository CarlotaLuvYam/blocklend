import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [walletRegister, setWalletRegister] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
      });
      const data = await res.json();
      if (res.ok) {
        login(data, ''); // No token from backend
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleWalletRegister = async () => {
  setError('');
  if (!account) {
    await connectWallet();
  }
  try {
    const data = await registerUser({ walletAddress: account ?? undefined, firstName, lastName });
    login(data, data.token);
    navigate('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Wallet registration failed');
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {firstName && (
        <div className="text-green-600 text-center mb-2">Welcome, {firstName}!</div>
      )}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l ${!walletRegister ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setWalletRegister(false)}
        >
          Email Register
        </button>
        <button
          className={`px-4 py-2 rounded-r ${walletRegister ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setWalletRegister(true)}
        >
          Wallet Register
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!walletRegister ? (
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          <button
            onClick={handleWalletRegister}
            className="w-full bg-purple-600 text-white py-2 rounded mb-2"
          >
            {account ? `Register with ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      )}
      <div className="mt-4 text-center">
        Already have an account?{' '}
        <button className="text-blue-600 underline" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
