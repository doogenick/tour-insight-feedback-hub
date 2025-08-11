import { useState, useEffect, useCallback } from 'react';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';
import { Client } from '../services/api/types';
import { useOfflineFeedback } from './useOfflineFeedback';
import { useToast } from '../components/ui/use-toast';
import { comprehensiveFeedbackService } from '../services/comprehensiveFeedbackService';
import { useWifiConnection } from './useWifiConnection';
import { v4 as uuidv4 } from 'uuid';

export const useEnhancedComprehensiveFeedbackForm = (
  selectedClient: Client | null,
  tourId?: string
) => {
  const { toast } = useToast();
  const { isOnline } = useWifiConnection();
  const { saveDraft, getDraft, backupFeedback } = useOfflineFeedback();

  const [formData, setFormData] = useState<Partial<ComprehensiveFeedback>>({
    tour_section_completed: '',
    accommodation_rating: 3,
    information_rating: 3,
    quality_equipment_rating: 3,
    truck_comfort_rating: 3,
    food_quantity_rating: 3,
    food_quality_rating: 3,
    driving_rating: 3,
    guiding_rating: 3,
    organisation_rating: 3,
    guide_individual_rating: 3,
    driver_individual_rating: 3,
    pace_rating: 3,
    route_rating: 3,
    activity_level_rating: 3,
    price_rating: 3,
    value_rating: 3,
    overview_rating: 3,
    guide_professionalism: 3,
    guide_organisation: 3,
    guide_people_skills: 3,
    guide_enthusiasm: 3,
    guide_information: 3,
    driver_professionalism: 3,
    driver_organisation: 3,
    driver_people_skills: 3,
    driver_enthusiasm: 3,
    driver_information: 3,
    met_expectations: null,
    value_for_money: null,
    truck_satisfaction: null,
    tour_leader_knowledge: 3,
    safety_rating: 3,
    would_recommend: null,
    heard_about_source: '',
    repeat_travel: null
  });

  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Load draft when client is selected
  useEffect(() => {
    const loadDraft = async () => {
      if (selectedClient && !draftLoaded) {
        try {
          const draft = await getDraft(selectedClient.client_id);
          if (draft) {
            setFormData(draft.formData);
            setCurrentPage(draft.currentPage);
            setDraftLoaded(true);
            
            toast({
              title: "Draft Restored",
              description: `Continuing from where you left off on page ${draft.currentPage}`,
              duration: 3000,
            });
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
        setDraftLoaded(true);
      }
    };

    loadDraft();
  }, [selectedClient, getDraft, draftLoaded, toast]);

  // Set client data when client is selected
  useEffect(() => {
    if (selectedClient?.email) {
      setFormData(prev => ({ 
        ...prev, 
        client_email: selectedClient.email,
        client_name: selectedClient.full_name
      }));
      setHasUnsavedChanges(true);
    }
  }, [selectedClient]);

  // Auto-save functionality
  const performAutoSave = useCallback(async () => {
    if (!selectedClient || !tourId || !hasUnsavedChanges) return;

    setIsAutoSaving(true);
    try {
      await saveDraft(
        selectedClient.client_id,
        tourId,
        selectedClient.full_name,
        formData,
        currentPage,
        true // isAutoSaved
      );
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [selectedClient, tourId, formData, currentPage, hasUnsavedChanges, saveDraft]);

  // Auto-save every 30 seconds when there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setInterval(() => {
      performAutoSave();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [hasUnsavedChanges, performAutoSave]);

  // Manual save
  const manualSave = useCallback(async () => {
    if (!selectedClient || !tourId) return;

    await saveDraft(
      selectedClient.client_id,
      tourId,
      selectedClient.full_name,
      formData,
      currentPage,
      false // not auto-saved
    );
    setHasUnsavedChanges(false);
  }, [selectedClient, tourId, formData, currentPage, saveDraft]);

  const updateFormData = useCallback((field: keyof ComprehensiveFeedback, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      tour_section_completed: '',
      accommodation_rating: 3,
      information_rating: 3,
      quality_equipment_rating: 3,
      truck_comfort_rating: 3,
      food_quantity_rating: 3,
      food_quality_rating: 3,
      driving_rating: 3,
      guiding_rating: 3,
      organisation_rating: 3,
      guide_individual_rating: 3,
      driver_individual_rating: 3,
      pace_rating: 3,
      route_rating: 3,
      activity_level_rating: 3,
      price_rating: 3,
      value_rating: 3,
      overview_rating: 3,
      guide_professionalism: 3,
      guide_organisation: 3,
      guide_people_skills: 3,
      guide_enthusiasm: 3,
      guide_information: 3,
      driver_professionalism: 3,
      driver_organisation: 3,
      driver_people_skills: 3,
      driver_enthusiasm: 3,
      driver_information: 3,
      met_expectations: null,
      value_for_money: null,
      truck_satisfaction: null,
      tour_leader_knowledge: 3,
      safety_rating: 3,
      would_recommend: null,
      heard_about_source: '',
      repeat_travel: null
    });
    setCurrentPage(1);
    setHasUnsavedChanges(false);
    setDraftLoaded(false);
  }, []);

  // Submit feedback
  const submitFeedback = useCallback(async (): Promise<ComprehensiveFeedback> => {
    if (!selectedClient || !tourId) {
      throw new Error('Missing client or tour information');
    }

    const feedbackData: Omit<ComprehensiveFeedback, 'id' | 'status' | 'submitted_at'> = {
      ...formData,
      tour_id: tourId,
      client_id: selectedClient.client_id,
    } as Omit<ComprehensiveFeedback, 'id' | 'status' | 'submitted_at'>;

    try {
      // Submit to service (local-first; may fail in rare cases)
      const submittedFeedback = await comprehensiveFeedbackService.submitFeedback(feedbackData);
      
      // Always backup locally (even when online)
      await backupFeedback(submittedFeedback);
      
      // Clear the form state
      setHasUnsavedChanges(false);
      
      return submittedFeedback;
    } catch (error) {
      console.error('Error submitting feedback, falling back to local backup:', error);
      // Ensure we still persist a local copy so no data is lost
      const fallback: ComprehensiveFeedback = {
        ...(feedbackData as ComprehensiveFeedback),
        id: uuidv4(),
        status: 'Pending',
        submitted_at: new Date().toISOString(),
      };
      await backupFeedback(fallback);
      setHasUnsavedChanges(false);
      return fallback;
    }
  }, [selectedClient, tourId, formData, backupFeedback]);

  const goToPage = useCallback((page: 1 | 2 | 3) => {
    setCurrentPage(page);
    setHasUnsavedChanges(true);
  }, []);

  return {
    formData,
    currentPage,
    isAutoSaving,
    hasUnsavedChanges,
    isOnline,
    draftLoaded,
    updateFormData,
    goToPage,
    resetForm,
    manualSave,
    submitFeedback,
    performAutoSave
  };
};