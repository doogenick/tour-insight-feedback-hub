
import React from 'react';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Button } from '../ui/button';
import PersonalDetails from './PersonalDetails';
import ReviewSharingSection from './ReviewSharingSection';
import SignatureSection from './SignatureSection';
import SubmissionActions from './SubmissionActions';

interface PageThreeProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  clientEmail?: string;
  onPrev: () => void;
  onClearForm: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const PageThree: React.FC<PageThreeProps> = ({
  formData,
  updateFormData,
  clientEmail,
  onPrev,
  onClearForm,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="space-y-8">
      <PersonalDetails
        formData={formData}
        updateFormData={updateFormData}
      />
      
      <ReviewSharingSection
        formData={formData}
        updateFormData={updateFormData}
        clientEmail={clientEmail}
      />
      
      <SubmissionActions
        formData={formData}
        onClearForm={onClearForm}
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
