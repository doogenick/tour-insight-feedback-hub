
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Card, CardContent } from '../ui/card';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { useToast } from '../ui/use-toast';
import { comprehensiveFeedbackService } from '../../services/comprehensiveFeedbackService';
import { useComprehensiveFeedbackValidation } from "../../hooks/useComprehensiveFeedbackValidation";
import { useComprehensiveFeedbackForm } from '../../hooks/useComprehensiveFeedbackForm';

import FeedbackHeader from './FeedbackHeader';
import PageProgress from './PageProgress';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import PageThree from './PageThree';
import SuccessMessage from '../FeedbackForm/SuccessMessage';

const ComprehensiveFeedbackForm: React.FC = () => {
  const { 
    selectedTour,
    selectedClient,
    setSelectedClient
  } = useAppContext();
  
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    formData,
    currentPage,
    setCurrentPage,
    updateFormData,
    resetForm
  } = useComprehensiveFeedbackForm(selectedClient);

  const { validatePage1, requireClientEmail, requireClientName } = useComprehensiveFeedbackValidation(
    selectedTour,
    selectedClient,
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
  
  const handleSubmit = async () => {
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

    setIsSubmitting(true);

    try {
      const feedbackData: Omit<ComprehensiveFeedback, 'id' | 'status' | 'submitted_at'> = {
        ...formData,
        tour_id: selectedTour.tour_id,
        client_id: selectedClient.client_id,
      } as Omit<ComprehensiveFeedback, 'id' | 'status' | 'submitted_at'>;
      
      await comprehensiveFeedbackService.submitFeedback(feedbackData);
      
      toast({
        title: "Success!",
        description: "Your comprehensive feedback has been submitted successfully",
        duration: 5000,
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting comprehensive feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClearForm = () => {
    setSelectedClient(null);
    resetForm();
    setSubmitted(false);
  };
  
  if (submitted) {
    return (
      <Card className="w-full animate-fade-in">
        <SuccessMessage
          feedbackId={`CF-${Date.now()}`}
          tourName={selectedTour?.tour_name}
          willingGoogle={formData.willing_to_review_google || false}
          willingTripadvisor={formData.willing_to_review_tripadvisor || false}
          comments={formData.additional_comments || ''}
          onCopyFeedback={() => {
            if (formData.additional_comments) {
              navigator.clipboard.writeText(formData.additional_comments);
              toast({
                title: "Copied!",
                description: "Feedback copied to clipboard",
                duration: 3000,
              });
            }
          }}
          onReset={handleClearForm}
        />
      </Card>
    );
  }
  
  return (
    <Card className="w-full animate-fade-in max-w-5xl mx-auto">
      <FeedbackHeader />
      
      <CardContent className="p-8">
        <PageProgress currentPage={currentPage} />

        {currentPage === 1 && (
          <PageOne
            selectedTour={selectedTour}
            selectedClient={selectedClient}
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
            clientEmail={selectedClient?.email}
            onPrev={handlePrevPage}
            onClearForm={handleClearForm}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ComprehensiveFeedbackForm;
