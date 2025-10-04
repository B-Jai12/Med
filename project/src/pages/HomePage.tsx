import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, FileText, Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import WaveBackground from '../components/WaveBackground';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Stethoscope,
      title: 'Smart Symptom Checker',
      description: 'AI-powered analysis of your symptoms with personalized health predictions and recommendations.',
      link: '/quickcheck',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Report Scanner',
      description: 'Upload and analyze medical reports with detailed explanations and health insights.',
      link: '/report-scanner',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Sparkles,
      title: 'Skin+ Analysis',
      description: 'Take our comprehensive skin survey and get personalized skincare recommendations.',
      link: '/skin-analysis',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Heart,
      title: 'Fun Activities',
      description: 'Engage with health quizzes, wellness tips, and relaxing breathing exercises.',
      link: '/fun-activities',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'Feedback & Support',
      description: 'Share your experience and get personalized support from our health community.',
      link: '/feedback',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="relative">
      <WaveBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to MediMate+
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent health companion for symptom analysis, report scanning, and personalized wellness guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/quickcheck"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Start Health Check
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/report-scanner"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-600 hover:bg-blue-50"
            >
              Scan Report
            </Link>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={feature.link} className="block">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 mb-12"
          >
            Trusted by Health-Conscious Individuals
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '10K+', label: 'Health Checks Completed' },
              { number: '5K+', label: 'Reports Analyzed' },
              { number: '95%', label: 'User Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;