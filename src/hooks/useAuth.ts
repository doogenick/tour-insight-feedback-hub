
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'guide' | 'driver' | 'client';

export interface User {
  name: string;
  role: UserRole;
  email?: string;
}

// Check if demo mode is enabled
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-login for demo mode
  useEffect(() => {
    if (isDemoMode && !currentUser) {
      demoLogin();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const loginUser = useCallback((name: string, role: UserRole, email?: string): void => {
    const user = { name, role, email };
    setCurrentUser(user);
    
    // In demo mode, don't show login success toast
    if (!isDemoMode) {
      toast({
        title: "Logged In",
        description: `Welcome, ${name}!`,
        duration: 3000,
      });
    }
  }, [toast]);
  
  const demoLogin = useCallback((): void => {
    const demoUser = { 
      name: 'Demo Admin', 
      role: 'admin' as UserRole,
      email: 'demo@example.com' 
    };
    setCurrentUser(demoUser);
    setIsLoading(false);
    
    // Store in localStorage to persist across page refreshes
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
  }, []);
  
  const logoutUser = useCallback((): void => {
    if (isDemoMode) {
      // In demo mode, just refresh the page to reset to demo user
      window.location.href = '/';
      return;
    }
    
    setCurrentUser(null);
    localStorage.removeItem('demoUser');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
      duration: 3000,
    });
  }, [toast]);

  // Check if user has admin role
  const isAdmin = currentUser?.role === 'admin';

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin,
    isLoading,
    isDemoMode,
    loginUser,
    logoutUser,
    demoLogin
  };
}
