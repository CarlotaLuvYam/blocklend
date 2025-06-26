import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  FileText,
  Calendar,
  CreditCard,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock loan data - in real app, this would come from blockchain/API
  const [loanData] = useState({
    currentLoan: {
      amount: 5000,
      balance: 3200,
      interestRate: 8.5,
      monthlyPayment: 456,
      nextPaymentDate: '2025-02-15',
      paymentsRemaining: 7,
      status: 'active'
    },
    loanHistory: [
      {
        id: 1,
        amount: 2500,
        status: 'completed',
        date: '2024-06-15',
        purpose: 'Business expansion'
      },
      {
        id: 2,
        amount: 5000,
        status: 'active',
        date: '2024-12-01',
        purpose: 'Equipment purchase'
      }
    ],
    paymentHistory: [
      {
        id: 1,
        amount: 456,
        date: '2025-01-15',
        status: 'completed',
        txHash: '0x742d35cc6bf3b4c4a4b8d4e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4'
      },
      {
        id: 2,
        amount: 456,
        date: '2024-12-15',
        status: 'completed',
        txHash: '0x852e46dd7cf4c5d5b5c9e5f5g6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5'
      }
    ]
  });

  useEffect(() => {
    if (!isAuthenticated || !isConnected) {
      navigate('/');
    }
  }, [isAuthenticated, isConnected, navigate]);

  if (!isAuthenticated || !isConnected) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateProgress = () => {
    const { amount, balance } = loanData.currentLoan;
    return ((amount - balance) / amount) * 100;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'loans', label: 'My Loans', icon: FileText },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Connected:</span>
                  <span className="text-sm font-medium">{formatAddress(account || '')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Loan</p>
                <p className="text-2xl font-bold text-gray-900">${loanData.currentLoan.amount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining Balance</p>
                <p className="text-2xl font-bold text-gray-900">${loanData.currentLoan.balance.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{calculateProgress().toFixed(1)}% paid</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-gray-900">${loanData.currentLoan.monthlyPayment}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Next: {loanData.currentLoan.nextPaymentDate}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900">{loanData.currentLoan.interestRate}%</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">{loanData.currentLoan.paymentsRemaining} payments left</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Loan Progress */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Progress</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Total Loan Amount</span>
                        <span className="font-medium">${loanData.currentLoan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Amount Paid</span>
                        <span className="font-medium text-green-600">
                          ${(loanData.currentLoan.amount - loanData.currentLoan.balance).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining Balance</span>
                        <span className="font-medium text-blue-600">${loanData.currentLoan.balance.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-sm text-gray-600">
                        {calculateProgress().toFixed(1)}% Complete
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                        Make Payment
                      </button>
                      <button 
                        onClick={() => navigate('/apply')}
                        className="w-full border border-gray-300 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                      >
                        Apply for New Loan
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                        Download Statements
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Payment Processed</p>
                        <p className="text-sm text-gray-600">$456 payment received on Jan 15, 2025</p>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Loan Statement Generated</p>
                        <p className="text-sm text-gray-600">Monthly statement for December 2024</p>
                      </div>
                      <span className="text-sm text-gray-500">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loans Tab */}
            {activeTab === 'loans' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">My Loans</h3>
                <div className="space-y-4">
                  {loanData.loanHistory.map((loan) => (
                    <div key={loan.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Loan #{loan.id}</h4>
                          <p className="text-sm text-gray-600">{loan.purpose}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          loan.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {loan.status}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Amount</span>
                          <div className="font-medium">${loan.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Date</span>
                          <div className="font-medium">{loan.date}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Status</span>
                          <div className="font-medium capitalize">{loan.status}</div>
                        </div>
                        <div>
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loanData.paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payment.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {formatAddress(payment.txHash)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {user?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {user?.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm">
                        {user?.address}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Type</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50 capitalize">
                        {user?.role}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Member Since</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-green-50 text-green-800 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;