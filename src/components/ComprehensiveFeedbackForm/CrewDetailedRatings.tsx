
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useIsMobile, useIsTablet, useIsDesktop } from '../../hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

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
    
    const handleValueChange = (value: string) => {
      console.log(`Changing ${fieldKey} from ${currentValue} to ${value}`);
      updateFormData(fieldKey, parseInt(value));
    };
    
    return (
      <div className="flex justify-center gap-3 my-2">
        <RadioGroup 
          value={currentValue.toString()} 
          onValueChange={handleValueChange}
          className="flex gap-3"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <RadioGroupItem 
                value={num.toString()} 
                id={`${crewKey}_${categoryKey}_${num}`}
                className="w-6 h-6 border-2 cursor-pointer"
              />
              <Label 
                htmlFor={`${crewKey}_${categoryKey}_${num}`}
                className="mt-1 cursor-pointer select-none text-sm"
              >
                {num}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-black text-white p-4 text-center font-bold">
        <div className={`
          mb-2
          ${isMobile ? 'text-base' : ''}
          ${isTablet ? 'text-xl' : ''}
          ${isDesktop ? 'text-lg' : ''}
        `}>
          CREW DETAILED RATINGS
        </div>
        <div className={`
          ${isMobile ? 'text-xs' : ''}
          ${isTablet ? 'text-base' : ''}
          ${isDesktop ? 'text-sm' : ''}
        `}>
          1 = Excellent | 2 = Very Good | 3 = Good | 4 = Average | 5 = Below Average | 6 = Poor | 7 = Unacceptable
        </div>
      </div>
      
      {/* Responsive Layout */}
      <div className={`
        ${isMobile ? 'space-y-6' : ''}
        ${isTablet ? 'grid grid-cols-2 gap-6' : ''}
        ${isDesktop ? 'grid grid-cols-2 gap-8' : ''}
      `}>
        {crewMembers.map((crew) => (
          <div key={crew.key} className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-tour-primary text-white p-4 text-center font-bold text-lg">
              {crew.name}
            </div>
            <div className={`
              space-y-6
              ${isMobile ? 'p-4' : ''}
              ${isTablet ? 'p-6' : ''}
              ${isDesktop ? 'p-6' : ''}
            `}>
              {crewCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div className={`
                    text-center font-semibold text-gray-700 border-b border-gray-200 pb-2
                    ${isMobile ? 'text-sm' : ''}
                    ${isTablet ? 'text-lg' : ''}
                    ${isDesktop ? 'text-lg' : ''}
                  `}>
                    {category.label}
                  </div>
                  <RatingScale crewKey={crew.key} categoryKey={category.key} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`
        mt-8 border border-gray-300 rounded-lg
        ${isMobile ? 'p-4' : ''}
        ${isTablet ? 'p-6' : ''}
        ${isDesktop ? 'p-6' : ''}
      `}>
        <div className={`
          font-bold text-center mb-4
          ${isMobile ? 'text-base' : ''}
          ${isTablet ? 'text-xl' : ''}
          ${isDesktop ? 'text-lg' : ''}
        `}>
          Additional Comments:
        </div>
        <Textarea
          value={formData.additional_comments || ''}
          onChange={(e) => updateFormData('additional_comments', e.target.value)}
          placeholder="Please share any additional feedback about your experience..."
          className={`
            p-4
            ${isMobile ? 'min-h-[100px] text-base' : ''}
            ${isTablet ? 'min-h-[120px] text-lg' : ''}
            ${isDesktop ? 'min-h-[120px] text-lg' : ''}
          `}
          rows={6}
        />
      </div>
    </div>
  );
};

export default CrewDetailedRatings;
