
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
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
    <div className="space-y-6">
      <div className="intro-text border border-black p-4 mb-6">
        <p className="text-sm">
          Thank you for taking the time to complete your feedback form. A final few questions and we are almost done! 
          Please answer the questions below in as much detail as you would like. All comments are confidential and 
          serve to help us improve our service delivery. We are always striving to ensure our information is up to 
          date and booking is stress free.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">General:</h3>
        <div className="text-center font-bold">(Tick Selection)</div>
      </div>

      {/* Did the Tour Meet your Expectations */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Did the Tour Meet your Expectations?
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="expectations-yes"
                checked={formData.met_expectations === true}
                onCheckedChange={(checked) => updateFormData('met_expectations', checked === true ? true : null)}
              />
              <Label htmlFor="expectations-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="expectations-no"
                checked={formData.met_expectations === false}
                onCheckedChange={(checked) => updateFormData('met_expectations', checked === true ? false : null)}
              />
              <Label htmlFor="expectations-no" className="cursor-pointer">No</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.expectations_comment || ''}
              onChange={(e) => updateFormData('expectations_comment', e.target.value)}
              placeholder="Please share your thoughts..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Value for Money */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Do you feel the Tour offered value for money?
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="value-yes"
                checked={formData.value_for_money === true}
                onCheckedChange={(checked) => updateFormData('value_for_money', checked === true ? true : null)}
              />
              <Label htmlFor="value-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="value-no"
                checked={formData.value_for_money === false}
                onCheckedChange={(checked) => updateFormData('value_for_money', checked === true ? false : null)}
              />
              <Label htmlFor="value-no" className="cursor-pointer">No</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.value_for_money_comment || ''}
              onChange={(e) => updateFormData('value_for_money_comment', e.target.value)}
              placeholder="Please explain..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Would you recommend this tour */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Would you recommend this tour to a friend?
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommend-yes"
                checked={formData.would_recommend === true}
                onCheckedChange={(checked) => updateFormData('would_recommend', checked === true ? true : null)}
              />
              <Label htmlFor="recommend-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommend-no"
                checked={formData.would_recommend === false}
                onCheckedChange={(checked) => updateFormData('would_recommend', checked === true ? false : null)}
              />
              <Label htmlFor="recommend-no" className="cursor-pointer">No</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.would_recommend_comment || ''}
              onChange={(e) => updateFormData('would_recommend_comment', e.target.value)}
              placeholder="Please tell us why..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTwoQuestions;
