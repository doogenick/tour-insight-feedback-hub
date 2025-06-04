
import { useAppContext } from '../contexts/AppContext';

export type UserRole = 'admin' | 'guide' | 'driver' | 'client';

export interface User {
  name: string;
  role: UserRole;
  email?: string;
}

// Check if demo mode is enabled
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export function useAuth() {
  const { currentUser, loginUser, logoutUser } = useAppContext();

  // Check if user has admin role
  const isAdmin = currentUser?.role === 'admin';

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin,
    isLoading: false,
    isDemoMode,
    loginUser,
    logoutUser
  };
}
