import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Shield,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app, this would come from blockchain/API
  const [dashboardStats] = useState({
    totalLoans: 1247,
    totalValue: 2400000,
    activeLoans: 892,
    defaultRate: 2.1,
    approvalRate: 87.5,
    avgProcessingTime: 2.3
  });

  const [loanApplications] = useState([
    {
      id: 1,
      applicantName: 'John Smith',
      email: 'john@example.com',
      walletAddress: '0x742d35cc6bf3b4c4a4b8d4e4f5a6b7c8d9e0f1a2',
      amount: 5000,
      purpose: 'Business expansion',
      status: 'pending',
      aiScore: 85,
      submittedAt: '2025-01-15T10:30:00Z',
      monthlyIncome: 4500,
      creditScore: 720
    },
    {
      id: 2,
      applicantName: 'Sarah Johnson',
      email: 'sarah@example.com',
      walletAddress: '0x852e46dd7cf4c5d5b5c9e5f5g6b7c8d9e0f1a2b3',
      amount: 3000,
      purpose: 'Equipment purchase',
      status: 'approved',
      aiScore: 92,
      submittedAt: '2025-01-14T15:45:00Z',
      monthlyIncome: 5200,
      creditScore: 780
    },
    {
      id: 3,
      applicantName: 'Mike Davis',
      email: 'mike@example.com',
      walletAddress: '0x963f57ee8df5d6e6c6d0f6g6h7c8d9e0f1a2b3c4',
      amount: 8000,
      purpose: 'Debt consolidation',
      status: 'rejected',
      aiScore: 45,
      submittedAt: '2025-01-13T09:15:00Z',
      monthlyIncome: 2800,
      creditScore: 580
    }
  ]);

  const [activeLoans] = useState([
    {
      id: 1,
      borrowerName: 'Alice Brown',
      walletAddress: '0xa74e68ff9gf6e7f7d7e1g7h7i8d9e0f1a2b3c4d5',
      amount: 4500,
      balance: 2800,
      monthlyPayment: 425,
      nextPayment: '2025-02-15',
      status: 'current',
      paymentsRemaining: 7
    },
    {
      id: 2,
      borrowerName: 'Bob Wilson',
      walletAddress: '0xb85f79gga0g7f8g8e8f2h8i8j9e0f1a2b3c4d5e6',
      amount: 6000,
      balance: 5200,
      monthlyPayment: 580,
      nextPayment: '2025-02-20',
      status: 'late',
      paymentsRemaining: 9
    }
  ]);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
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
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplicationAction = (applicationId: number, action: 'approve' | 'reject') => {
    // In real app, this would update the blockchain/database
    console.log(`${action} application ${applicationId}`);
  };

  const filteredApplications = loanApplications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'loans', label: 'Active Loans', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage loans and monitor platform performance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Administrator</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalLoans.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${(dashboardStats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeLoans.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Default Rate</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.defaultRate}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.approvalRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgProcessingTime}min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
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
                  {/* Recent Applications */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                      {loanApplications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div>
                            <p className="font-medium text-gray-900">{app.applicantName}</p>
                            <p className="text-sm text-gray-600">${app.amount.toLocaleString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Blockchain Network</span>
                        </div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">AI Assessment Engine</span>
                        </div>
                        <span className="text-sm text-green-600">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Smart Contracts</span>
                        </div>
                        <span className="text-sm text-green-600">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Loan Applications</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applicant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AI Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((app) => (
                        <tr key={app.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                              <div className="text-sm text-gray-500">{app.email}</div>
                              <div className="text-xs text-gray-400 font-mono">{formatAddress(app.walletAddress)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${app.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{app.aiScore}</div>
                              <div className={`ml-2 w-16 h-2 rounded-full ${
                                app.aiScore >= 80 ? 'bg-green-200' : app.aiScore >= 60 ? 'bg-yellow-200' : 'bg-red-200'
                              }`}>
                                <div 
                                  className={`h-2 rounded-full ${
                                    app.aiScore >= 80 ? 'bg-green-500' : app.aiScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${app.aiScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {app.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApplicationAction(app.id, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleApplicationAction(app.id, 'reject')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Active Loans Tab */}
            {activeTab === 'loans' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Active Loans</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Borrower
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Next Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeLoans.map((loan) => (
                        <tr key={loan.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{loan.borrowerName}</div>
                              <div className="text-xs text-gray-400 font-mono">{formatAddress(loan.walletAddress)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${loan.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${loan.balance.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${loan.monthlyPayment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.nextPayment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Loan Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Loans Issued</span>
                        <span className="font-semibold">{dashboardStats.totalLoans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-semibold text-green-600">{(100 - dashboardStats.defaultRate).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Loan Size</span>
                        <span className="font-semibold">${Math.round(dashboardStats.totalValue / dashboardStats.totalLoans).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approval Accuracy</span>
                        <span className="font-semibold text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Speed</span>
                        <span className="font-semibold">{dashboardStats.avgProcessingTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">False Positives</span>
                        <span className="font-semibold text-yellow-600">3.1%</span>
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

export default AdminPanel;