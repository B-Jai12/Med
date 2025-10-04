import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Send, CheckCircle, User, Mail, MessageSquare } from 'lucide-react';

interface FeedbackData {
  name: string;
  email: string;
  category: string;
  rating: number;
  message: string;
}

const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    category: '',
    rating: 0,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'General Feedback',
    'Symptom Checker',
    'Report Scanner',
    'Fun Activities',
    'User Experience',
    'Technical Issues',
    'Feature Request',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingSelect = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store feedback in localStorage
      const existingFeedback = JSON.parse(localStorage.getItem('mediMateFeedback') || '[]');
      const newFeedback = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      existingFeedback.push(newFeedback);
      localStorage.setItem('mediMateFeedback', JSON.stringify(existingFeedback));
      
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      category: '',
      rating: 0,
      message: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-20 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Thank You for Your Feedback!
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve MediMate+ for everyone.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              We'll review your feedback and get back to you if needed. Keep using MediMate+ for your health journey!
            </p>
            
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Submit Another Feedback
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us improve MediMate+ by sharing your experience, suggestions, or any issues you've encountered
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Feedback Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Overall Experience Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingSelect(star)}
                      className={`transition-all duration-200 hover:scale-110 ${
                        star <= formData.rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-4 text-sm text-gray-600">
                      {formData.rating === 5 ? 'Excellent!' :
                       formData.rating === 4 ? 'Very Good' :
                       formData.rating === 3 ? 'Good' :
                       formData.rating === 2 ? 'Fair' : 'Needs Improvement'}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Your Feedback
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Please share your detailed feedback, suggestions, or report any issues you've encountered..."
                ></textarea>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/500 characters
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.category || !formData.message || formData.rating === 0}
                className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Sidebar Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Get in Touch
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Response Time:</span>
                  <p>We typically respond within 24-48 hours</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p>support@medimate.com</p>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <p>+1 (555) 123-MEDI</p>
                </div>
              </div>
            </div>

            {/* Feedback Types */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                What We Love to Hear
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Feature suggestions and improvements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>User experience feedback</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Technical issues or bugs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Content accuracy and quality</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>General compliments or complaints</span>
                </li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                Privacy Notice
              </h3>
              <p className="text-sm text-yellow-700 leading-relaxed">
                Your feedback is important to us. We'll only use your information to respond to your feedback and improve our services. We never share personal information with third parties.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-4">
                Community Feedback
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Feedback Received:</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Rating:</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate:</span>
                  <span className="font-semibold">98%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;