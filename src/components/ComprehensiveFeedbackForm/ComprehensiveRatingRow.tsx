
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
    <div className="grid grid-cols-9 gap-2 py-2 border-b border-gray-200 items-center text-sm">
      <div className="font-medium">{label}</div>
      
      <RadioGroup 
        value={rating?.toString() || ''} 
        onValueChange={(value) => onRatingChange(parseInt(value))}
        className="contents"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((num) => {
          const uniqueId = `${label.replace(/\s+/g, '_').toLowerCase()}_${num}`;
          return (
            <div key={num} className="flex justify-center">
              <RadioGroupItem 
                value={num.toString()} 
                id={uniqueId}
                className="w-4 h-4"
              />
              <Label 
                htmlFor={uniqueId}
                className="sr-only"
              >
                {num}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      
      <div>
        <Textarea
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          placeholder="Comments..."
          className="min-h-[32px] text-xs resize-none"
          rows={1}
        />
      </div>
    </div>
  );
};

export default ComprehensiveRatingRow;
