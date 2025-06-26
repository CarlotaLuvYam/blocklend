import { Wallet, FileText, Brain, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const howItWorksSteps = [
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

const blockchainPhases = [
  {
    title: 'Phase 01: Learn',
    description: 'Ensure everyone in your organization understands blockchain. Review recent research, business use cases and case studies.'
  },
  {
    title: 'Phase 02: Strategize',
    description: 'Define the business transformation opportunity. Develop a blockchain strategy. Integrate it into the current business strategy.'
  },
  {
    title: 'Phase 03: Make the Case',
    description: 'Define transformational impacts. Identify a priority area. Create an ROI model.'
  },
  {
    title: 'Phase 04: Plan',
    description: 'Consider tech selection, process redesign, governance, and risk management to prepare an actionable roadmap.'
  },
  {
    title: 'Phase 05: Pilot',
    description: 'Pilot with real users. Validate, finalize roadmap, and evaluate governance and model feasibility.'
  },
  {
    title: 'Phase 06: Implement',
    description: 'Begin transformation. Interface with systems, execute plan, manage change.'
  },
  {
    title: 'Phase 07: Grow the Network',
    description: 'Expand to partners and suppliers. Sustain with governance and transparency.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            How It <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Get your loan approved in minutes with our streamlined, blockchain-powered process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 rounded-2xl p-8 shadow-xl border border-white/10 backdrop-blur-xl relative"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-center mb-6">
                <div className="text-sm font-semibold text-white/50 mb-2">STEP {index + 1}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
              <div className="space-y-2">
                {step.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-white/70">{detail}</span>
                  </div>
                ))}
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-3xl font-bold mb-8 text-center text-white">7 Phases of Blockchain Implementation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blockchainPhases.map((phase, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 rounded-2xl p-6 shadow-lg border border-white/10 backdrop-blur-md"
              >
                <h4 className="text-xl font-semibold mb-2 text-white">{phase.title}</h4>
                <p className="text-white/70 text-sm">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Development & Testing</h3>
          <p className="text-white/80 text-sm mb-4">
            Blockchain development includes loan contracts, Ethereum integration, rigorous testing, and user feedback.
          </p>
          <p className="text-white/70 text-sm mb-2">Deliverables: Complete platform, test results, refined features.</p>
        </div>

        <div className="mt-16 max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Evaluation & Planning</h3>
          <p className="text-white/80 text-sm mb-4">
            Review goals, evaluate feedback, update backlog for smarter contracts and scalability.
          </p>
          <p className="text-white/70 text-sm mb-2">Deliverables: Progress report, risk log, updated backlog.</p>
        </div>

        <div className="mt-16 max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Methodology & Feedback</h3>
          <p className="text-white/80 text-sm mb-4">
            Using SCRUM and surveys for iterative development and user-centered design. Continuously adapt to real feedback.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
