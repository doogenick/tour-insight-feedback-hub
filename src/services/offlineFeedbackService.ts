import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';

// Configure localforage instances
const draftStore = localforage.createInstance({
  name: 'feedback-drafts',
  storeName: 'drafts'
});

const backupStore = localforage.createInstance({
  name: 'feedback-backups',
  storeName: 'backups'
});

const tourBackupStore = localforage.createInstance({
  name: 'tour-backups',
  storeName: 'tour_backups'
});

export interface FeedbackDraft {
  id: string;
  clientId: string;
  tourId: string;
  clientName: string;
  formData: Partial<ComprehensiveFeedback>;
  currentPage: 1 | 2 | 3;
  lastSaved: string;
  isAutoSaved: boolean;
}

export interface TourBackup {
  id: string;
  tourId: string;
  tourName: string;
  guideName: string;
  driverName: string;
  clientFeedbacks: ComprehensiveFeedback[];
  createdAt: string;
  totalClients: number;
  completedClients: number;
}

export const offlineFeedbackService = {
  // Draft management
  async saveDraft(draft: Omit<FeedbackDraft, 'id' | 'lastSaved'>): Promise<FeedbackDraft> {
    const draftWithMeta: FeedbackDraft = {
      ...draft,
      id: draft.clientId, // Use clientId as draft ID for uniqueness
      lastSaved: new Date().toISOString()
    };

    await draftStore.setItem(draftWithMeta.id, draftWithMeta);
    console.log('Draft saved:', draftWithMeta.id);
    return draftWithMeta;
  },

  async getDraft(clientId: string): Promise<FeedbackDraft | null> {
    return await draftStore.getItem<FeedbackDraft>(clientId);
  },

  async getAllDrafts(): Promise<FeedbackDraft[]> {
    const drafts: FeedbackDraft[] = [];
    const keys = await draftStore.keys();
    
    for (const key of keys) {
      const draft = await draftStore.getItem<FeedbackDraft>(key);
      if (draft) {
        drafts.push(draft);
      }
    }
    
    return drafts.sort((a, b) => 
      new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
    );
  },

  async deleteDraft(clientId: string): Promise<void> {
    await draftStore.removeItem(clientId);
  },

  async clearAllDrafts(): Promise<void> {
    await draftStore.clear();
  },

  // Local backup management (individual feedback)
  async backupFeedback(feedback: ComprehensiveFeedback): Promise<void> {
    const backupId = `${feedback.tour_id}_${feedback.client_id}_${feedback.id}`;
    await backupStore.setItem(backupId, {
      ...feedback,
      backedUpAt: new Date().toISOString()
    });
    console.log('Feedback backed up locally:', backupId);
  },

  async getBackedUpFeedback(tourId: string, clientId: string): Promise<ComprehensiveFeedback | null> {
    const keys = await backupStore.keys();
    const feedbackKey = keys.find(key => key.startsWith(`${tourId}_${clientId}_`));
    
    if (feedbackKey) {
      return await backupStore.getItem<ComprehensiveFeedback>(feedbackKey);
    }
    
    return null;
  },

  async getAllBackedUpFeedback(): Promise<ComprehensiveFeedback[]> {
    const feedback: ComprehensiveFeedback[] = [];
    const keys = await backupStore.keys();
    
    for (const key of keys) {
      const item = await backupStore.getItem<ComprehensiveFeedback>(key);
      if (item) {
        feedback.push(item);
      }
    }
    
    return feedback.sort((a, b) => 
      new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime()
    );
  },

  // Tour backup management (all feedback for a tour)
  async createTourBackup(
    tourId: string, 
    tourName: string, 
    guideName: string, 
    driverName: string,
    clientFeedbacks: ComprehensiveFeedback[]
  ): Promise<TourBackup> {
    const backup: TourBackup = {
      id: uuidv4(),
      tourId,
      tourName,
      guideName,
      driverName,
      clientFeedbacks,
      createdAt: new Date().toISOString(),
      totalClients: clientFeedbacks.length,
      completedClients: clientFeedbacks.length
    };

    await tourBackupStore.setItem(backup.id, backup);
    console.log('Tour backup created:', backup.id);
    return backup;
  },

  async getTourBackups(): Promise<TourBackup[]> {
    const backups: TourBackup[] = [];
    const keys = await tourBackupStore.keys();
    
    for (const key of keys) {
      const backup = await tourBackupStore.getItem<TourBackup>(key);
      if (backup) {
        backups.push(backup);
      }
    }
    
    return backups.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async deleteTourBackup(backupId: string): Promise<void> {
    await tourBackupStore.removeItem(backupId);
  },

  // Export functionality
  async exportTourBackupAsJSON(backupId: string): Promise<Blob> {
    const backup = await tourBackupStore.getItem<TourBackup>(backupId);
    if (!backup) {
      throw new Error('Backup not found');
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      tourInfo: {
        tourId: backup.tourId,
        tourName: backup.tourName,
        guideName: backup.guideName,
        driverName: backup.driverName,
        totalClients: backup.totalClients,
        completedClients: backup.completedClients
      },
      feedback: backup.clientFeedbacks
    };

    return new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
  },

  async exportAllDraftsAsJSON(): Promise<Blob> {
    const drafts = await this.getAllDrafts();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      drafts
    };

    return new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
  },

  // Storage cleanup
  async cleanupOldData(daysOld: number = 30): Promise<{ draftsCleaned: number; backupsCleaned: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let draftsCleaned = 0;
    let backupsCleaned = 0;

    // Clean old drafts
    const drafts = await this.getAllDrafts();
    for (const draft of drafts) {
      if (new Date(draft.lastSaved) < cutoffDate) {
        await this.deleteDraft(draft.id);
        draftsCleaned++;
      }
    }

    // Clean old backups
    const backups = await this.getAllBackedUpFeedback();
    const backupKeys = await backupStore.keys();
    for (const key of backupKeys) {
      const backup = await backupStore.getItem<any>(key);
      if (backup && backup.backedUpAt && new Date(backup.backedUpAt) < cutoffDate) {
        await backupStore.removeItem(key);
        backupsCleaned++;
      }
    }

    return { draftsCleaned, backupsCleaned };
  },

  // Get storage usage stats
  async getStorageStats(): Promise<{
    draftsCount: number;
    backupsCount: number;
    tourBackupsCount: number;
    totalSizeEstimate: number;
  }> {
    const drafts = await this.getAllDrafts();
    const backups = await this.getAllBackedUpFeedback();
    const tourBackups = await this.getTourBackups();

    // Rough size estimate (JSON.stringify length)
    const draftsSize = JSON.stringify(drafts).length;
    const backupsSize = JSON.stringify(backups).length;
    const tourBackupsSize = JSON.stringify(tourBackups).length;

    return {
      draftsCount: drafts.length,
      backupsCount: backups.length,
      tourBackupsCount: tourBackups.length,
      totalSizeEstimate: draftsSize + backupsSize + tourBackupsSize
    };
  }
};