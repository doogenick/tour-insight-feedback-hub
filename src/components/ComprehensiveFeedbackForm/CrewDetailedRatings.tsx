
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

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

  return (
    <div className="space-y-4 mt-8">
      <div className="bg-black text-white p-2 text-center text-xs font-bold">
        CREW DETAILED RATINGS: 1= Excellent 2= Very Good 3= Good 4= Average 5= Below Average 6= Poor 7= Unacceptable
      </div>
      
      <div className="border border-black">
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
            {crewCategories.map((category) => {
              const fieldKey = `${crew.key}_${category.key}` as keyof ComprehensiveFeedback;
              const currentValue = formData[fieldKey] as number || 3;
              
              return (
                <div key={category.key} className="p-1 border-r border-gray-200 last:border-r-0">
                  <RadioGroup 
                    value={currentValue.toString()} 
                    onValueChange={(value) => updateFormData(fieldKey, parseInt(value))}
                    className="flex justify-center gap-1"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <RadioGroupItem 
                        key={num}
                        value={num.toString()} 
                        id={`${crew.key}_${category.key}_${num}`}
                        className="w-3 h-3"
                      />
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
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
