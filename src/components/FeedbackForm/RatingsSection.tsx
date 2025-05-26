
import React from 'react';
import RatingInput from '../RatingInput';

interface RatingsSectionProps {
  ratingOverall: number;
  ratingGuide: number;
  ratingDriver: number;
  ratingFood: number;
  ratingEquipment: number;
  onRatingOverallChange: (rating: number) => void;
  onRatingGuideChange: (rating: number) => void;
  onRatingDriverChange: (rating: number) => void;
  onRatingFoodChange: (rating: number) => void;
  onRatingEquipmentChange: (rating: number) => void;
}

const RatingsSection: React.FC<RatingsSectionProps> = ({
  ratingOverall,
  ratingGuide,
  ratingDriver,
  ratingFood,
  ratingEquipment,
  onRatingOverallChange,
  onRatingGuideChange,
  onRatingDriverChange,
  onRatingFoodChange,
  onRatingEquipmentChange
}) => {
  return (
    <div className="space-y-6">
      <RatingInput
        label="Overall Rating"
        value={ratingOverall}
        onChange={onRatingOverallChange}
        required
      />
      
      <RatingInput
        label="Guide Rating"
        value={ratingGuide}
        onChange={onRatingGuideChange}
        required
      />
      
      <RatingInput
        label="Driver Rating"
        value={ratingDriver}
        onChange={onRatingDriverChange}
        required
      />
      
      <RatingInput
        label="Food Quality"
        value={ratingFood}
        onChange={onRatingFoodChange}
      />
      
      <RatingInput
        label="Equipment Quality"
        value={ratingEquipment}
        onChange={onRatingEquipmentChange}
      />
    </div>
  );
};

export default RatingsSection;
