
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Button } from '../ui/button';

interface SubmissionActionsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SubmissionActions: React.FC<SubmissionActionsProps> = ({
  onSubmit,
  isSubmitting
}) => {

  return (
    <div className="bg-gray-100 border-2 border-black p-6 text-center space-y-4">
      <h3 className="font-bold text-lg">Submit Your Feedback</h3>
      
      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          className="bg-tour-primary hover:bg-tour-secondary px-12 py-4 text-lg font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Your feedback helps us improve and helps other travelers choose their adventure!
      </p>
    </div>
  );
};

export default SubmissionActions;
