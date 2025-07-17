import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

const LoanApplication = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useWeb3();
  const { isAuthenticated, login, user } = useAuth(); // Add user from context
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationResult, setApplicationResult] = useState<'approved' | 'rejected' | 'pending' | null>(null); // Add 'pending' to type

  // ... rest of the state

  // Hide form for admins
  if (user && user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admins cannot apply for loans.</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    
    // Financial Information
    monthlyIncome: '',
    employmentStatus: '',
    employer: '',
    bankAccount: '',
    
    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    repaymentPeriod: '12',
    
    // Additional Information
    hasExistingLoans: false,
    creditScore: '',
    collateral: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const simulateAIAssessment = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simple scoring algorithm for demo
    let score = 0;
    
    // Income scoring
    const income = parseFloat(formData.monthlyIncome);
    if (income > 5000) score += 30;
    else if (income > 3000) score += 20;
    else if (income > 1000) score += 10;
    
    // Loan amount vs income ratio
    const loanAmount = parseFloat(formData.loanAmount);
    const ratio = loanAmount / (income * 12);
    if (ratio < 0.3) score += 25;
    else if (ratio < 0.5) score += 15;
    else if (ratio < 0.7) score += 5;
    
    // Employment status
    if (formData.employmentStatus === 'full-time') score += 20;
    else if (formData.employmentStatus === 'part-time') score += 10;
    else if (formData.employmentStatus === 'self-employed') score += 15;
    
    // Credit score
    const creditScore = parseFloat(formData.creditScore);
    if (creditScore > 700) score += 25;
    else if (creditScore > 600) score += 15;
    else if (creditScore > 500) score += 5;
    
    // Determine approval (score > 60 for approval)
    const approved = score > 60;
    setApplicationResult(approved ? 'approved' : 'rejected');
    
    // Register user if not authenticated
    if (!isAuthenticated && approved) {
      login({
        address: account || '',
        email: formData.email,
        name: formData.fullName,
        role: 'user'
      }, '');
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // ...simulate assessment or call backend
    await simulateAIAssessment();
    // After assessment, always set status to 'pending' (since backend enforces this)
    setApplicationResult('pending');
    setIsProcessing(false);
  // End of handleSubmit

    e.preventDefault();
    await simulateAIAssessment();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection Required</h2>
          <p className="text-gray-600 mb-6">
            Please connect your MetaMask wallet to access the loan application form.
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

  if (applicationResult) {
    // Show Pending Approval if result is 'pending'
    if (applicationResult === 'pending') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pending Approval</h2>
            <p className="text-gray-600 mb-6">
              Your loan application has been submitted and is pending approval by an administrator. You will be notified once a decision is made.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {applicationResult === 'approved' ? (
            <>
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Loan Approved!</h2>
              <p className="text-gray-600 mb-6">
                Congratulations! Your loan application has been approved. The smart contract will process your loan shortly.
              </p>
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-sm text-gray-600">Approved Amount</span>
                    <div className="text-xl font-bold text-green-600">${formData.loanAmount}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <div className="text-xl font-bold text-green-600">8.5% APR</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Repayment Period</span>
                    <div className="text-xl font-bold text-green-600">{formData.repaymentPeriod} months</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Monthly Payment</span>
                    <div className="text-xl font-bold text-green-600">
                      ${Math.round((parseFloat(formData.loanAmount) * 1.085) / parseInt(formData.repaymentPeriod))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Not Approved</h2>
              <p className="text-gray-600 mb-6">
                Unfortunately, your loan application doesn't meet our current criteria. You can reapply after improving your financial profile.
              </p>
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-red-900 mb-3">Improvement Suggestions:</h3>
                <ul className="text-left text-red-700 space-y-2">
                  <li>• Increase your monthly income</li>
                  <li>• Reduce the requested loan amount</li>
                  <li>• Improve your credit score</li>
                  <li>• Consider providing collateral</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setApplicationResult(null);
                    setCurrentStep(1);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Assessment in Progress</h2>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing your application and assessing your eligibility. This usually takes a few seconds.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Analyzing financial data...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-300"></div>
              <span className="text-sm text-gray-600">Calculating risk score...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-700"></div>
              <span className="text-sm text-gray-600">Generating decision...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Financial Info', icon: DollarSign },
    { number: 3, title: 'Loan Details', icon: FileText },
    { number: 4, title: 'Review & Submit', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Application</h1>
          <p className="text-xl text-gray-600">Complete your application in 4 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    Step {step.number}
                  </div>
                  <div className={`text-sm ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income *
                    </label>
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter monthly income"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Status *
                    </label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select employment status</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer/Company
                    </label>
                    <input
                      type="text"
                      name="employer"
                      value={formData.employer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter employer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Score
                    </label>
                    <input
                      type="number"
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleInputChange}
                      min="300"
                      max="850"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter credit score (300-850)"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank account number"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      required
                      min="100"
                      max="50000"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter loan amount ($100 - $50,000)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repayment Period *
                    </label>
                    <select
                      name="repaymentPeriod"
                      value={formData.repaymentPeriod}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Purpose *
                  </label>
                  <textarea
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the purpose of your loan"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collateral (Optional)
                  </label>
                  <textarea
                    name="collateral"
                    value={formData.collateral}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe any collateral you can provide"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasExistingLoans"
                    checked={formData.hasExistingLoans}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I have existing loans
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Full Name</span>
                      <div className="font-medium">{formData.fullName}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email</span>
                      <div className="font-medium">{formData.email}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Monthly Income</span>
                      <div className="font-medium">${formData.monthlyIncome}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Employment</span>
                      <div className="font-medium">{formData.employmentStatus}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Loan Amount</span>
                      <div className="font-medium text-blue-600">${formData.loanAmount}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Repayment Period</span>
                      <div className="font-medium">{formData.repaymentPeriod} months</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Loan Purpose</span>
                    <div className="font-medium">{formData.loanPurpose}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your application will be processed by our AI system</li>
                    <li>• Decision will be made within minutes</li>
                    <li>• All transactions are secured by blockchain technology</li>
                    <li>• Interest rates are determined based on risk assessment</li>
                  </ul>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;