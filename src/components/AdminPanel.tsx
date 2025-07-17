import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff } from 'react-feather';

interface LoanApplication {
  id: string;
  applicantName: string;
  email: string;
  walletAddress: string;
  amount: number;
  creditScore: number;
  status: string;
  // Additional fields for active loans table
  borrowerName?: string;
  balance?: number;
  monthlyPayment?: number;
  nextPayment?: string;
}

const formatAddress = (address: string): string => {
  return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
    case 'current':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
    case 'late':
      return 'bg-red-100 text-red-800';
    default:
      return '';
  }
};

import { useAuth } from '../context/AuthContext';
const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  // Only keep relevant state for backend-connected loan applications
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Best filter for 'active' loans: include loans with status 'approved' or 'current'

  // Dashboard statistics
  const dashboardStats = {
    totalLoans: loanApplications.length,
    totalValue: loanApplications.reduce((sum, loan) => sum + (loan.amount || 0), 0),
    defaultRate: 5.8, // TODO: Replace with actual calculation if available
    avgProcessingTime: 3.2 // TODO: Replace with actual calculation if available
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/loan-applications')
      .then(res => res.json())
      .then(data => setLoanApplications(data))
      .catch(err => console.error('Failed to fetch loan applications', err));
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:5000/api/loan-applications/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setLoanApplications(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status: 'approved' } : app
          )
        );
      }
    } catch (err) {
      alert('Failed to approve application.');
    }
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:5000/api/loan-applications/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setLoanApplications(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status: 'rejected' } : app
          )
        );
      }
    } catch (err) {
      alert('Failed to reject application.');
    }
    setActionLoading(null);
  };

  // --- Admin login state and handlers ---
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fillDummyCredentials = () => {
    setLoginForm({ email: 'admin@example.com', password: 'admin123' });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const adminCredentials = { email: 'admin@example.com', password: 'admin123' };
    if (
      loginForm.email === adminCredentials.email &&
      loginForm.password === adminCredentials.password
    ) {
      setShowLogin(false);
    } else {
      alert('Invalid credentials! Use admin@example.com / admin123');
    }
    setIsLoading(false);
  };


  // Show login card if not authenticated as admin
  if (showLogin) {
    // (No logout button needed on login screen)

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Admin Login</h2>
            <p className="text-blue-600">Sign in to access the admin panel</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <button
              onClick={fillDummyCredentials}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Click to auto-fill
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-blue-700"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 pt-24 relative">
      {/* Logout Button - visible and spaced below header */}
      <div className="flex justify-end mt-8 mb-4">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-900">{dashboardStats.totalLoans}</div>
            <div className="text-base text-blue-600">Total Loans</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-900">${dashboardStats.totalValue.toLocaleString()}</div>
            <div className="text-base text-blue-600">Total Value</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-900">{dashboardStats.defaultRate}%</div>
            <div className="text-base text-blue-600">Default Rate</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-900">{dashboardStats.avgProcessingTime} days</div>
            <div className="text-base text-blue-600">Avg. Processing Time</div>
          </div>
        </div>

        {/* Loan Applications Table */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Loan Applications</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {loanApplications.map(app => (
                <tr key={app.id}>
                  <td className="px-4 py-2 text-blue-900 font-semibold">{app.applicantName}</td>
                  <td className="px-4 py-2">{app.email}</td>
                  <td className="px-4 py-2 font-mono">{formatAddress(app.walletAddress)}</td>
                  <td className="px-4 py-2">${app.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{app.creditScore}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(app.status)}`}>{app.status}</span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-xs font-semibold disabled:opacity-50"
                      disabled={app.status === 'approved' || actionLoading === app.id}
                      onClick={() => handleApprove(app.id)}
                    >
                      {actionLoading === app.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-xs font-semibold disabled:opacity-50"
                      disabled={app.status === 'rejected' || actionLoading === app.id}
                      onClick={() => handleReject(app.id)}
                    >
                      {actionLoading === app.id ? 'Processing...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ...inside the main admin panel render (after login)
  // Add this logout button to the top right or header of the admin panel UI
  // Example:
  // <button onClick={() => { logout(); navigate('/'); }} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>

export default AdminPanel;