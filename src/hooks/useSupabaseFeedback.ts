import { useState, useCallback } from 'react';
import { feedbackSupabaseService } from '@/services/supabaseServices';
import { useToast } from '@/components/ui/use-toast';

export function useSupabaseFeedback() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const submitFeedback = useCallback(async (feedbackData: any) => {
    try {
      const newFeedback = await feedbackSupabaseService.submitFeedback(feedbackData);
      setFeedback(prev => [newFeedback, ...prev]);
      toast({
        title: "Success",
        description: "Feedback submitted successfully.",
      });
      return newFeedback;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback.",
      });
      throw error;
    }
  }, [toast]);

  const fetchFeedbackByTour = useCallback(async (tourId: string) => {
    setIsLoading(true);
    try {
      const data = await feedbackSupabaseService.getFeedbackByTour(tourId);
      setFeedback(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching tour feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback for this tour.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchAllFeedback = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await feedbackSupabaseService.getAllFeedback();
      setFeedback(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback from database.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getFeedbackStats = useCallback(async () => {
    try {
      return await feedbackSupabaseService.getFeedbackStats();
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback statistics.",
      });
      return null;
    }
  }, [toast]);

  return {
    feedback,
    isLoading,
    submitFeedback,
    fetchFeedbackByTour,
    fetchAllFeedback,
    getFeedbackStats
  };
}