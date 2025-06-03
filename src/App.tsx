import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<ComprehensiveAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
