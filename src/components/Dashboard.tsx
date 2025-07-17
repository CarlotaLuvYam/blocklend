import { useState, useEffect } from 'react';
import { BrowserProvider, parseEther } from 'ethers';

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
  const [showLoanModal, setShowLoanModal] = useState(false);
const [selectedLoan] = useState<any>(null);
const [showStatementModal, setShowStatementModal] = useState(false);
  const [statementPeriod, setStatementPeriod] = useState('monthly');
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');

  // Real loan data from backend
  const [loanData, setLoanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    fetch('/api/loans/user/loans', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData?.message || 'Failed to fetch loans');
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Loan data:', data);
        setLoanData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not load loans');
        setLoading(false);
        console.error('Loan fetch error:', err);
      });
  }, [isAuthenticated, token, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !isConnected) {
      navigate('/');
    }
  }, [isAuthenticated, isConnected, navigate]);

  if (!isAuthenticated || !isConnected) {
    return null;
  }
  if (loading) {
    return <div className="text-center mt-10">Loading loans...</div>;
  }
  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
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
                      <button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isConnected}
                        onClick={async () => {
                          if (!isConnected) {
                            alert('Please connect your wallet to make a payment.');
                            return;
                          }
                          try {
                            if (!window.ethereum) {
                              alert('MetaMask is not installed!');
                              return;
                            }
                            const provider = new BrowserProvider(window.ethereum);
                            await provider.send('eth_requestAccounts', []);
                            const signer = await provider.getSigner();
                            // Replace with your contract or recipient address
                            const address = await signer.getAddress();
                            const tx = await signer.sendTransaction({
                              to: address,
                              value: parseEther('0.1')
                            });
                            await tx.wait();
                            alert('Payment successful!');
                          } catch (err: any) {
                            alert(err.message || 'Payment failed or cancelled.');
                          }
                        }}
                      >
                        Make Payment
                      </button>
                      <button 
                        onClick={() => navigate('/apply')}
                        className="w-full border border-gray-300 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                      >
                        Apply for New Loan
                      </button>
                      <button
                        className="w-full border border-gray-300 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        onClick={() => setShowStatementModal(true)}
                      >
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
                  {loanData.loanHistory.map((loan: any) => (
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
                          <span className="text-gray-600">Interest Rate</span>
                          <div className="font-medium">{loan.interestRate}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Payments Remaining</span>
                          <div className="font-medium">{loan.paymentsRemaining}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Next Payment Date</span>
                          <div className="font-medium">{loan.nextPaymentDate}</div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loanData && loanData.paymentHistory && loanData.paymentHistory.length > 0 ? (
                        loanData.paymentHistory.map((payment: any) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{payment.status}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{formatAddress(payment.txHash)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center text-gray-500 py-4">No payments found.</td>
                        </tr>
                      )}
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
      {/* Loan Details Modal */}
      {showLoanModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowLoanModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Loan Details</h3>
            <div className="space-y-2">
              <div><span className="font-medium">Loan ID:</span> {selectedLoan.id}</div>
              <div><span className="font-medium">Amount:</span> ${selectedLoan.amount.toLocaleString()}</div>
              <div><span className="font-medium">Purpose:</span> {selectedLoan.purpose}</div>
              <div><span className="font-medium">Status:</span> {selectedLoan.status}</div>
              <div><span className="font-medium">Date:</span> {selectedLoan.date}</div>
            </div>
          </div>
        </div>
      )}
      {/* Download Statement Modal */}
      {showStatementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowStatementModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Select Statement Period</h3>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              value={statementPeriod}
              onChange={e => setStatementPeriod(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              onClick={async () => {
                try {
                  // Dynamically import jsPDF and autoTable
                  const jsPDF = (await import('jspdf')).jsPDF;
                  const autoTable = (await import('jspdf-autotable')).default;
                  const doc = new jsPDF();

                  // Company theme colors (canvas gradient workaround)
                  const canvas = document.createElement('canvas');
                  canvas.width = 210 * 3; // PDF points to pixels (approximate)
                  canvas.height = 24 * 3;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                    gradient.addColorStop(0, '#2563eb'); // blue-600
                    gradient.addColorStop(1, '#9333ea'); // purple-600
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // Insert the gradient image at the top of the PDF
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', 0, 8, 210, 8); // y=8, height=8 for a thin bar
                  }

                  // Header
                  doc.setFontSize(22);
                  doc.setTextColor('#2563eb');
                  doc.text('BLOCKLEND Statement', 105, 20, { align: 'center' });
                  doc.setFontSize(12);
                  doc.setTextColor('#333');
                  doc.text(`Client: ${user?.name || ''}`, 14, 32);
                  doc.text(`Wallet: ${account ? account.slice(0, 8) + '...' + account.slice(-4) : ''}`, 14, 40);
                  doc.text(`Period: ${statementPeriod.charAt(0).toUpperCase() + statementPeriod.slice(1)}`, 14, 48);
                  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 56);

                  // Loan History Table
                  autoTable(doc, {
                    startY: 65,
                    head: [['Loan ID', 'Amount', 'Purpose', 'Status', 'Date']],
                    body: loanData.loanHistory.map((l: any) => [
                      l.id,
                      `$${l.amount.toLocaleString()}`,
                      l.purpose,
                      l.status.charAt(0).toUpperCase() + l.status.slice(1),
                      l.date
                    ]),
                    styles: { fillColor: [37, 99, 235], textColor: 255 },
                    headStyles: { fillColor: [147, 51, 234] },
                    alternateRowStyles: { fillColor: [229, 231, 235], textColor: 51 },
                    margin: { left: 14, right: 14 },
                  });

                  // Payment History Table
                  autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 10,
                    head: [['Payment ID', 'Amount', 'Date', 'Status', 'Tx Hash']],
                    body: loanData.paymentHistory.map((p: any) => [
                      p.id,
                      `$${p.amount.toLocaleString()}`,
                      p.date,
                      p.status.charAt(0).toUpperCase() + p.status.slice(1),
                      p.txHash.slice(0, 10) + '...'
                    ]),
                    styles: { fillColor: [37, 99, 235], textColor: 255 },
                    headStyles: { fillColor: [16, 185, 129] },
                    alternateRowStyles: { fillColor: [229, 231, 235], textColor: 51 },
                    margin: { left: 14, right: 14 },
                  });

                  // Save PDF
                  doc.save(`statement-${statementPeriod}.pdf`);
                  setShowStatementModal(false);
                } catch (err: any) {
                  alert('Failed to generate statement.');
                }
              }}
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;