import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [animatedValues, setAnimatedValues] = useState({
    portfolioValue: 0,
    approvalRate: 0,
    riskScore: 0,
    activeLoans: 0
  });

  useEffect(() => {
    const targets = {
      portfolioValue: 2.4,
      approvalRate: 87.5,
      riskScore: 94.2,
      activeLoans: 15420
    };

    const animateValue = (key: keyof typeof targets, target: number, duration: number) => {
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        const currentValue = startValue + (target - startValue) * easeProgress;
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: currentValue
        }));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Stagger the animations
    animateValue('portfolioValue', targets.portfolioValue, 2000);
    setTimeout(() => animateValue('approvalRate', targets.approvalRate, 1500), 300);
    setTimeout(() => animateValue('riskScore', targets.riskScore, 1500), 600);
    setTimeout(() => animateValue('activeLoans', targets.activeLoans, 2000), 900);
  }, []);

  const metrics = [
    {
      label: 'Portfolio Value',
      value: `$${animatedValues.portfolioValue.toFixed(1)}B`,
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Approval Rate',
      value: `${animatedValues.approvalRate.toFixed(1)}%`,
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Risk Score',
      value: `${animatedValues.riskScore.toFixed(1)}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Active Loans',
      value: animatedValues.activeLoans.toLocaleString(),
      change: '-3.4%',
      trend: 'down',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const riskDistribution = [
    { label: 'Low Risk', value: 65, color: 'bg-green-500' },
    { label: 'Medium Risk', value: 28, color: 'bg-yellow-500' },
    { label: 'High Risk', value: 7, color: 'bg-red-500' }
  ];

  const monthlyData = [
    { month: 'Jan', approvals: 420, defaults: 12 },
    { month: 'Feb', approvals: 380, defaults: 15 },
    { month: 'Mar', approvals: 450, defaults: 8 },
    { month: 'Apr', approvals: 520, defaults: 18 },
    { month: 'May', approvals: 480, defaults: 14 },
    { month: 'Jun', approvals: 640, defaults: 10 }
  ];

  return (
    <section id="analytics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Real-Time
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Analytics</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor your lending portfolio with comprehensive analytics and predictive insights that drive better decisions.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${metric.bgColor.replace('50', '100')}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Risk Distribution Chart */}
          <div className="bg-gray-50 rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Risk Distribution</h3>
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-gray-600">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-600 mb-1">Overall Risk Score</div>
              <div className="text-2xl font-bold text-green-600">Excellent</div>
              <div className="text-xs text-gray-500">Based on current portfolio composition</div>
            </div>
          </div>

          {/* Monthly Performance Chart */}
          <div className="bg-gray-50 rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Monthly Performance</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">{data.month}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{data.approvals} Approvals</div>
                      <div className="text-sm text-gray-600">{data.defaults} Defaults</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {((data.approvals - data.defaults) / data.approvals * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <div className="text-sm opacity-90 mb-1">This Month's Target</div>
              <div className="text-xl font-bold">750 Approvals</div>
              <div className="text-xs opacity-75">85% completion rate</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Optimize Portfolio</h4>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered recommendations to improve your portfolio performance and reduce risk.
            </p>
            <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
              View Recommendations →
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <Activity className="h-8 w-8 text-green-600 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Risk Alerts</h4>
            <p className="text-gray-600 text-sm mb-4">
              Set up automated alerts for portfolio risks and regulatory compliance issues.
            </p>
            <button className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors">
              Configure Alerts →
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <DollarSign className="h-8 w-8 text-purple-600 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Revenue Insights</h4>
            <p className="text-gray-600 text-sm mb-4">
              Deep dive into revenue analytics and identify opportunities for growth.
            </p>
            <button className="text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors">
              Explore Insights →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;