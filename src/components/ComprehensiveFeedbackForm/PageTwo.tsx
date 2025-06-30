
import React from 'react';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Button } from '../ui/button';
import PageTwoQuestions from './PageTwoQuestions';
import AdditionalQuestions from './AdditionalQuestions';
import OpenEndedFeedback from './OpenEndedFeedback';

interface PageTwoProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  onPrev: () => void;
  onNext: () => void;
}

const PageTwo: React.FC<PageTwoProps> = ({
  formData,
  updateFormData,
  onPrev,
  onNext
}) => {
  return (
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
          onClick={onPrev}
          className="px-8 py-3"
        >
          Back to Page 1
        </Button>
        <Button 
          onClick={onNext}
          className="bg-tour-primary hover:bg-tour-secondary px-8 py-3"
        >
          Continue to Page 3
        </Button>
      </div>
    </div>
  );
};

export default PageTwo;
