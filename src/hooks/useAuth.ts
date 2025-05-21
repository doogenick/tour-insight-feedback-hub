
import { useState, useCallback } from 'react';
import { useToast } from '../components/ui/use-toast';

export type UserRole = 'admin' | 'guide' | 'driver' | 'client';

export interface User {
  name: string;
  role: UserRole;
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  const loginUser = useCallback((name: string, role: UserRole): void => {
    setCurrentUser({ name, role });
    toast({
      title: "Logged In",
      description: `Welcome, ${name}!`,
      duration: 3000,
    });
  }, [toast]);
  
  const logoutUser = useCallback((): void => {
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
      duration: 3000,
    });
  }, [toast]);

  return {
    currentUser,
    loginUser,
    logoutUser
  };
}
