
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useLocation } from 'react-router-dom';
import { Wifi, WifiOff } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-tour-primary">Tour Feedback</h1>
          <div className="ml-3 flex items-center">
            {isOnline ? (
              <div className="flex items-center text-xs text-tour-success">
                <Wifi size={14} className="mr-1" />
                <span>Online</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-destructive">
                <WifiOff size={14} className="mr-1" />
                <span>Offline</span>
              </div>
            )}
          </div>
        </div>

        <Tabs value={location.pathname} className="w-auto">
          <TabsList>
            <TabsTrigger value="/" asChild>
              <Link to="/">Submit Feedback</Link>
            </TabsTrigger>
            <TabsTrigger value="/admin" asChild>
              <Link to="/admin">Admin</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};

export default Header;
