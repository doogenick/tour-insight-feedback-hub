
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
        className="flex flex-row justify-center gap-1 sm:gap-2"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <RadioGroupItem 
              value={num.toString()} 
              id={`${crewKey}_${categoryKey}_${num}`}
              className="w-6 h-6 sm:w-4 sm:h-4 border-2"
            />
            <Label 
              htmlFor={`${crewKey}_${categoryKey}_${num}`}
              className="text-xs mt-1 cursor-pointer"
            >
              {num}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="bg-black text-white p-3 text-center text-sm font-bold">
        CREW DETAILED RATINGS
        <div className="text-xs mt-1">1= Excellent 2= Very Good 3= Good 4= Average 5= Below Average 6= Poor 7= Unacceptable</div>
      </div>
      
      {/* Desktop View */}
      <div className="hidden lg:block border border-black">
        <div className="grid grid-cols-6 gap-2 bg-gray-100 border-b border-black">
          <div className="p-2 text-center font-bold text-xs border-r border-black">CREW</div>
          {crewCategories.map((category) => (
            <div key={category.key} className="p-2 text-center font-bold text-xs border-r border-black last:border-r-0">
              {category.label}
              <br />
              <span className="text-xs">1 2 3 4 5 6 7</span>
            </div>
          ))}
        </div>
        
        {crewMembers.map((crew) => (
          <div key={crew.key} className="grid grid-cols-6 gap-2 border-b border-gray-200 last:border-b-0">
            <div className="p-2 font-bold text-xs bg-gray-50 border-r border-gray-200">
              {crew.name}
            </div>
            {crewCategories.map((category) => (
              <div key={category.key} className="p-1 border-r border-gray-200 last:border-r-0">
                <RatingScale crewKey={crew.key} categoryKey={category.key} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-6">
        {crewMembers.map((crew) => (
          <div key={crew.key} className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 font-bold text-center border-b border-gray-300">
              {crew.name}
            </div>
            <div className="p-4 space-y-4">
              {crewCategories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <div className="font-medium text-sm">{category.label}</div>
                  <RatingScale crewKey={crew.key} categoryKey={category.key} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <div className="font-bold mb-2">Additional Comments:</div>
        <Textarea
          value={formData.additional_comments || ''}
          onChange={(e) => updateFormData('additional_comments', e.target.value)}
          placeholder="Please share any additional feedback about your experience..."
          className="min-h-[80px]"
          rows={4}
        />
      </div>
    </div>
  );
};

export default CrewDetailedRatings;
