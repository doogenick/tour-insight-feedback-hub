
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import ComprehensiveRatingRow from './ComprehensiveRatingRow';

interface MainRatingsSectionProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  guideName: string;
  driverName: string;
}

const MainRatingsSection: React.FC<MainRatingsSectionProps> = ({
  formData,
  updateFormData,
  guideName,
  driverName
}) => {
  const ratingItems = [
    { key: 'accommodation', label: 'Accommodation on Tour' },
    { key: 'information', label: 'Information on Tour' },
    { key: 'quality_equipment', label: 'Quality of Equipment' },
    { key: 'truck_comfort', label: 'Practicality & Comfort of Truck' },
    { key: 'food_quantity', label: 'Food Quantity' },
    { key: 'food_quality', label: 'Food Quality' },
    { key: 'driving', label: 'Driving on Tour' },
    { key: 'guiding', label: 'Guiding on Tour' },
    { key: 'organisation', label: 'Organisation on Tour' },
    { key: 'guide_individual', label: guideName || 'Guide' },
    { key: 'driver_individual', label: driverName || 'Driver' },
    { key: 'third_crew', label: '3rd Crew Member' },
    { key: 'pace', label: 'The Pace of the Tour' },
    { key: 'route', label: 'The Route and Highlights' },
    { key: 'activity_level', label: 'The Level of Activity' },
    { key: 'price', label: 'Tour Price' },
    { key: 'value', label: 'Value for Money' },
    { key: 'overview', label: 'Tour Overview' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 border border-black p-2">
        <div className="grid grid-cols-9 gap-2 text-center text-xs font-bold">
          <div>RATING: 1= Excellent 2= Very Good 3= Good 4= Average 5= Below Average 6= Poor 7= Unacceptable</div>
          <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
          <div>COMMENTS:</div>
        </div>
      </div>
      
      <div className="space-y-1">
        {ratingItems.map((item) => (
          <ComprehensiveRatingRow
            key={item.key}
            label={item.label}
            ratingField={`${item.key}_rating`}
            commentsField={`${item.key}_comments`}
            rating={formData[`${item.key}_rating` as keyof ComprehensiveFeedback] as number || 3}
            comments={formData[`${item.key}_comments` as keyof ComprehensiveFeedback] as string || ''}
            onRatingChange={(value) => updateFormData(`${item.key}_rating` as keyof ComprehensiveFeedback, value)}
            onCommentsChange={(value) => updateFormData(`${item.key}_comments` as keyof ComprehensiveFeedback, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainRatingsSection;
