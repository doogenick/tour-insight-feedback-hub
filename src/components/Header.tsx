import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAppContext } from '../contexts/AppContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Nomad Africa Feedback
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-foreground/80">
              Home
            </Link>
            <Link to="/feedback" className="hover:text-primary-foreground/80">
              Feedback
            </Link>
            {currentUser && (
              <>
                <Link to="/admin" className="hover:text-primary-foreground/80">
                  Admin
                </Link>
                <Link to="/analytics" className="hover:text-primary-foreground/80">
                  Analytics
                </Link>
              </>
            )}
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Welcome, {currentUser.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="text-sm text-primary-foreground/80">
                Please log in to access admin features
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
