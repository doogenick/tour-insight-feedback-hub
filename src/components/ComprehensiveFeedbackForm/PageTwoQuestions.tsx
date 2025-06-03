
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

interface PageTwoQuestionsProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
}

const PageTwoQuestions: React.FC<PageTwoQuestionsProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-8">
      <div className="border border-black p-4 bg-gray-50">
        <p className="text-sm leading-relaxed">
          Thank you for taking the time to complete your feedback form. A final few questions and we are almost done! 
          Please answer the questions below in as much detail as you would like. All comments are confidential and serve 
          to help us improve our service delivery. We are always striving to ensure our information is up to date and 
          booking is stress free.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">General:</h3>
          <span className="text-sm font-bold">(Tick Selection)</span>
        </div>
        
        <div className="border border-black">
          <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
            Did the Tour Meet your Expectations?
          </div>
          <div className="p-4 space-y-4">
            <RadioGroup 
              value={formData.met_expectations === null ? '' : formData.met_expectations.toString()} 
              onValueChange={(value) => updateFormData('met_expectations', value === 'true')}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="expectations_yes" />
                <Label htmlFor="expectations_yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="expectations_no" />
                <Label htmlFor="expectations_no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-2">
              <Label className="font-bold">Comment:</Label>
              <Textarea
                value={formData.expectations_comment || ''}
                onChange={(e) => updateFormData('expectations_comment', e.target.value)}
                placeholder="Please explain..."
                className="min-h-[60px]"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Contact Information (Optional)</h3>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="your@email.com"
              className="max-w-md"
            />
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold">Would you be willing to share your experience online?</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="google-review"
                  checked={formData.willing_to_review_google || false}
                  onCheckedChange={(checked) => updateFormData('willing_to_review_google', checked as boolean)}
                />
                <Label htmlFor="google-review" className="cursor-pointer">
                  I'm willing to leave a Google review
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tripadvisor-review"
                  checked={formData.willing_to_review_tripadvisor || false}
                  onCheckedChange={(checked) => updateFormData('willing_to_review_tripadvisor', checked as boolean)}
                />
                <Label htmlFor="tripadvisor-review" className="cursor-pointer">
                  I'm willing to leave a TripAdvisor review
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTwoQuestions;
