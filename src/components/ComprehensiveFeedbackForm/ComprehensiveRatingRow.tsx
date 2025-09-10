
import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface ComprehensiveRatingRowProps {
  label: string;
  ratingField: string;
  commentsField: string;
  rating: number;
  comments: string;
  onRatingChange: (value: number) => void;
  onCommentsChange: (value: string) => void;
}

const ComprehensiveRatingRow: React.FC<ComprehensiveRatingRowProps> = ({
  label,
  rating,
  comments,
  onRatingChange,
  onCommentsChange
}) => {
  return (
    <div className="space-y-2 py-4 border-b border-gray-200">
      {/* Rating label moved above the rating controls */}
      <div className="font-medium text-sm">{label}</div>
      
      <div className="grid grid-cols-8 gap-2 items-center">
        <RadioGroup 
          value={rating?.toString() || ''} 
          onValueChange={(value) => onRatingChange(parseInt(value))}
          className="contents"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const uniqueId = `${label.replace(/\s+/g, '_').toLowerCase()}_${num}`;
            return (
              <div key={num} className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">{num}</span>
                <RadioGroupItem 
                  value={num.toString()} 
                  id={uniqueId}
                  className="w-5 h-5 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label 
                  htmlFor={uniqueId}
                  className="sr-only"
                >
                  Rating {num}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        
        <div className="ml-4">
          <Textarea
            value={comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            placeholder="Comments..."
            className="min-h-[32px] text-xs resize-none"
            rows={1}
          />
        </div>
      </div>
      
      {/* Scale indicator */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>1 = Perfect</span>
        <span>7 = Poor</span>
      </div>
    </div>
  );
};

export default ComprehensiveRatingRow;
