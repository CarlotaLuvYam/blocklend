import React, { useState } from 'react';
import { 
  Brain, 
  Shield, 
  Zap, 
  Globe, 
  Lock,
  TrendingUp,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessment',
      description: 'Advanced machine learning algorithms automatically evaluate loan applications using multiple data points and risk factors.',
      benefits: [
        'Instant eligibility assessment',
        '95% accuracy rate',
        'Bias-free decision making',
        'Continuous learning improvement'
      ],
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All transactions and records are secured on the blockchain, ensuring transparency and immutability.',
      benefits: [
        'Immutable transaction records',
        'Cryptographic security',
        'Decentralized verification',
        'Transparent audit trail'
      ],
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Smart Contract Automation',
      description: 'Fully automated loan processing through smart contracts eliminates manual intervention and reduces processing time.',
      benefits: [
        'Automated loan disbursement',
        'Instant approval/rejection',
        'Self-executing contracts',
        'Reduced operational costs'
      ],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access micro-lending services from anywhere in the world with just a crypto wallet and internet connection.',
      benefits: [
        'No geographical restrictions',
        '24/7 availability',
        'Multi-currency support',
        'Cross-border transactions'
      ],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const stats = [
    { label: 'Processing Time', value: '< 5min', icon: Zap },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
    { label: 'Security Level', value: '100%', icon: Shield },
    { label: 'Global Reach', value: '50+ Countries', icon: Globe }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Revolutionary
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Lending Technology</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of micro-lending with our blockchain-powered platform that combines AI assessment with smart contract automation.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  activeFeature === index
                    ? 'bg-white shadow-xl border-2 border-blue-200'
                    : 'bg-white/50 hover:bg-white/80 border border-gray-200'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    {activeFeature === index && (
                      <div className="space-y-2 animate-fadeIn">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowRight className={`h-5 w-5 transition-transform ${
                    activeFeature === index ? 'rotate-90 text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Feature Visualization */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${features[activeFeature].color} mb-6`}>
                <React.Fragment>{React.createElement(features[activeFeature].icon, {className: "h-8 w-8 text-white"})}</React.Fragment>
              </div>
              
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                {features[activeFeature].title} in Action
              </h4>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Processing Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Response Time</span>
                  <span className="text-2xl font-bold text-blue-600">2.3s</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Accuracy Rate</span>
                  <span className="text-2xl font-bold text-purple-600">95.7%</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Blockchain Secured</span>
                </div>
                <p className="text-sm text-blue-700">
                  All operations are recorded on the blockchain for maximum security and transparency.
                </p>
              </div>
            </div>

            {/* Floating indicators */}
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
              <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;