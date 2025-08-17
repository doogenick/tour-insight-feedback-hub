import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { useEnhancedComprehensiveFeedbackForm } from '../../hooks/useEnhancedComprehensiveFeedbackForm';
import { useComprehensiveFeedbackValidation } from "../../hooks/useComprehensiveFeedbackValidation";
import { useIsMobile } from '../../hooks/use-mobile';

import FeedbackHeader from './FeedbackHeader';
import PageProgress from './PageProgress';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import PageThree from './PageThree';
import SuccessMessage from '../FeedbackForm/SuccessMessage';
import AutoSaveIndicator from './AutoSaveIndicator';
import { Save, RotateCcw, AlertTriangle } from 'lucide-react';

const EnhancedComprehensiveFeedbackForm: React.FC = () => {
  const { 
    selectedTour,
    selectedClient,
    setSelectedClient
  } = useAppContext();
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
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
    submitFeedback
  } = useEnhancedComprehensiveFeedbackForm(selectedClient, selectedTour?.tour_id);

  const { validatePage1, requireClientEmail, requireClientName } = useComprehensiveFeedbackValidation(
    selectedTour,
    selectedClient,
    formData
  );
  
  const handleNextPage = () => {
    if (currentPage === 1) {
      const { valid, message } = validatePage1();
      if (valid) {
        goToPage(2);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      }
    } else if (currentPage === 2) {
      goToPage(3);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage === 2) {
      goToPage(1);
    } else if (currentPage === 3) {
      goToPage(2);
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
      goToPage(3);
      return;
    }

    const { valid: emailValid, message: emailMsg } = requireClientEmail();
    if (!emailValid) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: emailMsg,
      });
      goToPage(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const submittedFeedback = await submitFeedback();
      
      toast({
        title: "Success!",
        description: isOnline 
          ? "Your comprehensive feedback has been submitted successfully"
          : "Your feedback has been saved locally and will sync when online",
        duration: 5000,
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting comprehensive feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Your feedback has been saved locally.",
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

  const handleManualSave = async () => {
    try {
      await manualSave();
      toast({
        title: "Draft Saved",
        description: "Your progress has been saved",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your progress",
      });
    }
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
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
            Comprehensive Feedback Form
          </CardTitle>
          <AutoSaveIndicator
            isAutoSaving={isAutoSaving}
            hasUnsavedChanges={hasUnsavedChanges}
            isOnline={isOnline}
          />
        </div>
        
        {selectedClient && (
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                {selectedClient.full_name}
              </p>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {selectedClient.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges || isAutoSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
            </div>
          </div>
        )}

        {!isOnline && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are currently offline. Your responses are being saved locally and will sync when you reconnect.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent className={isMobile ? 'p-4' : 'p-8'}>
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

export default EnhancedComprehensiveFeedbackForm;