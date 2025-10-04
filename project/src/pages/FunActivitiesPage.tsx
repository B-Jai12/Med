import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Wind, Trophy, RotateCcw, CheckCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const FunActivitiesPage: React.FC = () => {
  const { user, addQuizRecord } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathCycle, setBreathCycle] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [breathCount, setBreathCount] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "How much water should an average adult drink per day?",
      options: ["4-6 glasses", "8-10 glasses", "12-14 glasses", "2-3 glasses"],
      correct: 1,
      explanation: "Most adults should drink about 8-10 glasses (64-80 oz) of water daily to maintain proper hydration."
    },
    {
      id: 2,
      question: "What is the recommended amount of sleep for adults?",
      options: ["5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours"],
      correct: 1,
      explanation: "Adults should get 7-9 hours of quality sleep per night for optimal health and cognitive function."
    },
    {
      id: 3,
      question: "How often should you exercise per week for basic health?",
      options: ["Once a week", "Daily", "At least 150 minutes", "Only weekends"],
      correct: 2,
      explanation: "The WHO recommends at least 150 minutes of moderate aerobic activity per week for adults."
    },
    {
      id: 4,
      question: "What is the normal resting heart rate for adults?",
      options: ["40-50 bpm", "60-100 bpm", "110-120 bpm", "30-40 bpm"],
      correct: 1,
      explanation: "A normal resting heart rate for adults ranges from 60 to 100 beats per minute."
    },
    {
      id: 5,
      question: "Which vitamin is primarily obtained from sunlight?",
      options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"],
      correct: 2,
      explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight."
    }
  ];

  const wellnessTips = [
    "Start your day with a glass of water to kickstart your metabolism and hydrate your body after hours of rest.",
    "Take a 10-minute walk after meals to improve digestion and help regulate blood sugar levels.",
    "Practice deep breathing for 5 minutes daily to reduce stress and improve mental clarity.",
    "Eat the rainbow - include colorful fruits and vegetables in your diet for diverse nutrients and antioxidants.",
    "Get 15-20 minutes of sunlight exposure daily to boost vitamin D production and improve mood.",
    "Practice the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to rest your eyes.",
    "Keep a gratitude journal - writing down 3 things you're grateful for can improve mental health and sleep quality.",
    "Limit screen time before bed to improve sleep quality and reduce blue light exposure.",
    "Stay socially connected - regular interaction with friends and family is crucial for mental health.",
    "Listen to music or engage in creative activities to reduce stress and boost cognitive function."
  ];

  useEffect(() => {
    // Set daily tip
    const today = new Date().getDate();
    setDailyTip(wellnessTips[today % wellnessTips.length]);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      if (user) {
        const record = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score: score,
          totalQuestions: questions.length
        };
        addQuizRecord(record);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathCount(0);
    startBreathCycle();
  };

  const startBreathCycle = () => {
    let currentCycle = 0;
    const cycles = ['inhale', 'hold', 'exhale', 'rest'] as const;
    const durations = [4000, 4000, 6000, 2000]; // milliseconds

    const runCycle = () => {
      setBreathCycle(cycles[currentCycle]);
      
      setTimeout(() => {
        currentCycle = (currentCycle + 1) % cycles.length;
        if (currentCycle === 0) {
          setBreathCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setBreathingActive(false);
              setBreathCycle('rest');
              return 0;
            }
            return newCount;
          });
        }
        
        if (currentCycle !== 0 || breathCount < 4) {
          runCycle();
        }
      }, durations[currentCycle]);
    };

    runCycle();
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setBreathCycle('rest');
    setBreathCount(0);
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
            Fun Health Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Engage with interactive health content, test your knowledge, and practice wellness exercises
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Health Quiz Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Brain className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Health Knowledge Quiz</h2>
            </div>

            {!quizCompleted ? (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Question {currentQuestion + 1} of {questions.length}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !showResult && handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                          showResult
                            ? index === questions[currentQuestion].correct
                              ? 'border-green-500 bg-green-100 text-green-800'
                              : index === selectedAnswer
                              ? 'border-red-500 bg-red-100 text-red-800'
                              : 'border-gray-300 bg-gray-100 text-gray-600'
                            : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-100 text-blue-800'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-start">
                        {selectedAnswer === questions[currentQuestion].correct ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 bg-red-500 rounded-full mr-2 mt-0.5 flex items-center justify-center">
                            <span className="text-white text-xs">✕</span>
                          </div>
                        )}
                        <p className="text-gray-700 text-sm">
                          {questions[currentQuestion].explanation}
                        </p>
                      </div>
                      
                      <button
                        onClick={nextQuestion}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Quiz Completed!
                </h3>
                <p className="text-xl text-gray-600 mb-6">
                  Your Score: {score} out of {questions.length}
                </p>
                <div className="mb-6">
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    {score === questions.length ? 'Perfect! You\'re a health expert!' :
                     score >= questions.length * 0.8 ? 'Great job! You know your health facts!' :
                     score >= questions.length * 0.6 ? 'Good work! Keep learning about health!' :
                     'Keep studying! Health knowledge is important!'}
                  </div>
                </div>
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Take Quiz Again
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar Activities */}
          <div className="space-y-8">
            {/* Daily Wellness Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Daily Wellness Tip</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {dailyTip}
              </p>
              <button
                onClick={() => {
                  const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
                  setDailyTip(randomTip);
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Get Another Tip →
              </button>
            </motion.div>

            {/* Breathing Exercise */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Wind className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Breathing Exercise</h3>
              </div>
              
              <div className="text-center">
                <div className="relative mb-6">
                  <motion.div
                    className={`mx-auto w-32 h-32 rounded-full border-4 flex items-center justify-center text-white font-bold text-lg ${
                      breathCycle === 'inhale' ? 'bg-blue-500 border-blue-600' :
                      breathCycle === 'hold' ? 'bg-yellow-500 border-yellow-600' :
                      breathCycle === 'exhale' ? 'bg-green-500 border-green-600' :
                      'bg-gray-400 border-gray-500'
                    }`}
                    animate={{
                      scale: breathCycle === 'inhale' ? 1.2 : breathCycle === 'exhale' ? 0.8 : 1
                    }}
                    transition={{ duration: breathCycle === 'inhale' ? 4 : breathCycle === 'exhale' ? 6 : 1 }}
                  >
                    {breathingActive ? (
                      <div className="text-center">
                        <div className="capitalize font-bold">
                          {breathCycle === 'rest' ? 'Ready' : breathCycle}
                        </div>
                        {breathingActive && (
                          <div className="text-sm">
                            {breathCount}/5
                          </div>
                        )}
                      </div>
                    ) : (
                      <Wind className="h-8 w-8" />
                    )}
                  </motion.div>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                  {breathingActive ? (
                    <>
                      {breathCycle === 'inhale' && 'Breathe in slowly...'}
                      {breathCycle === 'hold' && 'Hold your breath...'}
                      {breathCycle === 'exhale' && 'Breathe out slowly...'}
                      {breathCycle === 'rest' && 'Get ready for next cycle...'}
                    </>
                  ) : (
                    'Practice 4-4-6 breathing: Inhale for 4s, hold for 4s, exhale for 6s'
                  )}
                </div>

                {!breathingActive ? (
                  <button
                    onClick={startBreathingExercise}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Start Exercise
                  </button>
                ) : (
                  <button
                    onClick={stopBreathingExercise}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Stop Exercise
                  </button>
                )}
              </div>
            </motion.div>

            {/* Quick Health Stats */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-bold mb-4">Your Health Journey</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Quizzes Taken:</span>
                    <span className="font-semibold">{user ? '0' : '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Checks:</span>
                    <span className="font-semibold">{user ? '0' : '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reports Analyzed:</span>
                    <span className="font-semibold">{user ? '0' : '0'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunActivitiesPage;