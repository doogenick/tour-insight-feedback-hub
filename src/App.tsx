import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './hooks/useAuth';
import Index from './pages/Index';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client for React Query
const queryClient = new QueryClient();

// Demo mode banner component
const DemoModeBanner = () => {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-3a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Demo Mode</p>
          <p className="text-sm">You are currently in demo mode with admin access.</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { isDemoMode } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {isDemoMode && <DemoModeBanner />}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                
                {/* Protected admin routes */}
                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/analytics" element={<ComprehensiveAnalytics />} />
                </Route>
                
                {/* Public routes */}
                <Route path="/unauthorized" element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
                    <p>You don't have permission to view this page.</p>
                    <button 
                      onClick={() => window.history.back()}
                      className="mt-4 px-4 py-2 bg-tour-primary text-white rounded hover:bg-tour-secondary"
                    >
                      Go Back
                    </button>
                  </div>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
