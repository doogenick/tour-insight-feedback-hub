
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface CrewDetailedRatingsProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  guideName: string;
  driverName: string;
}

const CrewDetailedRatings: React.FC<CrewDetailedRatingsProps> = ({
  formData,
  updateFormData,
  guideName,
  driverName
}) => {
  const crewCategories = [
    { key: 'professionalism', label: 'Professionalism' },
    { key: 'organisation', label: 'Organisation' },
    { key: 'people_skills', label: 'People Skills' },
    { key: 'enthusiasm', label: 'Enthusiasm' },
    { key: 'information', label: 'Information' }
  ];

  const crewMembers = [
    { key: 'guide', name: guideName || 'Guide' },
    { key: 'driver', name: driverName || 'Driver' }
  ];

  const RatingScale = ({ crewKey, categoryKey }: { crewKey: string; categoryKey: string }) => {
    const fieldKey = `${crewKey}_${categoryKey}` as keyof ComprehensiveFeedback;
    const currentValue = formData[fieldKey] as number || 3;
    
    return (
      <RadioGroup 
        value={currentValue.toString()} 
        onValueChange={(value) => updateFormData(fieldKey, parseInt(value))}
        className="flex justify-center gap-3 my-2"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <RadioGroupItem 
              value={num.toString()} 
              id={`${crewKey}_${categoryKey}_${num}`}
              className="w-5 h-5 border-2 touch-manipulation"
            />
            <Label 
              htmlFor={`${crewKey}_${categoryKey}_${num}`}
              className="text-sm mt-1 cursor-pointer select-none"
            >
              {num}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-black text-white p-4 text-center font-bold">
        <div className="text-lg mb-2">CREW DETAILED RATINGS</div>
        <div className="text-sm">1 = Excellent | 2 = Very Good | 3 = Good | 4 = Average | 5 = Below Average | 6 = Poor | 7 = Unacceptable</div>
      </div>
      
      {/* Mobile-First Design */}
      <div className="space-y-8">
        {crewMembers.map((crew) => (
          <div key={crew.key} className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-tour-primary text-white p-4 text-center font-bold text-lg">
              {crew.name}
            </div>
            <div className="p-6 space-y-6">
              {crewCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div className="text-center font-semibold text-lg text-gray-700 border-b border-gray-200 pb-2">
                    {category.label}
                  </div>
                  <RatingScale crewKey={crew.key} categoryKey={category.key} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 border border-gray-300 rounded-lg">
        <div className="font-bold text-lg mb-4 text-center">Additional Comments:</div>
        <Textarea
          value={formData.additional_comments || ''}
          onChange={(e) => updateFormData('additional_comments', e.target.value)}
          placeholder="Please share any additional feedback about your experience..."
          className="min-h-[120px] text-lg p-4"
          rows={6}
        />
      </div>
    </div>
  );
};

export default CrewDetailedRatings;
