import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Feedback } from '../../services/api';
import { useToast } from '../ui/use-toast';

import ClientInfoDisplay from './ClientInfoDisplay';
import StaffNamesSection from './StaffNamesSection';
import RatingsSection from './RatingsSection';
import CommentsSection from './CommentsSection';
import EmailPreferencesSection from './EmailPreferencesSection';
import SuccessMessage from './SuccessMessage';

const FeedbackForm: React.FC = () => {
  const { 
    selectedTour,
    selectedClient,
    isSubmitting, 
    submitFeedback,
    setSelectedClient
  } = useAppContext();
  
  const { toast } = useToast();
  
  // Form state
  const [guideName, setGuideName] = useState<string>(selectedTour?.guide_name || '');
  const [driverName, setDriverName] = useState<string>(selectedTour?.driver_name || '');
  const [ratingOverall, setRatingOverall] = useState<number>(3.50);
  const [ratingGuide, setRatingGuide] = useState<number>(3.50);
  const [ratingDriver, setRatingDriver] = useState<number>(3.50);
  const [ratingFood, setRatingFood] = useState<number>(3.50);
  const [ratingEquipment, setRatingEquipment] = useState<number>(3.50);
  const [comments, setComments] = useState<string>('');
  const [email, setEmail] = useState<string>(selectedClient?.email || '');
  const [willingGoogle, setWillingGoogle] = useState<boolean>(false);
  const [willingTripadvisor, setWillingTripadvisor] = useState<boolean>(false);
  
  // Form submission state
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<Feedback | null>(null);

  // Update the form when the selected tour or client changes
  useEffect(() => {
    if (selectedTour) {
      setGuideName(selectedTour.guide_name);
      setDriverName(selectedTour.driver_name);
    }
    
    if (selectedClient && selectedClient.email) {
      setEmail(selectedClient.email);
    }
  }, [selectedTour, selectedClient]);
  
  // Copy feedback to clipboard
  const copyFeedback = () => {
    if (comments) {
      navigator.clipboard.writeText(comments);
      toast({
        title: "Copied!",
        description: "Feedback copied to clipboard",
        duration: 3000,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTour || !selectedClient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tour and client must be selected first",
      });
      return;
    }
    
    // Validate ratings are within 1.00-7.00 range
    if (ratingOverall < 1.00 || ratingOverall > 7.00 ||
        ratingGuide < 1.00 || ratingGuide > 7.00 ||
        ratingDriver < 1.00 || ratingDriver > 7.00) {
      toast({
        variant: "destructive",
        title: "Invalid Rating",
        description: "All required ratings must be between 1.00 and 7.00",
      });
      return;
    }
    
    if ((ratingFood !== 0 && (ratingFood < 1.00 || ratingFood > 7.00)) || 
        (ratingEquipment !== 0 && (ratingEquipment < 1.00 || ratingEquipment > 7.00))) {
      toast({
        variant: "destructive",
        title: "Invalid Rating",
        description: "All ratings must be between 1.00 and 7.00",
      });
      return;
    }
    
    try {
      // Prepare feedback data, remove undefined to enforce type safety
      const feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'> = {
        tour_id: selectedTour.tour_id,
        client_id: selectedClient.client_id,
        guide_name: guideName,
        driver_name: driverName,
        rating_overall: ratingOverall,
        rating_guide: ratingGuide,
        rating_driver: ratingDriver,
        ...(ratingFood !== 0 ? { rating_food: ratingFood } : {}),
        ...(ratingEquipment !== 0 ? { rating_equipment: ratingEquipment } : {}),
        ...(comments.trim() ? { comments: comments.trim() } : {}),
      };
      
      // Submit feedback
      const result = await submitFeedback(feedbackData);
      
      if (result.success && result.data) {
        setSubmittedFeedback(result.data);
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error('Error submitting feedback:', error?.message || error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: `Submission failed: ${error?.message || "Unknown error"}`
      });
    }
  };
  
  // Reset form for a new submission
  const handleReset = () => {
    setSelectedClient(null);
    setGuideName(selectedTour?.guide_name || '');
    setDriverName(selectedTour?.driver_name || '');
    setRatingOverall(3.50);
    setRatingGuide(3.50);
    setRatingDriver(3.50);
    setRatingFood(3.50);
    setRatingEquipment(3.50);
    setComments('');
    setEmail('');
    setWillingGoogle(false);
    setWillingTripadvisor(false);
    setSubmitted(false);
    setSubmittedFeedback(null);
  };
  
  return (
    <Card className="w-full animate-fade-in">
      {!submitted ? (
        <>
          <CardHeader className="text-center bg-tour-primary text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Tour Feedback</CardTitle>
            <CardDescription className="text-white/80">
              Please rate your experience on a scale of 1.00 to 7.00
              <br />
              <span className="font-medium">(1.00 = Perfect, 7.00 = Very Poor)</span>
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <ClientInfoDisplay 
                selectedClient={selectedClient} 
                selectedTour={selectedTour} 
              />
              
              <StaffNamesSection
                guideName={guideName}
                driverName={driverName}
                onGuideNameChange={setGuideName}
                onDriverNameChange={setDriverName}
              />
              
              <RatingsSection
                ratingOverall={ratingOverall}
                ratingGuide={ratingGuide}
                ratingDriver={ratingDriver}
                ratingFood={ratingFood}
                ratingEquipment={ratingEquipment}
                onRatingOverallChange={setRatingOverall}
                onRatingGuideChange={setRatingGuide}
                onRatingDriverChange={setRatingDriver}
                onRatingFoodChange={setRatingFood}
                onRatingEquipmentChange={setRatingEquipment}
              />
              
              <CommentsSection
                comments={comments}
                onCommentsChange={setComments}
              />
              
              <EmailPreferencesSection
                email={email}
                willingGoogle={willingGoogle}
                willingTripadvisor={willingTripadvisor}
                onEmailChange={setEmail}
                onWillingGoogleChange={setWillingGoogle}
                onWillingTripadvisorChange={setWillingTripadvisor}
              />
            </CardContent>
            
            <CardFooter className="flex justify-center gap-4">
              <Button 
                type="submit" 
                className="bg-tour-primary hover:bg-tour-secondary"
                disabled={isSubmitting || !selectedClient}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </CardFooter>
          </form>
        </>
      ) : (
        <SuccessMessage
          feedbackId={submittedFeedback?.id || ''}
          tourName={selectedTour?.tour_name || 'your tour'}
          willingGoogle={willingGoogle}
          willingTripadvisor={willingTripadvisor}
          comments={comments}
          onCopyFeedback={copyFeedback}
          onReset={handleReset}
        />
      )}
    </Card>
  );
};

export default FeedbackForm;
