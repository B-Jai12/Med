import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, FileText, Brain, TrendingUp, Clock, Award, Target } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { user, userHistory } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'symptoms', label: 'Symptom History', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'activities', label: 'Activities', icon: Brain }
  ];

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Track your health journey and view your personalized insights
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Health Checks</p>
                <p className="text-3xl font-bold">{userHistory.symptoms.length}</p>
              </div>
              <Activity className="h-10 w-10 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Reports Analyzed</p>
                <p className="text-3xl font-bold">{userHistory.reports.length}</p>
              </div>
              <FileText className="h-10 w-10 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Quizzes Taken</p>
                <p className="text-3xl font-bold">{userHistory.quizzes.length}</p>
              </div>
              <Brain className="h-10 w-10 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Days Active</p>
                <p className="text-3xl font-bold">
                  {Math.ceil((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-orange-200" />
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[...userHistory.symptoms, ...userHistory.reports, ...userHistory.quizzes]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {'symptoms' in item ? 'Symptom Check' :
                             'fileName' in item ? 'Report Analysis' : 'Health Quiz'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(item.date), 'MMM d, yyyy - h:mm a')}
                          </p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                  {[...userHistory.symptoms, ...userHistory.reports, ...userHistory.quizzes].length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No activity yet. Start by taking a health check!
                    </p>
                  )}
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Health Engagement Score
                </h3>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.min((userHistory.symptoms.length + userHistory.reports.length + userHistory.quizzes.length) * 10, 251)} 251`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">
                        {Math.min((userHistory.symptoms.length + userHistory.reports.length + userHistory.quizzes.length) * 10, 100)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Keep using MediMate+ to improve your health score!
                  </p>
                  <div className="text-sm text-gray-500">
                    Based on your health checks, reports, and quiz completions
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'symptoms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Symptom Check History</h3>
              <div className="space-y-4">
                {userHistory.symptoms.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No symptom checks yet. Visit the Quickcheck page to get started!
                  </p>
                ) : (
                  userHistory.symptoms.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Activity className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-medium text-gray-800">
                            {format(new Date(record.date), 'MMM d, yyyy - h:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor('medium')}`}>
                            Severity: {record.severity}/10
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {record.symptoms.map((symptom, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Prediction:</p>
                        <p className="font-medium text-gray-800">{record.prediction}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recommendations:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {record.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Medical Report History</h3>
              <div className="space-y-4">
                {userHistory.reports.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reports analyzed yet. Visit the Report Scanner page to get started!
                  </p>
                ) : (
                  userHistory.reports.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium text-gray-800">
                            {record.fileName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(record.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Analysis:</p>
                        <p className="text-gray-700">{record.analysis}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recommendations:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {record.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quiz & Activity History</h3>
              <div className="space-y-4">
                {userHistory.quizzes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No quizzes taken yet. Visit the Fun Activities page to get started!
                  </p>
                ) : (
                  userHistory.quizzes.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 text-purple-600 mr-2" />
                          <span className="font-medium text-gray-800">
                            Health Knowledge Quiz
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(record.score, record.totalQuestions)}`}>
                            Score: {record.score}/{record.totalQuestions}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(record.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;