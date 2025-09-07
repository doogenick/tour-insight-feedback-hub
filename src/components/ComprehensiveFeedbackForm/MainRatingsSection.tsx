
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import ComprehensiveRatingRow from './ComprehensiveRatingRow';

interface MainRatingsSectionProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  guideName: string;
  driverName: string;
  thirdCrewName?: string;
}

const MainRatingsSection: React.FC<MainRatingsSectionProps> = ({
  formData,
  updateFormData,
  guideName,
  driverName,
  thirdCrewName
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
    ...(thirdCrewName ? [{ key: 'third_crew', label: thirdCrewName }] : []),
    { key: 'pace', label: 'The Pace of the Tour' },
    { key: 'route', label: 'The Route and Highlights' },
    { key: 'activity_level', label: 'The Level of Activity' },
    { key: 'value', label: 'Value for Money' },
    { key: 'overview', label: 'Tour Overview' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 border border-black p-3 space-y-2">
        <div className="text-xs font-bold text-center">
          <div className="mb-2">RATING SCALE DEFINITIONS:</div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-1 text-center">
            <div className="bg-green-100 p-1 rounded">1 = Excellent</div>
            <div className="bg-green-50 p-1 rounded">2 = Very Good</div>
            <div className="bg-yellow-100 p-1 rounded">3 = Good</div>
            <div className="bg-yellow-50 p-1 rounded">4 = Average</div>
            <div className="bg-orange-100 p-1 rounded">5 = Below Avg</div>
            <div className="bg-red-100 p-1 rounded">6 = Poor</div>
            <div className="bg-red-200 p-1 rounded">7 = Unacceptable</div>
          </div>
        </div>
        <div className="grid grid-cols-9 gap-2 text-center text-xs font-bold">
          <div>ASPECT</div>
          <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
          <div>COMMENTS</div>
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
