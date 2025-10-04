import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

interface UserHistory {
  symptoms: Array<{
    id: string;
    date: string;
    symptoms: string[];
    severity: number;
    emotionalState: number;
    prediction: string;
    recommendations: string[];
  }>;
  reports: Array<{
    id: string;
    date: string;
    fileName: string;
    analysis: string;
    recommendations: string[];
  }>;
  quizzes: Array<{
    id: string;
    date: string;
    score: number;
    totalQuestions: number;
  }>;
  skinAnalyses: Array<{
    id: string;
    date: string;
    skinType: string;
    concerns: string[];
    score: number;
    recommendations: any;
  }>;
}

interface UserContextType {
  user: User | null;
  userHistory: UserHistory;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addSymptomRecord: (record: any) => void;
  addReportRecord: (record: any) => void;
  addQuizRecord: (record: any) => void;
  addSkinAnalysisRecord: (record: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userHistory, setUserHistory] = useState<UserHistory>({
    symptoms: [],
    reports: [],
    quizzes: [],
    skinAnalyses: []
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('mediMateUser');
    const savedHistory = localStorage.getItem('mediMateHistory');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedHistory) {
      setUserHistory(JSON.parse(savedHistory));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple validation - in a real app, this would be server-side
    const users = JSON.parse(localStorage.getItem('mediMateUsers') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('mediMateUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('mediMateUsers') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      joinDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('mediMateUsers', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('mediMateUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediMateUser');
  };

  const addSymptomRecord = (record: any) => {
    const updatedHistory = {
      ...userHistory,
      symptoms: [...userHistory.symptoms, record]
    };
    setUserHistory(updatedHistory);
    localStorage.setItem('mediMateHistory', JSON.stringify(updatedHistory));
  };

  const addReportRecord = (record: any) => {
    const updatedHistory = {
      ...userHistory,
      reports: [...userHistory.reports, record]
    };
    setUserHistory(updatedHistory);
    localStorage.setItem('mediMateHistory', JSON.stringify(updatedHistory));
  };

  const addQuizRecord = (record: any) => {
    const updatedHistory = {
      ...userHistory,
      quizzes: [...userHistory.quizzes, record]
    };
    setUserHistory(updatedHistory);
    localStorage.setItem('mediMateHistory', JSON.stringify(updatedHistory));
  };

  const addSkinAnalysisRecord = (record: any) => {
    const updatedHistory = {
      ...userHistory,
      skinAnalyses: [...userHistory.skinAnalyses, record]
    };
    setUserHistory(updatedHistory);
    localStorage.setItem('mediMateHistory', JSON.stringify(updatedHistory));
  };

  const value = {
    user,
    userHistory,
    login,
    signup,
    logout,
    addSymptomRecord,
    addReportRecord,
    addQuizRecord,
    addSkinAnalysisRecord
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};