import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, Calendar, Star, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SymptomAnalysis {
  condition: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  description: string;
  recommendations: string[];
  suggestedTests: string[];
  lifestyle: string[];
}

const QuickcheckPage: React.FC = () => {
  const { user, addSymptomRecord } = useUser();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [severityLevel, setSeverityLevel] = useState(5);
  const [emotionalState, setEmotionalState] = useState(5);
  const [category, setCategory] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const symptomCategories = {
    'Neurological': ['Headache', 'Dizziness', 'Memory Issues', 'Confusion', 'Numbness'],
    'Respiratory': ['Cough', 'Shortness of Breath', 'Chest Pain', 'Wheezing', 'Throat Pain'],
    'Digestive': ['Nausea', 'Vomiting', 'Stomach Pain', 'Diarrhea', 'Constipation'],
    'Muscular': ['Muscle Pain', 'Joint Pain', 'Stiffness', 'Weakness', 'Cramps'],
    'General': ['Fever', 'Fatigue', 'Loss of Appetite', 'Weight Loss', 'Night Sweats']
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysisResult = generateAnalysis(selectedSymptoms, severityLevel, emotionalState, duration);
      setAnalysis(analysisResult);
      
      if (user) {
        const record = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          symptoms: selectedSymptoms,
          severity: severityLevel,
          emotionalState,
          duration,
          prediction: analysisResult.condition,
          recommendations: analysisResult.recommendations
        };
        addSymptomRecord(record);
      }
      
      setLoading(false);
    }, 2000);
  };

  const generateAnalysis = (symptoms: string[], severity: number, emotional: number, duration: string): SymptomAnalysis => {
    // Rule-based analysis logic
    const hasRespiratory = symptoms.some(s => ['Cough', 'Shortness of Breath', 'Chest Pain'].includes(s));
    const hasFever = symptoms.includes('Fever');
    const hasGI = symptoms.some(s => ['Nausea', 'Vomiting', 'Stomach Pain', 'Diarrhea'].includes(s));
    const hasNeuro = symptoms.some(s => ['Headache', 'Dizziness', 'Confusion'].includes(s));

    let condition = 'General Health Concern';
    let severityLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    let confidence = 70;

    if (severity >= 8) severityLevel = 'Critical';
    else if (severity >= 6) severityLevel = 'High';
    else if (severity >= 4) severityLevel = 'Medium';

    if (hasRespiratory && hasFever) {
      condition = 'Possible Respiratory Infection';
      confidence = 85;
    } else if (hasGI && symptoms.length >= 2) {
      condition = 'Possible Gastrointestinal Issue';
      confidence = 80;
    } else if (hasNeuro && severity >= 6) {
      condition = 'Neurological Concern';
      severityLevel = 'High';
      confidence = 75;
    } else if (hasFever && symptoms.length >= 3) {
      condition = 'Possible Viral/Bacterial Infection';
      confidence = 82;
    }

    const recommendations = [
      'Stay hydrated and get adequate rest',
      'Monitor your symptoms closely',
      'Consider over-the-counter pain relief if appropriate'
    ];

    if (severityLevel === 'Critical' || severity >= 8) {
      recommendations.unshift('Seek immediate medical attention');
    } else if (severityLevel === 'High') {
      recommendations.push('Schedule an appointment with your healthcare provider');
    }

    const suggestedTests = [];
    if (hasRespiratory) suggestedTests.push('Chest X-ray', 'Complete Blood Count');
    if (hasFever) suggestedTests.push('Blood Culture', 'Inflammatory Markers');
    if (hasGI) suggestedTests.push('Stool Analysis', 'Abdominal Ultrasound');

    const lifestyle = [
      'Maintain a balanced diet rich in vitamins',
      'Get 7-8 hours of quality sleep',
      'Practice stress management techniques'
    ];

    return {
      condition,
      severity: severityLevel,
      confidence,
      description: `Based on your symptoms and severity level, this appears to be a ${severityLevel.toLowerCase()} priority health concern.`,
      recommendations,
      suggestedTests,
      lifestyle
    };
  };

  const addCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      setCustomSymptom('');
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Smart Health Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your symptoms and we'll provide AI-powered health insights and recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Category Selection */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Select Symptom Category
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(symptomCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      category === cat
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Selection */}
            {category && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Select Your Symptoms
                </h3>
                <div className="space-y-2">
                  {symptomCategories[category as keyof typeof symptomCategories].map((symptom) => (
                    <label key={symptom} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSymptoms([...selectedSymptoms, symptom]);
                          } else {
                            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                          }
                        }}
                        className="mr-3 rounded text-blue-600"
                      />
                      <span className="text-gray-700">{symptom}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom symptom..."
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                  />
                  <button
                    onClick={addCustomSymptom}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Duration and Severity */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long have you been experiencing these symptoms?
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select duration...</option>
                  <option value="less-than-day">Less than a day</option>
                  <option value="1-3-days">1-3 days</option>
                  <option value="3-7-days">3-7 days</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="more-than-2-weeks">More than 2 weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discomfort Level (1-10): {severityLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emotional State (1-10): {emotionalState}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalState}
                  onChange={(e) => setEmotionalState(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Stressed</span>
                  <span>Neutral</span>
                  <span>Calm</span>
                </div>
              </div>
            </div>

            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {selectedSymptoms.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Selected Symptoms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Analysis Result */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Health Analysis
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      analysis.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      analysis.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {analysis.severity} Priority
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">
                      {analysis.condition}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {analysis.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {analysis.confidence}% confidence
                    </div>
                  </div>

                  {analysis.severity === 'Critical' && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                      <div className="flex items-center text-red-700">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span className="font-semibold">
                          Immediate Medical Attention Recommended
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Tests */}
                {analysis.suggestedTests.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4">
                      Suggested Tests
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.suggestedTests.map((test, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-gray-700">{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lifestyle Tips */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    Wellness Tips
                  </h4>
                  <ul className="space-y-2">
                    {analysis.lifestyle.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="h-4 w-4 mt-1 mr-3 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuickcheckPage;