import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { offlineStorage, OfflineTour, OfflineFeedback } from '../services/offlineStorage';
import { useComprehensiveFeedbackForm } from '../hooks/useComprehensiveFeedbackForm';
import { useComprehensiveFeedbackValidation } from '../hooks/useComprehensiveFeedbackValidation';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';
import { Tour } from '../types/Tour';
import { Client } from '../types/Client';

// Import comprehensive feedback form components
import PageOne from '../components/ComprehensiveFeedbackForm/PageOne';
import PageTwo from '../components/ComprehensiveFeedbackForm/PageTwo';
import PageThree from '../components/ComprehensiveFeedbackForm/PageThree';
import PageProgress from '../components/ComprehensiveFeedbackForm/PageProgress';
import FeedbackHeader from '../components/ComprehensiveFeedbackForm/FeedbackHeader';

import { ArrowLeft } from 'lucide-react';

const MobileFeedbackForm: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<OfflineTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Convert OfflineTour to Tour format for the form
  const convertedTour: Tour | null = tour ? {
    tour_id: tour.tour_id,
    tour_name: tour.tour_name,
    tour_code: tour.tour_code,
    date_start: tour.date_start,
    date_end: tour.date_end,
    passenger_count: tour.passenger_count,
    guide_name: tour.guide_name,
    driver_name: tour.driver_name,
    truck_name: tour.truck_name,
    tour_leader: tour.tour_leader,
    status: tour.status
  } : null;

  // Create a mock client (mobile doesn't pre-select clients)
  const mockClient: Client = {
    client_id: 'mobile-client',
    full_name: '',
    email: '',
    tour_id: tour?.tour_id || ''
  };

  const { formData, currentPage, setCurrentPage, updateFormData, resetForm } = 
    useComprehensiveFeedbackForm(mockClient);
  
  const { validatePage1, requireClientEmail, requireClientName } = 
    useComprehensiveFeedbackValidation(convertedTour, mockClient, formData);

  useEffect(() => {
    if (tourId) {
      loadTour();
    }
  }, [tourId]);

  const loadTour = async () => {
    if (!tourId) return;
    
    try {
      const tourData = await offlineStorage.getTour(tourId);
      if (!tourData) {
        toast({
          variant: "destructive",
          title: "Tour Not Found",
          description: "The requested tour could not be found."
        });
        navigate('/mobile');
        return;
      }
      
      setTour(tourData);
    } catch (error) {
      console.error('Error loading tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tour data."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentPage === 1) {
      // Page 1 validation - tour is always selected in mobile mode
      setCurrentPage(2 as const);
    } else if (currentPage === 2) {
      setCurrentPage(3 as const);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async () => {
    // Final validation
    const nameValidation = requireClientName();
    if (!nameValidation.valid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: nameValidation.message
      });
      return;
    }

    const emailValidation = requireClientEmail();
    if (!emailValidation.valid) {
      toast({
        variant: "destructive",
        title: "Validation Error", 
        description: emailValidation.message
      });
      return;
    }

    if (!tour) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tour data is missing."
      });
      return;
    }

    setSubmitting(true);
    try {
      // Check for duplicate feedback before saving
      if (formData.client_name && formData.client_email) {
        // Import the service to check for duplicates
        const { feedbackSupabaseService } = await import('../services/supabaseServices');
        
        try {
          const existingFeedback = await feedbackSupabaseService.checkForDuplicateFeedback(
            tour.tour_id || '', // Use tour_id if available
            formData.client_name,
            formData.client_email
          );
          
          if (existingFeedback) {
            toast({
              variant: "destructive",
              title: "Duplicate Feedback",
              description: `Feedback already submitted by ${formData.client_name} (${formData.client_email}) for this tour. Previous submission was on ${new Date(existingFeedback.submitted_at).toLocaleDateString()}.`
            });
            return;
          }
        } catch (duplicateCheckError) {
          // If duplicate check fails (e.g., no internet), we'll still save locally
          // but show a warning that it will be checked during sync
          console.warn('Could not check for duplicates:', duplicateCheckError);
          toast({
            title: "Offline Mode",
            description: "Saving feedback locally. Duplicate check will be performed when syncing online."
          });
        }
      }

      // Create offline feedback entry
      const offlineFeedback: OfflineFeedback = {
        ...formData,
        id: '', // Will be set when synced
        tour_id: tour.tour_id, // This will be updated when tour is synced
        offline_id: `offline_feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        offline_tour_id: tour.offline_id,
        synced: false,
        created_offline: true,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        status: 'submitted'
      } as OfflineFeedback;

      await offlineStorage.saveFeedback(offlineFeedback);

      toast({
        title: "Feedback Saved",
        description: "Client feedback has been saved locally and will sync when online."
      });

      // Navigate back to tour session
      navigate(`/mobile-feedback/${tour.offline_id}`);
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save feedback. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour || !convertedTour) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Tour Not Found</h1>
        <Button onClick={() => navigate('/mobile')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/mobile-feedback/${tour.offline_id}`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Client Feedback</h1>
          <p className="text-sm text-muted-foreground">{tour.tour_code} - {tour.tour_name}</p>
        </div>
      </div>

      {/* Progress */}
      <PageProgress currentPage={currentPage} />

      {/* Form Card */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Client Feedback Form</h2>
          <p className="text-sm text-muted-foreground">
            {convertedTour.tour_code} - {convertedTour.tour_name}
          </p>
        </div>
        
        <div className="mt-6">
          {currentPage === 1 && (
            <PageOne
              selectedTour={convertedTour}
              selectedClient={mockClient}
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}
          
          {currentPage === 2 && (
            <PageTwo
              formData={formData}
              updateFormData={updateFormData}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
          
          {currentPage === 3 && (
            <PageThree
              formData={formData}
              updateFormData={updateFormData}
              onPrev={handlePrev}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {currentPage < 3 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Feedback'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MobileFeedbackForm;