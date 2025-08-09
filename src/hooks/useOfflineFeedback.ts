import { useState, useEffect, useCallback } from 'react';
import { offlineFeedbackService, FeedbackDraft, TourBackup } from '../services/offlineFeedbackService';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';
import { useToast } from '../components/ui/use-toast';
import { useWifiConnection } from './useWifiConnection';

export const useOfflineFeedback = () => {
  const [drafts, setDrafts] = useState<FeedbackDraft[]>([]);
  const [backups, setBackups] = useState<TourBackup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storageStats, setStorageStats] = useState<{
    draftsCount: number;
    backupsCount: number;
    tourBackupsCount: number;
    totalSizeEstimate: number;
  } | null>(null);

  const { toast } = useToast();
  const { isOnline } = useWifiConnection();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [draftsList, backupsList, stats] = await Promise.all([
        offlineFeedbackService.getAllDrafts(),
        offlineFeedbackService.getTourBackups(),
        offlineFeedbackService.getStorageStats()
      ]);
      
      setDrafts(draftsList);
      setBackups(backupsList);
      setStorageStats(stats);
    } catch (error) {
      console.error('Error loading offline data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load offline data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Auto-save draft
  const saveDraft = useCallback(async (
    clientId: string,
    tourId: string,
    clientName: string,
    formData: Partial<ComprehensiveFeedback>,
    currentPage: 1 | 2 | 3,
    isAutoSaved: boolean = true
  ) => {
    try {
      await offlineFeedbackService.saveDraft({
        clientId,
        tourId,
        clientName,
        formData,
        currentPage,
        isAutoSaved
      });
      
      await loadData(); // Refresh the list
      
      if (!isAutoSaved) {
        toast({
          title: "Draft Saved",
          description: `Draft saved for ${clientName}`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save draft",
      });
    }
  }, [loadData, toast]);

  // Get draft for specific client
  const getDraft = useCallback(async (clientId: string): Promise<FeedbackDraft | null> => {
    try {
      return await offlineFeedbackService.getDraft(clientId);
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }, []);

  // Delete draft
  const deleteDraft = useCallback(async (clientId: string) => {
    try {
      await offlineFeedbackService.deleteDraft(clientId);
      await loadData();
      
      toast({
        title: "Draft Deleted",
        description: "Draft has been removed",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete draft",
      });
    }
  }, [loadData, toast]);

  // Backup feedback
  const backupFeedback = useCallback(async (feedback: ComprehensiveFeedback) => {
    try {
      await offlineFeedbackService.backupFeedback(feedback);
      
      // Also delete the draft since it's now submitted
      if (feedback.client_id) {
        await offlineFeedbackService.deleteDraft(feedback.client_id);
      }
      
      await loadData();
      
      toast({
        title: "Feedback Backed Up",
        description: "Feedback has been saved locally",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error backing up feedback:', error);
      toast({
        variant: "destructive",
        title: "Backup Error",
        description: "Failed to backup feedback",
      });
    }
  }, [loadData, toast]);

  // Create tour backup
  const createTourBackup = useCallback(async (
    tourId: string,
    tourName: string,
    guideName: string,
    driverName: string,
    clientFeedbacks: ComprehensiveFeedback[]
  ) => {
    try {
      const backup = await offlineFeedbackService.createTourBackup(
        tourId, tourName, guideName, driverName, clientFeedbacks
      );
      
      await loadData();
      
      toast({
        title: "Tour Backup Created",
        description: `Backup created for ${tourName} with ${clientFeedbacks.length} client feedbacks`,
        duration: 3000,
      });
      
      return backup;
    } catch (error) {
      console.error('Error creating tour backup:', error);
      toast({
        variant: "destructive",
        title: "Backup Error",
        description: "Failed to create tour backup",
      });
      throw error;
    }
  }, [loadData, toast]);

  // Export tour backup
  const exportTourBackup = useCallback(async (backupId: string, tourName: string) => {
    try {
      const blob = await offlineFeedbackService.exportTourBackupAsJSON(backupId);
      
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tour-backup-${tourName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Tour backup exported for ${tourName}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error exporting tour backup:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export tour backup",
      });
    }
  }, [toast]);

  // Export all drafts
  const exportAllDrafts = useCallback(async () => {
    try {
      const blob = await offlineFeedbackService.exportAllDraftsAsJSON();
      
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-drafts-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `${drafts.length} drafts exported`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error exporting drafts:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export drafts",
      });
    }
  }, [drafts.length, toast]);

  // Delete tour backup
  const deleteTourBackup = useCallback(async (backupId: string, tourName: string) => {
    try {
      await offlineFeedbackService.deleteTourBackup(backupId);
      await loadData();
      
      toast({
        title: "Backup Deleted",
        description: `Backup for ${tourName} has been removed`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting tour backup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete backup",
      });
    }
  }, [loadData, toast]);

  // Clean up old data
  const cleanupOldData = useCallback(async (daysOld: number = 30) => {
    try {
      const result = await offlineFeedbackService.cleanupOldData(daysOld);
      await loadData();
      
      toast({
        title: "Cleanup Complete",
        description: `Removed ${result.draftsCleaned} old drafts and ${result.backupsCleaned} old backups`,
        duration: 3000,
      });
      
      return result;
    } catch (error) {
      console.error('Error cleaning up data:', error);
      toast({
        variant: "destructive",
        title: "Cleanup Error",
        description: "Failed to cleanup old data",
      });
    }
  }, [loadData, toast]);

  return {
    drafts,
    backups,
    storageStats,
    isLoading,
    isOnline,
    saveDraft,
    getDraft,
    deleteDraft,
    backupFeedback,
    createTourBackup,
    exportTourBackup,
    exportAllDrafts,
    deleteTourBackup,
    cleanupOldData,
    loadData
  };
};