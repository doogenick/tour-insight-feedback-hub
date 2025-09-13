
import React from 'react';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Button } from '../ui/button';
import PersonalDetails from './PersonalDetails';
import SubmissionActions from './SubmissionActions';
import ReviewConsent from './ReviewConsent';

interface PageThreeProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const PageThree: React.FC<PageThreeProps> = ({
  formData,
  updateFormData,
  onPrev,
  onSubmit,
  isSubmitting
}) => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-8">
      <PersonalDetails
        formData={formData}
        updateFormData={updateFormData}
      />
      
      <ReviewConsent
        willingToReviewGoogle={formData.willing_to_review_google || false}
        willingToReviewTripadvisor={formData.willing_to_review_tripadvisor || false}
        onGoogleChange={(checked) => updateFormData('willing_to_review_google', checked)}
        onTripadvisorChange={(checked) => updateFormData('willing_to_review_tripadvisor', checked)}
      />
      
      <SubmissionActions
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline"
          onClick={onPrev}
          className="px-8 py-3"
        >
          Back to Page 2
        </Button>
      </div>
    </div>
  );
};

export default PageThree;
