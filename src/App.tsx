
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';
import FeedbackStartPage from './pages/FeedbackStartPage';
import TourFeedbackSessionPage from './pages/TourFeedbackSessionPage';
import ComprehensiveFeedbackFormPage from './pages/ComprehensiveFeedbackFormPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';

// Mobile-specific pages
import MobileFeedbackHome from './pages/MobileFeedbackHome';
import MobileFeedbackSession from './pages/MobileFeedbackSession';
import MobileFeedbackForm from './pages/MobileFeedbackForm';

import { Toaster } from './components/ui/toaster';
import ResponsiveLayout from './components/ResponsiveLayout';
import { useIsMobile, useIsTablet } from './hooks/use-mobile';
import { useWifiConnection } from './hooks/useWifiConnection';

const queryClient = new QueryClient();

// Simple mobile detection for Capacitor
const isMobileApp = () => {
  return window.location.href.includes('capacitor://') || 
         window.location.href.includes('localhost') ||
         /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Mobile/Tablet demo banner
const MobileDemoBanner = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  if (!isMobile && !isTablet) return null;
  
  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <svg className="fill-current h-5 w-5 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-3a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-sm">{isTablet ? 'Tablet' : 'Mobile'} Demo Mode</p>
          <p className="text-xs">Full admin access enabled for {isTablet ? 'tablet' : 'mobile'} use</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileAppEnvironment = isMobileApp();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ResponsiveLayout>
          <MobileDemoBanner />
          <Routes>
            {/* Mobile app routes - prioritize mobile interface for Capacitor */}
            {isMobileAppEnvironment ? (
              <>
                <Route path="/" element={<MobileFeedbackHome />} />
                <Route path="/mobile" element={<MobileFeedbackHome />} />
                <Route path="/mobile-feedback/:tourId" element={<MobileFeedbackSession />} />
                <Route path="/mobile-feedback-form/:tourId" element={<MobileFeedbackForm />} />
                {/* Fallback all other routes to mobile home for simplicity */}
                <Route path="*" element={<MobileFeedbackHome />} />
              </>
            ) : (
              <>
                {/* Web/Desktop routes */}
                <Route path="/" element={<Index />} />
                
                {/* Crew feedback collection routes */}
                <Route path="/feedback" element={<FeedbackStartPage />} />
                <Route path="/tour/:tourId/feedback" element={<TourFeedbackSessionPage />} />
                <Route path="/tour/:tourId/feedback/new" element={<ComprehensiveFeedbackFormPage />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/analytics" element={<ComprehensiveAnalytics />} />
                
                {/* Mobile routes for testing on desktop */}
                <Route path="/mobile" element={<MobileFeedbackHome />} />
                <Route path="/mobile-feedback/:tourId" element={<MobileFeedbackSession />} />
                <Route path="/mobile-feedback-form/:tourId" element={<MobileFeedbackForm />} />
                
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
          <Toaster />
        </ResponsiveLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
