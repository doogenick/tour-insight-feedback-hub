
import { useAppContext } from '../contexts/AppContext';

export type UserRole = 'admin' | 'guide' | 'driver' | 'client';

export interface User {
  name: string;
  role: UserRole;
  email?: string;
}

export function useAuth() {
  const { currentUser, loginUser, logoutUser } = useAppContext();

  // Mobile demo mode - always admin access
  return {
    currentUser: currentUser || { name: 'Admin User', role: 'admin' as UserRole },
    isAuthenticated: true, // Always authenticated for mobile demo
    isAdmin: true, // Always admin for mobile demo
    isLoading: false,
    isDemoMode: true, // Always demo mode for mobile
    loginUser,
    logoutUser
  };
}
