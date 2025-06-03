
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

interface AdditionalQuestionsProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
}

const AdditionalQuestions: React.FC<AdditionalQuestionsProps> = ({
  formData,
  updateFormData
}) => {
  const heardAboutOptions = [
    { value: 'word_of_mouth', label: 'Word of Mouth' },
    { value: 'internet', label: 'Internet' },
    { value: 'travel_agent', label: 'Travel Agent' },
    { value: 'brochure', label: 'Brochure' },
    { value: 'repeat_client', label: 'Repeat Client' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      {/* Value for Money */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Do you feel the tour was value for money?
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={formData.value_for_money === null ? '' : formData.value_for_money.toString()} 
            onValueChange={(value) => updateFormData('value_for_money', value === 'true')}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="value_yes" />
              <Label htmlFor="value_yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="value_no" />
              <Label htmlFor="value_no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.value_for_money_comment || ''}
              onChange={(e) => updateFormData('value_for_money_comment', e.target.value)}
              placeholder="Please explain..."
              className="min-h-[60px]"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Truck Satisfaction */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Were you satisfied with the truck and its facilities?
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={formData.truck_satisfaction === null ? '' : formData.truck_satisfaction.toString()} 
            onValueChange={(value) => updateFormData('truck_satisfaction', value === 'true')}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="truck_yes" />
              <Label htmlFor="truck_yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="truck_no" />
              <Label htmlFor="truck_no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.truck_satisfaction_comment || ''}
              onChange={(e) => updateFormData('truck_satisfaction_comment', e.target.value)}
              placeholder="Please explain..."
              className="min-h-[60px]"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Tour Leader Knowledge Rating */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Rate your Tour Leader's knowledge (1=Excellent, 7=Poor)
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={(formData.tour_leader_knowledge || 3).toString()} 
            onValueChange={(value) => updateFormData('tour_leader_knowledge', parseInt(value))}
            className="flex gap-4"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="flex items-center space-x-2">
                <RadioGroupItem value={num.toString()} id={`leader_${num}`} />
                <Label htmlFor={`leader_${num}`} className="cursor-pointer">{num}</Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.tour_leader_knowledge_comment || ''}
              onChange={(e) => updateFormData('tour_leader_knowledge_comment', e.target.value)}
              placeholder="Please explain..."
              className="min-h-[60px]"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Safety Rating */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Rate the safety measures on tour (1=Excellent, 7=Poor)
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={(formData.safety_rating || 3).toString()} 
            onValueChange={(value) => updateFormData('safety_rating', parseInt(value))}
            className="flex gap-4"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="flex items-center space-x-2">
                <RadioGroupItem value={num.toString()} id={`safety_${num}`} />
                <Label htmlFor={`safety_${num}`} className="cursor-pointer">{num}</Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.safety_comment || ''}
              onChange={(e) => updateFormData('safety_comment', e.target.value)}
              placeholder="Please explain..."
              className="min-h-[60px]"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Would Recommend */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Would you recommend Nomad Africa to friends and family?
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={formData.would_recommend === null ? '' : formData.would_recommend.toString()} 
            onValueChange={(value) => updateFormData('would_recommend', value === 'true')}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="recommend_yes" />
              <Label htmlFor="recommend_yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="recommend_no" />
              <Label htmlFor="recommend_no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.would_recommend_comment || ''}
              onChange={(e) => updateFormData('would_recommend_comment', e.target.value)}
              placeholder="Please explain..."
              className="min-h-[60px]"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* How did you hear about us */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          How did you hear about Nomad Africa?
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={formData.heard_about_source || ''} 
            onValueChange={(value) => updateFormData('heard_about_source', value)}
            className="grid grid-cols-2 gap-4"
          >
            {heardAboutOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`heard_${option.value}`} />
                <Label htmlFor={`heard_${option.value}`} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {formData.heard_about_source === 'other' && (
            <div className="space-y-2">
              <Label className="font-bold">Please specify:</Label>
              <Input
                value={formData.heard_about_other || ''}
                onChange={(e) => updateFormData('heard_about_other', e.target.value)}
                placeholder="Please specify..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Repeat Travel */}
      <div className="border border-black">
        <div className="bg-gray-100 p-3 font-bold text-sm border-b border-black">
          Would you travel with Nomad Africa again?
        </div>
        <div className="p-4 space-y-4">
          <RadioGroup 
            value={formData.repeat_travel === null ? '' : formData.repeat_travel.toString()} 
            onValueChange={(value) => updateFormData('repeat_travel', value === 'true')}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="repeat_yes" />
              <Label htmlFor="repeat_yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="repeat_no" />
              <Label htmlFor="repeat_no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label className="font-bold">Comment:</Label>
            <Textarea
              value={formData.repeat_travel_comment || ''}
              onChange={(e) => updateFormData('repeat_travel_comment', e.target.value)}
              placeholder="Please explain..."
              className="min-h-[60px]"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestions;
