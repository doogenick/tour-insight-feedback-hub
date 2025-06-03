
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface OpenEndedFeedbackProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
}

const OpenEndedFeedback: React.FC<OpenEndedFeedbackProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          What was the highlight of your tour?
        </div>
        <div className="p-4">
          <Textarea
            value={formData.tour_highlight || ''}
            onChange={(e) => updateFormData('tour_highlight', e.target.value)}
            placeholder="Please share what you enjoyed most about your tour..."
            className="min-h-[100px]"
            rows={5}
          />
        </div>
      </div>

      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          What suggestions do you have for improving our tours?
        </div>
        <div className="p-4">
          <Textarea
            value={formData.improvement_suggestions || ''}
            onChange={(e) => updateFormData('improvement_suggestions', e.target.value)}
            placeholder="Please share any suggestions for how we can improve our tours..."
            className="min-h-[100px]"
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

export default OpenEndedFeedback;
