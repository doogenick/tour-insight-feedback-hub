import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { currentUser, isAdmin, isDemoMode, logoutUser } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Tour Insight Feedback Hub
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-foreground/80 transition-colors">
              Home
            </Link>
            <Link to="/feedback" className="hover:text-primary-foreground/80 transition-colors">
              Feedback
            </Link>
            
            {/* Show admin links to admins or in demo mode */}
            {(isAdmin || isDemoMode) && (
              <>
                <Link to="/admin" className="hover:text-primary-foreground/80 transition-colors">
                  Admin
                </Link>
                <Link to="/analytics" className="hover:text-primary-foreground/80 transition-colors">
                  Analytics
                </Link>
              </>
            )}
            
            {currentUser ? (
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center">
                  <span className="bg-primary-foreground/10 px-3 py-1 rounded-full text-sm flex items-center">
                    {isDemoMode && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    )}
                    {currentUser.name}
                    {isAdmin && (
                      <span className="ml-2 bg-primary-foreground/20 px-2 py-0.5 rounded text-xs">
                        Admin
                      </span>
                    )}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logoutUser}
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  {isDemoMode ? 'Reset Demo' : 'Logout'}
                </Button>
              </div>
            ) : (
              <div className="text-sm text-primary-foreground/80">
                {isDemoMode ? 'Demo Mode Active' : 'Please log in for full access'}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
