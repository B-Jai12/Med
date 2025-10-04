import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuickcheckPage from './pages/QuickcheckPage';
import ReportScannerPage from './pages/ReportScannerPage';
import FunActivitiesPage from './pages/FunActivitiesPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SkinAnalysisPage from './pages/SkinAnalysisPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quickcheck" element={<QuickcheckPage />} />
            <Route path="/report-scanner" element={<ReportScannerPage />} />
            <Route path="/fun-activities" element={<FunActivitiesPage />} />
            <Route path="/skin-analysis" element={<SkinAnalysisPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;