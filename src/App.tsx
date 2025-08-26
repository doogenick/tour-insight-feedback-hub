
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';

import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';
import { Toaster } from './components/ui/toaster';
import ResponsiveLayout from './components/ResponsiveLayout';
import { useIsMobile, useIsTablet } from './hooks/use-mobile';

const queryClient = new QueryClient();

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
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ResponsiveLayout>
          <MobileDemoBanner />
          <Routes>
            <Route path="/" element={<Index />} />
            
            
            {/* All routes accessible in demo mode */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics" element={<ComprehensiveAnalytics />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ResponsiveLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
