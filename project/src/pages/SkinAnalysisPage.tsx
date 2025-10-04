import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronLeft, CircleCheck as CheckCircle, Clock, Droplets, Sun, Moon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SkinQuestion {
  id: number;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options: string[];
  category: 'type' | 'concerns' | 'lifestyle' | 'routine';
}

interface SkinAnalysis {
  skinType: string;
  primaryConcerns: string[];
  skinScore: number;
  recommendations: {
    cleanser: { name: string; description: string; usage: string };
    toner: { name: string; description: string; usage: string };
    serum: { name: string; description: string; usage: string };
    moisturizer: { name: string; description: string; usage: string };
    sunscreen: { name: string; description: string; usage: string };
  };
  routine: {
    morning: Array<{ step: number; product: string; instruction: string }>;
    evening: Array<{ step: number; product: string; instruction: string }>;
  };
  tips: string[];
  schedule: string;
}

const SkinAnalysisPage: React.FC = () => {
  const { user, addSkinAnalysisRecord } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const questions: SkinQuestion[] = [
    {
      id: 1,
      question: "How would you describe your skin type?",
      type: 'single',
      options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'],
      category: 'type'
    },
    {
      id: 2,
      question: "What are your main skin concerns? (Select all that apply)",
      type: 'multiple',
      options: ['Acne/Breakouts', 'Dark Spots', 'Fine Lines/Wrinkles', 'Large Pores', 'Dullness', 'Redness/Irritation', 'Uneven Texture', 'Dark Circles'],
      category: 'concerns'
    },
    {
      id: 3,
      question: "How often do you break out?",
      type: 'single',
      options: ['Never', 'Rarely (once a month)', 'Sometimes (2-3 times a month)', 'Often (weekly)', 'Very often (daily)'],
      category: 'concerns'
    },
    {
      id: 4,
      question: "How does your skin feel by midday?",
      type: 'single',
      options: ['Very oily all over', 'Oily in T-zone only', 'Normal/comfortable', 'Tight or dry', 'Flaky or very dry'],
      category: 'type'
    },
    {
      id: 5,
      question: "How does your skin react to new products?",
      type: 'single',
      options: ['No reaction', 'Mild irritation sometimes', 'Often gets irritated', 'Very sensitive, reacts easily', 'Breaks out frequently'],
      category: 'type'
    },
    {
      id: 6,
      question: "What is your current skincare routine?",
      type: 'single',
      options: ['No routine', 'Basic (cleanser only)', 'Simple (cleanser + moisturizer)', 'Moderate (3-4 products)', 'Extensive (5+ products)'],
      category: 'routine'
    },
    {
      id: 7,
      question: "How much time do you spend in the sun daily?",
      type: 'single',
      options: ['Less than 30 minutes', '30 minutes - 1 hour', '1-2 hours', '2-4 hours', 'More than 4 hours'],
      category: 'lifestyle'
    },
    {
      id: 8,
      question: "Do you currently use sunscreen?",
      type: 'single',
      options: ['Daily', 'Sometimes', 'Only when going out', 'Rarely', 'Never'],
      category: 'routine'
    },
    {
      id: 9,
      question: "How would you rate your stress levels?",
      type: 'scale',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      category: 'lifestyle'
    },
    {
      id: 10,
      question: "How many hours of sleep do you get per night?",
      type: 'single',
      options: ['Less than 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', 'More than 8 hours'],
      category: 'lifestyle'
    },
    {
      id: 11,
      question: "How often do you drink water daily?",
      type: 'single',
      options: ['Less than 4 glasses', '4-6 glasses', '6-8 glasses', '8-10 glasses', 'More than 10 glasses'],
      category: 'lifestyle'
    },
    {
      id: 12,
      question: "What is your age range?",
      type: 'single',
      options: ['Under 18', '18-25', '26-35', '36-45', '46-55', 'Over 55'],
      category: 'type'
    },
    {
      id: 13,
      question: "What is your primary skincare goal?",
      type: 'single',
      options: ['Prevent aging', 'Clear acne', 'Even skin tone', 'Hydrate skin', 'Reduce sensitivity', 'General maintenance'],
      category: 'concerns'
    }
  ];

  const handleAnswerSelect = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeSurvey();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeSurvey = () => {
    setLoading(true);
    
    setTimeout(() => {
      const analysisResult = generateSkinAnalysis(answers);
      setAnalysis(analysisResult);
      setSurveyCompleted(true);
      
      if (user && addSkinAnalysisRecord) {
        const record = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          skinType: analysisResult.skinType,
          concerns: analysisResult.primaryConcerns,
          score: analysisResult.skinScore,
          recommendations: analysisResult.recommendations
        };
        addSkinAnalysisRecord(record);
      }
      
      setLoading(false);
    }, 2000);
  };

  const generateSkinAnalysis = (answers: Record<number, string | string[]>): SkinAnalysis => {
    // Analyze skin type
    const skinTypeAnswer = answers[1] as string;
    const midDayFeel = answers[4] as string;
    const sensitivity = answers[5] as string;
    
    let skinType = skinTypeAnswer || 'Normal';
    if (midDayFeel?.includes('Very oily')) skinType = 'Oily';
    else if (midDayFeel?.includes('Tight') || midDayFeel?.includes('Flaky')) skinType = 'Dry';
    else if (midDayFeel?.includes('T-zone')) skinType = 'Combination';
    if (sensitivity?.includes('Very sensitive')) skinType = 'Sensitive';

    // Analyze concerns
    const concernsAnswer = answers[2] as string[];
    const primaryConcerns = Array.isArray(concernsAnswer) ? concernsAnswer : [];
    
    // Calculate skin score
    let skinScore = 85;
    if (answers[3]?.toString().includes('Often') || answers[3]?.toString().includes('Very often')) skinScore -= 15;
    if (answers[7]?.toString().includes('More than 4 hours')) skinScore -= 10;
    if (answers[8] === 'Never' || answers[8] === 'Rarely') skinScore -= 20;
    if (parseInt(answers[9] as string) > 7) skinScore -= 10;
    if (answers[10]?.toString().includes('Less than 5')) skinScore -= 10;
    if (answers[11]?.toString().includes('Less than 4')) skinScore -= 10;

    // Generate recommendations based on skin type and concerns
    const recommendations = generateProductRecommendations(skinType, primaryConcerns);
    const routine = generateSkincareRoutine(skinType, primaryConcerns);
    const tips = generateSkincareTips(skinType, primaryConcerns, answers);

    return {
      skinType,
      primaryConcerns,
      skinScore: Math.max(skinScore, 40),
      recommendations,
      routine,
      tips,
      schedule: generateSchedule(skinType)
    };
  };

  const generateProductRecommendations = (skinType: string, concerns: string[]) => {
    const products = {
      cleanser: { name: '', description: '', usage: '' },
      toner: { name: '', description: '', usage: '' },
      serum: { name: '', description: '', usage: '' },
      moisturizer: { name: '', description: '', usage: '' },
      sunscreen: { name: '', description: '', usage: '' }
    };

    // Cleanser recommendations
    switch (skinType) {
      case 'Oily':
        products.cleanser = {
          name: 'Salicylic Acid Foaming Cleanser',
          description: 'Deep-cleansing foam that removes excess oil and unclogs pores',
          usage: 'Use twice daily, morning and evening'
        };
        break;
      case 'Dry':
        products.cleanser = {
          name: 'Gentle Cream Cleanser',
          description: 'Hydrating cleanser that removes impurities without stripping natural oils',
          usage: 'Use twice daily with lukewarm water'
        };
        break;
      case 'Sensitive':
        products.cleanser = {
          name: 'Fragrance-Free Gentle Cleanser',
          description: 'Mild, non-irritating formula perfect for sensitive skin',
          usage: 'Use once or twice daily as tolerated'
        };
        break;
      default:
        products.cleanser = {
          name: 'Balanced pH Gel Cleanser',
          description: 'Gentle yet effective cleanser suitable for all skin types',
          usage: 'Use twice daily, morning and evening'
        };
    }

    // Toner recommendations
    if (skinType === 'Oily') {
      products.toner = {
        name: 'BHA Clarifying Toner',
        description: 'Helps control oil production and minimize pores',
        usage: 'Apply with cotton pad after cleansing, evening only initially'
      };
    } else if (skinType === 'Dry') {
      products.toner = {
        name: 'Hyaluronic Acid Hydrating Toner',
        description: 'Provides deep hydration and plumps the skin',
        usage: 'Pat gently into skin after cleansing, twice daily'
      };
    } else {
      products.toner = {
        name: 'Rose Water Balancing Toner',
        description: 'Natural toner that balances pH and provides gentle hydration',
        usage: 'Apply with cotton pad or pat into skin after cleansing'
      };
    }

    // Serum recommendations based on concerns
    if (concerns.includes('Dark Spots')) {
      products.serum = {
        name: 'Vitamin C Brightening Serum',
        description: 'Powerful antioxidant that fades dark spots and evens skin tone',
        usage: 'Apply in the morning before moisturizer, start 3x per week'
      };
    } else if (concerns.includes('Fine Lines/Wrinkles')) {
      products.serum = {
        name: 'Retinol Anti-Aging Serum',
        description: 'Stimulates cell turnover and reduces signs of aging',
        usage: 'Apply at night, start 2x per week and gradually increase'
      };
    } else if (concerns.includes('Acne/Breakouts')) {
      products.serum = {
        name: 'Niacinamide Pore Refining Serum',
        description: 'Reduces oil production and minimizes breakouts',
        usage: 'Apply twice daily after toner'
      };
    } else {
      products.serum = {
        name: 'Hyaluronic Acid Hydrating Serum',
        description: 'Provides intense hydration and plumps the skin',
        usage: 'Apply to damp skin before moisturizer, twice daily'
      };
    }

    // Moisturizer recommendations
    switch (skinType) {
      case 'Oily':
        products.moisturizer = {
          name: 'Oil-Free Gel Moisturizer',
          description: 'Lightweight, non-comedogenic formula that hydrates without clogging pores',
          usage: 'Apply twice daily as the last step in your routine'
        };
        break;
      case 'Dry':
        products.moisturizer = {
          name: 'Rich Ceramide Cream',
          description: 'Deeply nourishing cream that restores the skin barrier',
          usage: 'Apply generously twice daily, especially after showering'
        };
        break;
      default:
        products.moisturizer = {
          name: 'Balanced Hydrating Lotion',
          description: 'Perfect balance of hydration for normal to combination skin',
          usage: 'Apply twice daily after serum'
        };
    }

    // Sunscreen recommendation
    products.sunscreen = {
      name: 'Broad Spectrum SPF 30+ Sunscreen',
      description: 'Essential protection against UV damage and premature aging',
      usage: 'Apply every morning as the final step, reapply every 2 hours'
    };

    return products;
  };

  const generateSkincareRoutine = (skinType: string, concerns: string[]) => {
    const morning = [
      { step: 1, product: 'Gentle Cleanser', instruction: 'Cleanse face with lukewarm water' },
      { step: 2, product: 'Toner', instruction: 'Apply toner to balance skin pH' },
      { step: 3, product: 'Vitamin C Serum', instruction: 'Apply serum for antioxidant protection' },
      { step: 4, product: 'Moisturizer', instruction: 'Hydrate and protect skin barrier' },
      { step: 5, product: 'Sunscreen SPF 30+', instruction: 'Apply generously for UV protection' }
    ];

    const evening = [
      { step: 1, product: 'Cleanser', instruction: 'Remove makeup and daily impurities' },
      { step: 2, product: 'Toner', instruction: 'Prepare skin for treatment products' },
      { step: 3, product: 'Treatment Serum', instruction: 'Apply targeted treatment for concerns' },
      { step: 4, product: 'Night Moisturizer', instruction: 'Nourish and repair overnight' }
    ];

    return { morning, evening };
  };

  const generateSkincareTips = (skinType: string, concerns: string[], answers: Record<number, string | string[]>) => {
    const tips = [
      'Always patch test new products before full application',
      'Introduce new products one at a time to monitor reactions',
      'Be consistent with your routine for at least 4-6 weeks to see results'
    ];

    if (skinType === 'Oily') {
      tips.push('Avoid over-cleansing as it can increase oil production');
      tips.push('Use blotting papers instead of washing face multiple times');
    }

    if (skinType === 'Dry') {
      tips.push('Apply moisturizer to damp skin to lock in hydration');
      tips.push('Use a humidifier in dry environments');
    }

    if (concerns.includes('Acne/Breakouts')) {
      tips.push('Avoid touching your face throughout the day');
      tips.push('Change pillowcases regularly to prevent bacteria buildup');
    }

    if (answers[8] === 'Never' || answers[8] === 'Rarely') {
      tips.push('Sunscreen is crucial - UV damage is the #1 cause of premature aging');
    }

    return tips;
  };

  const generateSchedule = (skinType: string) => {
    return `Week 1-2: Start with basic routine (cleanser, moisturizer, sunscreen)
Week 3-4: Introduce toner gradually
Week 5-6: Add serum 2-3 times per week
Week 7+: Full routine with all products as tolerated

Monthly: Assess skin changes and adjust products as needed
Quarterly: Consider professional skin consultation`;
  };

  const resetSurvey = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setAnalysis(null);
    setSurveyCompleted(false);
  };

  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analyzing Your Skin
            </h2>
            <p className="text-gray-600 mb-4">
              Our AI is processing your responses to create personalized skincare recommendations...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (surveyCompleted && analysis) {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Your Personalized Skin Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Based on your responses, here's your customized skincare plan
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Skin Profile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Skin Profile</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Skin Type</h4>
                  <div className="px-4 py-2 bg-pink-100 text-pink-800 rounded-lg font-medium">
                    {analysis.skinType}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Primary Concerns</h4>
                  <div className="space-y-2">
                    {analysis.primaryConcerns.map((concern, index) => (
                      <div key={index} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
                        {concern}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Skin Health Score</h4>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <motion.div
                        className={`h-4 rounded-full ${
                          analysis.skinScore >= 80 ? 'bg-green-500' :
                          analysis.skinScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.skinScore}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="text-center mt-2 font-bold text-lg">
                      {analysis.skinScore}/100
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Recommended Products</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(analysis.recommendations).map(([type, product], index) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                          {type === 'cleanser' && <Droplets className="h-5 w-5 text-white" />}
                          {type === 'toner' && <Sparkles className="h-5 w-5 text-white" />}
                          {type === 'serum' && <Sun className="h-5 w-5 text-white" />}
                          {type === 'moisturizer' && <Moon className="h-5 w-5 text-white" />}
                          {type === 'sunscreen' && <Sun className="h-5 w-5 text-white" />}
                        </div>
                        <h4 className="font-bold text-gray-800 capitalize">{type}</h4>
                      </div>
                      <h5 className="font-semibold text-gray-700 mb-2">{product.name}</h5>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="text-xs text-pink-600 bg-pink-50 p-2 rounded">
                        <strong>Usage:</strong> {product.usage}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Skincare Routine */}
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Daily Routine</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <Sun className="h-6 w-6 text-yellow-500 mr-2" />
                      <h4 className="text-xl font-bold text-gray-800">Morning Routine</h4>
                    </div>
                    <div className="space-y-3">
                      {analysis.routine.morning.map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                            {step.step}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{step.product}</div>
                            <div className="text-sm text-gray-600">{step.instruction}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <Moon className="h-6 w-6 text-purple-500 mr-2" />
                      <h4 className="text-xl font-bold text-gray-800">Evening Routine</h4>
                    </div>
                    <div className="space-y-3">
                      {analysis.routine.evening.map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                            {step.step}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{step.product}</div>
                            <div className="text-sm text-gray-600">{step.instruction}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Implementation Schedule */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-pink-600 mr-2" />
                  <h3 className="text-xl font-bold text-pink-800">Implementation Schedule</h3>
                </div>
                <div className="whitespace-pre-line text-pink-700 leading-relaxed">
                  {analysis.schedule}
                </div>
              </div>

              {/* Expert Tips */}
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Expert Tips for Your Skin</h3>
                <div className="space-y-3">
                  {analysis.tips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={resetSurvey}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Take Survey Again
                </button>
              </div>
            </motion.div>
          </div>
        </div>
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
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Skin+ Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take our comprehensive skin survey to get personalized product recommendations and skincare routine
          </p>
        </motion.div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.type === 'single' && (
                <>
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                        answers[currentQ.id] === option
                          ? 'border-pink-500 bg-pink-50 text-pink-800'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </>
              )}

              {currentQ.type === 'multiple' && (
                <>
                  {currentQ.options.map((option, index) => {
                    const selectedOptions = (answers[currentQ.id] as string[]) || [];
                    const isSelected = selectedOptions.includes(option);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const currentSelections = (answers[currentQ.id] as string[]) || [];
                          let newSelections;
                          if (isSelected) {
                            newSelections = currentSelections.filter(item => item !== option);
                          } else {
                            newSelections = [...currentSelections, option];
                          }
                          handleAnswerSelect(currentQ.id, newSelections);
                        }}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 text-pink-800'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded border-2 mr-3 ${
                            isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-400'
                          }`}>
                            {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          {option}
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {currentQ.type === 'scale' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  <div className="flex justify-between">
                    {currentQ.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQ.id, option)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          answers[currentQ.id] === option
                            ? 'border-pink-500 bg-pink-500 text-white'
                            : 'border-gray-300 hover:border-pink-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Selected: {answers[currentQ.id] || 'None'}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={!isAnswered}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {currentQuestion === questions.length - 1 ? 'Complete Survey' : 'Next'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysisPage;