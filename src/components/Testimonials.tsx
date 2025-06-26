import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'Chief Risk Officer',
      company: 'MetroBank Financial',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: 'Nexus Financial transformed our lending operations. We reduced processing time by 80% while improving our risk assessment accuracy significantly.',
      rating: 5,
      metrics: {
        improvement: '80% faster processing',
        result: '40% reduction in defaults'
      }
    },
    {
      name: 'Michael Rodriguez',
      title: 'VP of Digital Lending',
      company: 'Summit Credit Union',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: 'The AI-powered risk assessment has been a game-changer. Our approval rates improved while maintaining the same risk profile.',
      rating: 5,
      metrics: {
        improvement: '25% higher approval rate',
        result: '15% increase in revenue'
      }
    },
    {
      name: 'Emily Thompson',
      title: 'Head of Compliance',
      company: 'Regional Trust Bank',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: 'Regulatory compliance used to be our biggest challenge. Now we have full confidence in our audit trails and reporting capabilities.',
      rating: 5,
      metrics: {
        improvement: '100% compliance score',
        result: 'Zero regulatory issues'
      }
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentQuote = testimonials[currentTestimonial];

  return (
    <section id="insights" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how leading financial institutions are transforming their lending operations with our platform.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/20 relative">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-blue-400/50" />
            
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  {[...Array(currentQuote.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl lg:text-2xl text-white font-medium leading-relaxed mb-8">
                  "{currentQuote.quote}"
                </blockquote>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-blue-300 mb-1">Key Improvement</div>
                    <div className="text-white font-semibold">{currentQuote.metrics.improvement}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-purple-300 mb-1">Business Result</div>
                    <div className="text-white font-semibold">{currentQuote.metrics.result}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={currentQuote.image}
                    alt={currentQuote.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-semibold">{currentQuote.name}</div>
                    <div className="text-blue-300">{currentQuote.title}</div>
                    <div className="text-gray-400 text-sm">{currentQuote.company}</div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-4">
                <button
                  onClick={prevTestimonial}
                  className="p-3 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentTestimonial === index
                          ? 'bg-blue-400'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-3 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-16">
          <p className="text-center text-gray-400 mb-8">Trusted by 500+ financial institutions worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              'MetroBank',
              'Summit Credit',
              'Regional Trust',
              'Capital One',
              'First National',
              'Community Bank'
            ].map((company, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <div className="w-full h-8 bg-white/20 rounded"></div>
                </div>
                <p className="text-sm text-gray-400">{company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Lending Operations?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of financial institutions who trust Nexus Financial for their lending intelligence needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Schedule Demo
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;