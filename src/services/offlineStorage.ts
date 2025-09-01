import localforage from 'localforage';
import { Tour } from '../types/Tour';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';

// Configure localforage
localforage.config({
  name: 'SafariFeedback',
  version: 1.0,
  size: 4980736, // Size of database, in bytes
  storeName: 'safari_feedback_store',
  description: 'Local storage for Safari Feedback System'
});

export interface OfflineTour extends Tour {
  offline_id: string;
  synced: boolean;
  created_offline: boolean;
}

export interface OfflineFeedback extends ComprehensiveFeedback {
  offline_id: string;
  offline_tour_id: string;
  synced: boolean;
  created_offline: boolean;
}

class OfflineStorageService {
  private toursKey = 'offline_tours';
  private feedbackKey = 'offline_feedback';
  private syncStatusKey = 'sync_status';

  // Tours
  async saveTour(tour: OfflineTour): Promise<void> {
    const tours = await this.getTours();
    const existingIndex = tours.findIndex(t => t.offline_id === tour.offline_id);
    
    if (existingIndex >= 0) {
      tours[existingIndex] = tour;
    } else {
      tours.push(tour);
    }
    
    await localforage.setItem(this.toursKey, tours);
  }

  async getTours(): Promise<OfflineTour[]> {
    const tours = await localforage.getItem<OfflineTour[]>(this.toursKey);
    return tours || [];
  }

  async getTour(offlineId: string): Promise<OfflineTour | null> {
    const tours = await this.getTours();
    return tours.find(t => t.offline_id === offlineId) || null;
  }

  async deleteTour(offlineId: string): Promise<void> {
    const tours = await this.getTours();
    const filtered = tours.filter(t => t.offline_id !== offlineId);
    await localforage.setItem(this.toursKey, filtered);
    
    // Also delete associated feedback
    const feedback = await this.getFeedback();
    const filteredFeedback = feedback.filter(f => f.offline_tour_id !== offlineId);
    await localforage.setItem(this.feedbackKey, filteredFeedback);
  }

  // Feedback
  async saveFeedback(feedback: OfflineFeedback): Promise<void> {
    const allFeedback = await this.getFeedback();
    const existingIndex = allFeedback.findIndex(f => f.offline_id === feedback.offline_id);
    
    if (existingIndex >= 0) {
      allFeedback[existingIndex] = feedback;
    } else {
      allFeedback.push(feedback);
    }
    
    await localforage.setItem(this.feedbackKey, allFeedback);
  }

  async getFeedback(): Promise<OfflineFeedback[]> {
    const feedback = await localforage.getItem<OfflineFeedback[]>(this.feedbackKey);
    return feedback || [];
  }

  async getFeedbackByTour(offlineTourId: string): Promise<OfflineFeedback[]> {
    const allFeedback = await this.getFeedback();
    return allFeedback.filter(f => f.offline_tour_id === offlineTourId);
  }

  async deleteFeedback(offlineId: string): Promise<void> {
    const feedback = await this.getFeedback();
    const filtered = feedback.filter(f => f.offline_id !== offlineId);
    await localforage.setItem(this.feedbackKey, filtered);
  }

  // Sync status
  async setSyncStatus(status: { lastSync: Date; itemsToSync: number }): Promise<void> {
    await localforage.setItem(this.syncStatusKey, status);
  }

  async getSyncStatus(): Promise<{ lastSync: Date; itemsToSync: number } | null> {
    return await localforage.getItem(this.syncStatusKey);
  }

  // Get unsynced items
  async getUnsyncedTours(): Promise<OfflineTour[]> {
    const tours = await this.getTours();
    return tours.filter(t => !t.synced && t.created_offline);
  }

  async getUnsyncedFeedback(): Promise<OfflineFeedback[]> {
    const feedback = await this.getFeedback();
    return feedback.filter(f => !f.synced && f.created_offline);
  }

  // Mark items as synced
  async markTourSynced(offlineId: string, supabaseId?: string): Promise<void> {
    const tours = await this.getTours();
    const tour = tours.find(t => t.offline_id === offlineId);
    if (tour) {
      tour.synced = true;
      if (supabaseId) {
        tour.tour_id = supabaseId;
      }
      await this.saveTour(tour);
    }
  }

  async markFeedbackSynced(offlineId: string, supabaseId?: string): Promise<void> {
    const feedback = await this.getFeedback();
    const item = feedback.find(f => f.offline_id === offlineId);
    if (item) {
      item.synced = true;
      if (supabaseId) {
        item.id = supabaseId;
      }
      await this.saveFeedback(item);
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    await localforage.clear();
  }
}

export const offlineStorage = new OfflineStorageService();