
import { useState, useCallback } from 'react';
import { feedbackService, Feedback } from '../services/api';
import { useToast } from '../components/ui/use-toast';

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ synced: number; failed: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  const fetchFeedback = useCallback(async (tourId?: string): Promise<void> => {
    setIsLoading(true);
    try {
      let feedbackData: Feedback[];
      
      if (tourId) {
        feedbackData = await feedbackService.getFeedbackByTour(tourId);
      } else {
        feedbackData = await feedbackService.getAllFeedback();
      }
      
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const submitFeedback = useCallback(async (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => {
    setIsSubmitting(true);
    try {
      const result = await feedbackService.submitFeedback(feedbackData);
      
      toast({
        title: "Success!",
        description: result.message,
        duration: 5000,
      });
      
      return result;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Your feedback has been saved locally.",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  const syncPendingFeedback = useCallback(async (): Promise<void> => {
    try {
      const status = await feedbackService.syncPendingFeedback();
      setSyncStatus(status);
      
      if (status.synced > 0) {
        toast({
          title: "Sync Complete",
          description: `${status.synced} feedback submissions synchronized successfully.`,
          duration: 5000,
        });
      }
      
      if (status.failed > 0) {
        toast({
          variant: "destructive",
          title: "Sync Issues",
          description: `${status.failed} feedback submissions failed to sync.`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error syncing feedback:', error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Failed to synchronize feedback data.",
      });
    }
  }, [toast]);

  const exportFeedback = useCallback(async (): Promise<Blob> => {
    setIsLoading(true);
    try {
      return await feedbackService.exportFeedbackToCsv();
    } catch (error) {
      console.error('Error exporting feedback:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export feedback data.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    feedback,
    isSubmitting,
    syncStatus,
    isLoading,
    fetchFeedback,
    submitFeedback,
    syncPendingFeedback,
    exportFeedback
  };
}
