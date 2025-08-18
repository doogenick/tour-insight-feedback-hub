import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { useOfflineFeedback } from '../../hooks/useOfflineFeedback';
import { useComprehensiveFeedbackForm } from '../../hooks/useComprehensiveFeedbackForm';
import { useComprehensiveFeedbackValidation } from '../../hooks/useComprehensiveFeedbackValidation';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Tour } from '../../types/Tour';
import { Client } from '../../types/Client';
import { Users, Check, Plus, Upload, ArrowLeft } from 'lucide-react';

// Import the comprehensive form components
import PageOne from '../ComprehensiveFeedbackForm/PageOne';
import PageTwo from '../ComprehensiveFeedbackForm/PageTwo';
import PageThree from '../ComprehensiveFeedbackForm/PageThree';
import PageProgress from '../ComprehensiveFeedbackForm/PageProgress';

interface MultiClientFeedbackCollectorProps {
  tour: Tour;
  onComplete: () => void;
}

const MultiClientFeedbackCollector: React.FC<MultiClientFeedbackCollectorProps> = ({
  tour,
  onComplete
}) => {
  const { toast } = useToast();
  const { createTourBackup } = useOfflineFeedback();
  
  const [completedFeedbacks, setCompletedFeedbacks] = useState<ComprehensiveFeedback[]>([]);
  const [currentClientIndex, setCurrentClientIndex] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showingForm, setShowingForm] = useState(false);

  // Create a temporary client for the current form
  const [currentTempClient] = useState<Client>({
    client_id: `temp-${Date.now()}`,
    full_name: '',
    email: '',
    tour_id: tour.tour_id
  });

  const {
    formData,
    currentPage,
    updateFormData,
    resetForm,
    setCurrentPage
  } = useComprehensiveFeedbackForm(currentTempClient);

  const { validatePage1, requireClientEmail, requireClientName } = useComprehensiveFeedbackValidation(
    tour,
    currentTempClient,
    formData
  );

  const handleNextPage = () => {
    if (currentPage === 1) {
      const { valid, message } = validatePage1();
      if (valid) {
        setCurrentPage(2);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      }
    } else if (currentPage === 2) {
      setCurrentPage(3);
    }
  };

  const handlePrevPage = () => {
    if (currentPage === 2) {
      setCurrentPage(1);
    } else if (currentPage === 3) {
      setCurrentPage(2);
    }
  };

  const handleSubmitCurrentClient = async () => {
    const { valid: nameValid, message: nameMsg } = requireClientName();
    if (!nameValid) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: nameMsg,
      });
      setCurrentPage(3);
      return;
    }

    const { valid: emailValid, message: emailMsg } = requireClientEmail();
    if (!emailValid) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: emailMsg,
      });
      setCurrentPage(3);
      return;
    }

    const feedback: ComprehensiveFeedback = {
      ...formData,
      id: `manual-${Date.now()}-${currentClientIndex}`,
      tour_id: tour.tour_id,
      client_id: `client-${Date.now()}-${currentClientIndex}`,
      tour_section_completed: formData.tour_section_completed || 'full',
      // Ensure all required ratings have default values
      accommodation_rating: formData.accommodation_rating || 5,
      information_rating: formData.information_rating || 5,
      quality_equipment_rating: formData.quality_equipment_rating || 5,
      truck_comfort_rating: formData.truck_comfort_rating || 5,
      food_quantity_rating: formData.food_quantity_rating || 5,
      food_quality_rating: formData.food_quality_rating || 5,
      driving_rating: formData.driving_rating || 5,
      guiding_rating: formData.guiding_rating || 5,
      organisation_rating: formData.organisation_rating || 5,
      guide_individual_rating: formData.guide_individual_rating || 5,
      driver_individual_rating: formData.driver_individual_rating || 5,
      pace_rating: formData.pace_rating || 5,
      route_rating: formData.route_rating || 5,
      activity_level_rating: formData.activity_level_rating || 5,
      price_rating: formData.price_rating || 5,
      value_rating: formData.value_rating || 5,
      overview_rating: formData.overview_rating || 5,
      guide_professionalism: formData.guide_professionalism || 5,
      guide_organisation: formData.guide_organisation || 5,
      guide_people_skills: formData.guide_people_skills || 5,
      guide_enthusiasm: formData.guide_enthusiasm || 5,
      guide_information: formData.guide_information || 5,
      driver_professionalism: formData.driver_professionalism || 5,
      driver_organisation: formData.driver_organisation || 5,
      driver_people_skills: formData.driver_people_skills || 5,
      driver_enthusiasm: formData.driver_enthusiasm || 5,
      driver_information: formData.driver_information || 5,
      tour_leader_knowledge: formData.tour_leader_knowledge || 5,
      safety_rating: formData.safety_rating || 5,
      status: 'pending',
      submitted_at: new Date().toISOString()
    } as ComprehensiveFeedback;

    setCompletedFeedbacks(prev => [...prev, feedback]);
    
    // Reset for next client
    resetForm();
    setCurrentPage(1);
    setCurrentClientIndex(prev => prev + 1);
    setShowingForm(false);

    toast({
      title: "Feedback Added",
      description: `Client ${currentClientIndex} feedback saved. Ready for next client.`,
      duration: 3000
    });
  };

  const handleClearCurrentForm = () => {
    resetForm();
    setCurrentPage(1);
  };

  const startNewClientForm = () => {
    setShowingForm(true);
    setCurrentPage(1);
  };

  const cancelCurrentForm = () => {
    setShowingForm(false);
    handleClearCurrentForm();
  };

  const submitAllFeedback = async () => {
    if (completedFeedbacks.length === 0) {
      toast({
        variant: "destructive",
        title: "No Feedback",
        description: "Please collect at least one client feedback before submitting."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createTourBackup(
        tour.tour_id,
        tour.tour_name,
        tour.guide_name,
        tour.driver_name,
        completedFeedbacks
      );

      toast({
        title: "Success!",
        description: `Collected feedback from ${completedFeedbacks.length} clients. Data saved locally and will sync when online.`,
        duration: 5000
      });

      onComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save feedback. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showingForm) {
    return (
      <Card className="w-full animate-fade-in max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client {currentClientIndex} - Comprehensive Feedback</CardTitle>
            <Button variant="outline" onClick={cancelCurrentForm}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Tour: {tour.tour_name}</p>
            <p>Guide: {tour.guide_name} | Driver: {tour.driver_name}</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <PageProgress currentPage={currentPage} />

          {currentPage === 1 && (
            <PageOne
              selectedTour={tour}
              selectedClient={currentTempClient}
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNextPage}
            />
          )}

          {currentPage === 2 && (
            <PageTwo
              formData={formData}
              updateFormData={updateFormData}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          )}

          {currentPage === 3 && (
            <PageThree
              formData={formData}
              updateFormData={updateFormData}
              clientEmail={formData.client_email}
              onPrev={handlePrevPage}
              onClearForm={handleClearCurrentForm}
              onSubmit={handleSubmitCurrentClient}
              isSubmitting={false}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {tour.tour_name}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>Guide: {tour.guide_name} | Driver: {tour.driver_name}</p>
            <p>Completed: {completedFeedbacks.length} clients</p>
          </div>
        </CardHeader>
      </Card>

      {/* Add New Client Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={startNewClientForm}
            className="w-full"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client {currentClientIndex} Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Completed Clients Summary */}
      {completedFeedbacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Feedback ({completedFeedbacks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedFeedbacks.map((feedback, index) => (
                <div key={feedback.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="font-medium">{feedback.client_name}</span>
                  <Badge variant="secondary">
                    <Check className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit All */}
      {completedFeedbacks.length > 0 && (
        <div className="flex gap-3">
          <Button 
            onClick={submitAllFeedback}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : `Submit All Feedback (${completedFeedbacks.length})`}
          </Button>
          <Button variant="outline" onClick={onComplete}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiClientFeedbackCollector;