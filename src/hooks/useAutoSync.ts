import { useState, useEffect, useRef } from 'react';
import { useWifiConnection } from './useWifiConnection';
import { syncService } from '../services/syncService';
import { useToast } from '../components/ui/use-toast';

export function useAutoSync() {
  const { isOnline } = useWifiConnection();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [itemsToSync, setItemsToSync] = useState(0);
  const [lastSyncAttempt, setLastSyncAttempt] = useState<Date | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Check for items to sync
  const checkItemsToSync = async () => {
    try {
      const count = await syncService.getItemsToSync();
      setItemsToSync(count);
      return count;
    } catch (error) {
      console.error('Error checking items to sync:', error);
      return 0;
    }
  };

  // Auto-sync with exponential backoff retry logic
  const attemptAutoSync = async (isRetry = false) => {
    if (isSyncing || !isOnline) return;

    const itemCount = await checkItemsToSync();
    if (itemCount === 0) return;

    setIsSyncing(true);
    setLastSyncAttempt(new Date());

    try {
      const result = await syncService.syncToSupabase();
      
      if (result.success) {
        toast({
          title: "Auto-Sync Complete",
          description: `Successfully synced ${result.synced} items`,
          duration: 3000
        });
        retryCountRef.current = 0;
        await checkItemsToSync();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Auto-sync failed:', error);
      
      // Implement exponential backoff retry
      retryCountRef.current++;
      const maxRetries = 5;
      
      if (retryCountRef.current < maxRetries && isOnline) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000); // Max 30 seconds
        
        toast({
          title: "Sync Failed",
          description: `Retrying in ${retryDelay / 1000} seconds... (Attempt ${retryCountRef.current}/${maxRetries})`,
          variant: "destructive",
          duration: 3000
        });

        syncTimeoutRef.current = setTimeout(() => {
          attemptAutoSync(true);
        }, retryDelay);
      } else if (retryCountRef.current >= maxRetries) {
        toast({
          title: "Sync Failed",
          description: "Maximum retry attempts reached. Please sync manually when connection improves.",
          variant: "destructive",
          duration: 5000
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual sync function
  const manualSync = async () => {
    if (isSyncing || !isOnline) {
      if (!isOnline) {
        toast({
          variant: "destructive",
          title: "No Internet Connection",
          description: "Please connect to the internet to sync your data."
        });
      }
      return { success: false, message: "Sync already in progress or no connection" };
    }

    setIsSyncing(true);
    retryCountRef.current = 0; // Reset retry count for manual sync

    try {
      const result = await syncService.syncToSupabase();
      
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: result.message
        });
        await checkItemsToSync();
      } else {
        toast({
          variant: "destructive",
          title: "Sync Failed",
          description: result.message
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = "An error occurred while syncing data.";
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: errorMessage
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsSyncing(false);
    }
  };

  // Effect for monitoring connection changes and auto-syncing
  useEffect(() => {
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    if (isOnline) {
      // When coming online, wait a moment for connection to stabilize, then sync
      syncTimeoutRef.current = setTimeout(() => {
        attemptAutoSync();
      }, 2000);
    } else {
      // When going offline, reset retry count
      retryCountRef.current = 0;
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isOnline]);

  // Check items to sync on mount
  useEffect(() => {
    checkItemsToSync();
  }, []);

  return {
    isSyncing,
    itemsToSync,
    lastSyncAttempt,
    manualSync,
    checkItemsToSync,
    isOnline
  };
}