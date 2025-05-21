
import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  showLabel?: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  showLabel = true
}) => {
  // Convert value to slider scale (1.00-7.00 to 0-100)
  const sliderValue = ((value - 1) / 6) * 100;
  
  // Handle slider change
  const handleSliderChange = (newValue: number[]) => {
    // Convert back to 1.00-7.00 scale
    const ratingValue = 1 + (newValue[0] / 100) * 6;
    onChange(parseFloat(ratingValue.toFixed(2)));
  };
  
  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    // Validate range
    if (val < 1) val = 1;
    if (val > 7) val = 7;
    // Round to 2 decimal places
    val = parseFloat(val.toFixed(2));
    onChange(val);
  };

  // Get rating description
  const getRatingDescription = (val: number): string => {
    if (val <= 1.5) return 'Perfect';
    if (val <= 2.5) return 'Excellent';
    if (val <= 3.5) return 'Good';
    if (val <= 4.5) return 'Average';
    if (val <= 5.5) return 'Below Average';
    if (val <= 6.5) return 'Poor';
    return 'Very Poor';
  };

  // Get rating color
  const getRatingColor = (val: number): string => {
    if (val <= 1.5) return 'bg-emerald-500';
    if (val <= 2.5) return 'bg-green-500';
    if (val <= 3.5) return 'bg-lime-500';
    if (val <= 4.5) return 'bg-yellow-500';
    if (val <= 5.5) return 'bg-orange-500';
    if (val <= 6.5) return 'bg-red-500';
    return 'bg-rose-600';
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <div className="flex justify-between items-center">
          <Label htmlFor={`rating-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <span className="text-sm text-muted-foreground">
            (1.00 = Perfect, 7.00 = Very Poor)
          </span>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Slider
            id={`slider-${label.toLowerCase().replace(/\s+/g, '-')}`}
            min={0}
            max={100}
            step={1}
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          <Input
            id={`rating-${label.toLowerCase().replace(/\s+/g, '-')}`}
            type="number"
            min="1.00"
            max="7.00"
            step="0.01"
            value={value}
            onChange={handleInputChange}
            className="w-20 text-center"
            required={required}
          />
        </div>
        
        <div className="grid grid-cols-7 gap-0.5 h-2">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div 
              key={num} 
              className={`h-full ${getRatingColor(num)}`}
            />
          ))}
        </div>
        
        <div className="text-center font-medium text-lg">
          {getRatingDescription(value)}
          <div className={`mt-1 h-2 w-12 mx-auto rounded-full ${getRatingColor(value)}`} />
        </div>
      </div>
    </div>
  );
};

export default RatingInput;
