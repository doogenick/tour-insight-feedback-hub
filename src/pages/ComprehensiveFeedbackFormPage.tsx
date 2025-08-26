import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import PageOne from '@/components/ComprehensiveFeedbackForm/PageOne';
import PageTwo from '@/components/ComprehensiveFeedbackForm/PageTwo';
import PageThree from '@/components/ComprehensiveFeedbackForm/PageThree';
import PageProgress from '@/components/ComprehensiveFeedbackForm/PageProgress';

import { useComprehensiveFeedbackForm } from '@/hooks/useComprehensiveFeedbackForm';
import { useComprehensiveFeedbackValidation } from '@/hooks/useComprehensiveFeedbackValidation';
import { useSupabaseTours } from '@/hooks/useSupabaseTours';
import { useSupabaseFeedback } from '@/hooks/useSupabaseFeedback';
import { Tour } from '@/types/Tour';

const ComprehensiveFeedbackFormPage: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { tours, fetchTours } = useSupabaseTours();
  const { submitFeedback } = useSupabaseFeedback();
  
  const [currentTour, setCurrentTour] = React.useState<Tour | null>(null);
  const [selectedClient, setSelectedClient] = React.useState<any>({ id: 'manual', name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    formData,
    currentPage,
    setCurrentPage,
    updateFormData,
    resetForm
  } = useComprehensiveFeedbackForm(selectedClient);

  const { validatePage1, requireClientEmail, requireClientName } = useComprehensiveFeedbackValidation(
    currentTour,
    selectedClient,
    formData
  );

  React.useEffect(() => {
    if (tourId) {
      fetchTours();
    }
  }, [tourId, fetchTours]);

  React.useEffect(() => {
    if (tours.length > 0 && tourId) {
      const tour = tours.find(t => t.id === tourId);
      if (tour) {
        setCurrentTour(tour);
        updateFormData('tour_id', tour.id);
      }
    }
  }, [tours, tourId, updateFormData]);

  const handleNext = () => {
    if (currentPage === 1) {
      const validation = validatePage1();
      if (!validation.valid) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: validation.message,
        });
        return;
      }
    }
    if (currentPage < 3) {
      setCurrentPage((currentPage + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const nameValidation = requireClientName();
    if (!nameValidation.valid) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: nameValidation.message,
      });
      return;
    }

    const emailValidation = requireClientEmail();
    if (!emailValidation.valid) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: emailValidation.message,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        tour_id: tourId!,
        client_id: selectedClient.id || 'manual',
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      };

      await submitFeedback(submissionData);
      
      toast({
        title: "Success",
        description: "Feedback submitted successfully!",
      });
      
      resetForm();
      navigate(`/tour/${tourId}/feedback`);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/tour/${tourId}/feedback`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tour Session
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Client Feedback Form</h1>
          <div className="text-muted-foreground">
            {currentTour ? `${currentTour.tour_code} - ${currentTour.tour_name}` : 'Loading tour details...'}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Comprehensive Feedback Collection
            <PageProgress currentPage={currentPage} />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {currentPage === 1 && (
            <PageOne
              selectedTour={currentTour}
              selectedClient={selectedClient}
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
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveFeedbackFormPage;