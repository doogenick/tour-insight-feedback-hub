import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { useToast } from '../ui/use-toast';
import { comprehensiveFeedbackService } from '../../services/comprehensiveFeedbackService';
import { useComprehensiveFeedbackValidation } from "../../hooks/useComprehensiveFeedbackValidation";

import FeedbackHeader from './FeedbackHeader';
import TourDetailsSection from './TourDetailsSection';
import TourSectionSelector from './TourSectionSelector';
import MainRatingsSection from './MainRatingsSection';
import CrewDetailedRatings from './CrewDetailedRatings';
import PageTwoQuestions from './PageTwoQuestions';
import AdditionalQuestions from './AdditionalQuestions';
import OpenEndedFeedback from './OpenEndedFeedback';
import PersonalDetails from './PersonalDetails';
import SignatureSection from './SignatureSection';
import ReviewSharingSection from './ReviewSharingSection';
import SubmissionActions from './SubmissionActions';
import SuccessMessage from '../FeedbackForm/SuccessMessage';

const ComprehensiveFeedbackForm: React.FC = () => {
  const { 
    selectedTour,
    selectedClient,
    setSelectedClient
  } = useAppContext();
  
  const { toast } = useToast();
  
  // Enhanced form state for comprehensive feedback
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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Use custom validation hook
  const { validatePage1, requireClientEmail } = useComprehensiveFeedbackValidation(
    selectedTour,
    selectedClient,
    formData
  );

  // Update form data when context changes
  useEffect(() => {
    if (selectedClient?.email) {
      setFormData(prev => ({ 
        ...prev, 
        email: selectedClient.email,
        client_email: selectedClient.email 
      }));
    }
  }, [selectedClient]);
  
  const updateFormData = (field: keyof ComprehensiveFeedback, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
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
        return;
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
      
      // Submit using the comprehensive feedback service
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
        {/* Page Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 1 ? 'bg-tour-primary text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`w-16 h-1 ${currentPage > 1 ? 'bg-tour-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 2 ? 'bg-tour-primary text-white' : 'bg-gray-200'}`}>2</div>
            <div className={`w-16 h-1 ${currentPage > 2 ? 'bg-tour-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 3 ? 'bg-tour-primary text-white' : 'bg-gray-200'}`}>3</div>
          </div>
        </div>

        {currentPage === 1 && (
          <div className="space-y-8">
            <TourDetailsSection 
              selectedTour={selectedTour}
              selectedClient={selectedClient}
            />
            
            <TourSectionSelector
              value={formData.tour_section_completed}
              onChange={(value) => updateFormData('tour_section_completed', value)}
            />
            
            <MainRatingsSection
              formData={formData}
              updateFormData={updateFormData}
              guideName={selectedTour?.guide_name || ''}
              driverName={selectedTour?.driver_name || ''}
            />
            
            <CrewDetailedRatings
              formData={formData}
              updateFormData={updateFormData}
              guideName={selectedTour?.guide_name || ''}
              driverName={selectedTour?.driver_name || ''}
            />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleNextPage}
                className="bg-tour-primary hover:bg-tour-secondary px-8 py-3"
                disabled={!selectedClient}
              >
                Continue to Page 2
              </Button>
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="space-y-8">
            <PageTwoQuestions
              formData={formData}
              updateFormData={updateFormData}
            />
            
            <AdditionalQuestions
              formData={formData}
              updateFormData={updateFormData}
            />
            
            <OpenEndedFeedback
              formData={formData}
              updateFormData={updateFormData}
            />
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                onClick={handlePrevPage}
                className="px-8 py-3"
              >
                Back to Page 1
              </Button>
              <Button 
                onClick={handleNextPage}
                className="bg-tour-primary hover:bg-tour-secondary px-8 py-3"
              >
                Continue to Page 3
              </Button>
            </div>
          </div>
        )}

        {currentPage === 3 && (
          <div className="space-y-8">
            <PersonalDetails
              formData={formData}
              updateFormData={updateFormData}
            />
            
            <ReviewSharingSection
              formData={formData}
              updateFormData={updateFormData}
              clientEmail={selectedClient?.email}
            />
            
            <SignatureSection
              formData={formData}
              updateFormData={updateFormData}
            />
            
            <SubmissionActions
              formData={formData}
              onClearForm={handleClearForm}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                onClick={handlePrevPage}
                className="px-8 py-3"
              >
                Back to Page 2
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComprehensiveFeedbackForm;
