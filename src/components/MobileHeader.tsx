
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { User, Settings, Menu } from 'lucide-react';

const MobileHeader: React.FC = () => {
  const { currentUser, isDemoMode } = useAuth();

  return (
    <Card className="w-full p-4 mb-6 bg-tour-primary text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Nomadtours Logo" className="h-10 w-auto" />
          <div>
            <h2 className="text-lg font-semibold">
              Nomadtours Feedback
            </h2>
            <p className="text-sm opacity-90">
              {currentUser?.name || 'Admin User'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MobileHeader;
