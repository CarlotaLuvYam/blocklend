// import React and useState are not needed in this file
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle, Wallet } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const Hero = () => {
  const { isConnected, connectWallet } = useWeb3();

  const stats = [
    { label: 'Loans Processed', value: '10K+', icon: TrendingUp },
    { label: 'Success Rate', value: '95%', icon: CheckCircle },
    { label: 'Avg Processing', value: '< 5min', icon: Zap },
  ];

  const features = [
    'Automated eligibility assessment',
    'Smart contract security',
    'Instant loan approval',
    'Transparent blockchain records'
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-blue-300 mr-2" />
              <span className="text-sm text-blue-200 font-medium">
                Secured by Blockchain Technology
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Decentralized
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block lg:inline lg:ml-4">
                Micro-Lending
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Get instant loan approvals through our AI-powered smart contracts. 
              Transparent, secure, and automated lending on the blockchain.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isConnected ? (
                <Link
                  to="/apply"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Apply for Loan
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={connectWallet}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet to Start
                </button>
              )}

              <Link
                to="#how-it-works"
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center border border-white/20"
              >
                Learn How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Smart Contract Visualization */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Contract Status</h3>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Active & Secure</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Contract Address</span>
                    <span className="text-xs text-blue-300">Verified ✓</span>
                  </div>
                  <div className="font-mono text-sm text-white">0x742d...A4B8</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Total Value Locked</span>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-xl font-bold text-white">$2.4M</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Active Loans</span>
                    <span className="text-xs text-purple-300">Real-time</span>
                  </div>
                  <div className="text-xl font-bold text-white">1,247</div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-400/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-300">Last Assessment</span>
                  </div>
                  <div className="text-white font-medium">2 minutes ago</div>
                  <div className="text-xs text-gray-400">Loan approved automatically</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-ping"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 animate-float">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-3 animate-float delay-1000">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;