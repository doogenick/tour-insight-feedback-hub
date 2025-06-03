
import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface TourSectionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TourSectionSelector: React.FC<TourSectionSelectorProps> = ({
  value,
  onChange
}) => {
  const options = [
    { value: 'cape_town_vic_falls', label: 'Cape Town to Vic Falls' },
    { value: 'cape_town_windhoek', label: 'Cape Town to Windhoek' },
    { value: 'cape_town_swakopmund_vic_falls', label: 'Cape Town to Swakopmund to Vic Falls' },
    { value: 'windhoek_vic_falls', label: 'Windhoek to Vic Falls' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-black text-white p-3 text-center text-sm font-bold">
        1. PLEASE INDICATE WITH A CROSS BELOW WHICH SECTION OF THE TOUR YOU COMPLETED
      </div>
      
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="cursor-pointer text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TourSectionSelector;
