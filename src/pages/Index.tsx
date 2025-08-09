
import React from 'react';
import { useIsMobile, useIsTablet } from '../hooks/use-mobile';
import MobileFeedbackPage from './MobileFeedbackPage';
import FeedbackPage from './FeedbackPage';

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Use mobile-optimized flow for mobile and tablet devices
  if (isMobile || isTablet) {
    return <MobileFeedbackPage />;
  }
  
  return <FeedbackPage />;
};

export default Index;
