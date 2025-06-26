import { Wallet, FileText, Brain, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Connect your MetaMask wallet to access the platform securely',
      details: [
        'Install MetaMask extension',
        'Create or import wallet',
        'Connect to our platform',
        'Verify your identity'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Fill out the loan application with required information',
      details: [
        'Personal information',
        'Financial details',
        'Loan amount & purpose',
        'Upload documents'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Brain,
      title: 'AI Assessment',
      description: 'Our AI analyzes your application and determines eligibility',
      details: [
        'Credit score analysis',
        'Income verification',
        'Risk assessment',
        'Automated decision'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CheckCircle,
      title: 'Instant Approval',
      description: 'Get instant approval and funds disbursed via smart contract',
      details: [
        'Instant decision',
        'Smart contract execution',
        'Automatic fund transfer',
        'Loan terms activation'
      ],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your loan approved in minutes with our streamlined, blockchain-powered process
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105 relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-sm font-semibold text-gray-500 mb-2">
                      STEP {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Average Processing Timeline
            </h3>
            <p className="text-gray-600">
              From application to fund disbursement
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30s</div>
              <div className="text-sm text-gray-600">Application Submission</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2min</div>
              <div className="text-sm text-gray-600">AI Assessment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10s</div>
              <div className="text-sm text-gray-600">Smart Contract Execution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1min</div>
              <div className="text-sm text-gray-600">Fund Transfer</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 border border-gray-200">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-gray-900">Total Time: Less than 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Secured by Blockchain Technology
              </h3>
              <p className="text-gray-300 mb-6">
                Every transaction is recorded on the blockchain, ensuring complete transparency, 
                security, and immutability of all loan records.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Blockchain Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Smart Contracts Verified</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex p-6 bg-white/10 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-gray-300">Security Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;