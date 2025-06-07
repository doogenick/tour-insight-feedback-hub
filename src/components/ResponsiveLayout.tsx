
import React from 'react';
import { useIsMobile, useIsTablet, useIsDesktop } from '../hooks/use-mobile';
import MobileHeader from './MobileHeader';
import Header from './Header';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <div className="min-h-screen bg-background">
      {/* Conditional Header based on screen size */}
      {isMobile || isTablet ? <MobileHeader /> : <Header />}
      
      {/* Main content with responsive padding and spacing */}
      <main className={`
        container mx-auto py-6
        ${isMobile ? 'px-2' : ''}
        ${isTablet ? 'px-4 max-w-4xl' : ''}
        ${isDesktop ? 'px-6 max-w-6xl' : ''}
      `}>
        {children}
      </main>
    </div>
  );
};

export default ResponsiveLayout;
