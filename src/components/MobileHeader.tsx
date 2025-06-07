
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
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {currentUser?.name || 'Admin User'}
            </h2>
            {isDemoMode && (
              <p className="text-sm opacity-90">Demo Mode</p>
            )}
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
