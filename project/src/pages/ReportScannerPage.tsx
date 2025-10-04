import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertTriangle, CheckCircle, TrendingUp, Mail, Star } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface ReportAnalysis {
  fileName: string;
  testType: string;
  keyFindings: Array<{
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
    explanation: string;
  }>;
  overallAssessment: string;
  recommendations: string[];
  suggestedTests: string[];
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  riskFactors: string[];
}

const ReportScannerPage: React.FC = () => {
  const { user, addReportRecord } = useUser();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG) or PDF file.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB.');
      return;
    }

    setUploadedFile(file);
    analyzeReport(file);
  };

  const analyzeReport = (file: File) => {
    setLoading(true);
    
    // Simulate OCR and analysis process
    setTimeout(() => {
      const analysisResult = generateMockAnalysis(file.name);
      setAnalysis(analysisResult);
      
      if (user) {
        const record = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          fileName: file.name,
          analysis: analysisResult.overallAssessment,
          recommendations: analysisResult.recommendations
        };
        addReportRecord(record);
      }
      
      setLoading(false);
    }, 3000);
  };

  const generateMockAnalysis = (fileName: string): ReportAnalysis => {
    // Mock analysis based on common blood test parameters
    const mockFindings = [
      {
        parameter: 'Total Cholesterol',
        value: '220',
        unit: 'mg/dL',
        normalRange: '< 200',
        status: 'high' as const,
        explanation: 'Your cholesterol level is above the recommended range, which may increase your risk of heart disease.'
      },
      {
        parameter: 'HDL Cholesterol',
        value: '45',
        unit: 'mg/dL',
        normalRange: '40-60',
        status: 'normal' as const,
        explanation: 'Your HDL (good) cholesterol is within the normal range, which is beneficial for heart health.'
      },
      {
        parameter: 'Blood Glucose',
        value: '110',
        unit: 'mg/dL',
        normalRange: '70-99',
        status: 'high' as const,
        explanation: 'Your fasting glucose level is slightly elevated, which may indicate prediabetes.'
      },
      {
        parameter: 'Hemoglobin',
        value: '13.5',
        unit: 'g/dL',
        normalRange: '12.0-15.5',
        status: 'normal' as const,
        explanation: 'Your hemoglobin level is normal, indicating healthy oxygen-carrying capacity.'
      }
    ];

    return {
      fileName,
      testType: 'Complete Blood Panel',
      keyFindings: mockFindings,
      overallAssessment: 'Your blood test shows some areas that need attention. While most values are normal, your cholesterol and glucose levels are slightly elevated.',
      recommendations: [
        'Adopt a heart-healthy diet low in saturated fats',
        'Increase physical activity to at least 150 minutes per week',
        'Monitor your blood sugar levels regularly',
        'Schedule a follow-up appointment with your doctor in 3 months',
        'Consider consulting a nutritionist for personalized dietary advice'
      ],
      suggestedTests: [
        'HbA1c Test (for diabetes screening)',
        'Lipid Panel (follow-up in 3 months)',
        'Thyroid Function Test'
      ],
      severity: 'mild',
      riskFactors: [
        'Elevated cholesterol may increase cardiovascular risk',
        'Slightly high glucose may indicate insulin resistance'
      ]
    };
  };

  const getSeverityColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getSeverityIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high':
      case 'low': return <TrendingUp className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // Here you would typically send the rating to your backend
  };

  const sendEmailSummary = () => {
    if (!user || !analysis) return;
    
    // Simulate sending email
    alert('Email summary has been sent to your registered email address!');
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Medical Report Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your medical reports and get detailed analysis with personalized health recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    Drop your report here or click to browse
                  </p>
                  <p className="text-gray-600">
                    Supports JPG, PNG, PDF up to 10MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Select File
                </button>
              </div>
            </div>

            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Uploaded File
                </h3>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {loading && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center"
              >
                <div className="animate-pulse space-y-4">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Analyzing Report...
                    </p>
                    <p className="text-gray-600 text-sm">
                      Processing OCR and generating health insights
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {analysis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Overall Assessment */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Analysis Results
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.severity === 'severe' ? 'bg-red-100 text-red-700' :
                      analysis.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                      analysis.severity === 'mild' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {analysis.severity} concern
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {analysis.overallAssessment}
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    Report Type: <span className="font-medium">{analysis.testType}</span>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    Key Findings
                  </h4>
                  <div className="space-y-4">
                    {analysis.keyFindings.map((finding, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-800">
                            {finding.parameter}
                          </h5>
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.status)}`}>
                            {getSeverityIcon(finding.status)}
                            <span className="ml-1 capitalize">{finding.status}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Value:</span> {finding.value} {finding.unit} 
                          <span className="ml-4 font-medium">Normal:</span> {finding.normalRange} {finding.unit}
                        </div>
                        <p className="text-sm text-gray-700">{finding.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    Health Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors */}
                {analysis.riskFactors.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
                    <div className="flex items-center mb-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      <h4 className="font-semibold text-lg text-orange-800">
                        Risk Factors to Monitor
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.riskFactors.map((risk, index) => (
                        <li key={index} className="text-orange-700">
                          • {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Tests */}
                {analysis.suggestedTests.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4">
                      Recommended Follow-up Tests
                    </h4>
                    <div className="space-y-2">
                      {analysis.suggestedTests.map((test, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <FileText className="h-4 w-4 mr-3 text-blue-600" />
                          <span className="text-gray-800">{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Feedback */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    Rate this Analysis
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    How helpful was this explanation? Your feedback helps us improve.
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`transition-colors ${
                          star <= userRating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-green-600">
                      Thank you for your feedback! ({userRating}/5 stars)
                    </p>
                  )}
                </div>

                {/* Email Summary */}
                {user && (
                  <button
                    onClick={sendEmailSummary}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Email Summary to {user.email}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportScannerPage;