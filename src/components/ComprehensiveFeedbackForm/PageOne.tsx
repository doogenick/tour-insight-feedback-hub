
import React from 'react';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Tour, Client } from '../../services/api/types';
import { Button } from '../ui/button';
import TourDetailsSection from './TourDetailsSection';
import TourSectionSelector from './TourSectionSelector';
import MainRatingsSection from './MainRatingsSection';
import CrewDetailedRatings from './CrewDetailedRatings';

interface PageOneProps {
  selectedTour: Tour | null;
  selectedClient: Client | null;
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  onNext: () => void;
}

const PageOne: React.FC<PageOneProps> = ({
  selectedTour,
  selectedClient,
  formData,
  updateFormData,
  onNext
}) => {
  // Determine what sections to show based on tour configuration
  const showCrewRatings = selectedTour?.crew_count && selectedTour.crew_count > 0;
  const showVehicleRatings = selectedTour?.vehicle_type && selectedTour.vehicle_type !== 'none';
  const showNomadCrewRatings = selectedTour?.vehicle_type && 
    ['truck', 'rental'].includes(selectedTour.vehicle_type);
  
  // Show crew detailed ratings if there are crew members (regardless of vehicle type)
  const showCrewDetailedRatings = showCrewRatings;

  return (
    <div className="space-y-8">
      <TourDetailsSection 
        selectedTour={selectedTour}
        selectedClient={selectedClient}
      />
      
      <TourSectionSelector
        value={formData.tour_section_completed}
        onChange={(value) => updateFormData('tour_section_completed', value)}
      />
      
      <MainRatingsSection
        formData={formData}
        updateFormData={updateFormData}
        guideName={selectedTour?.guide_name || ''}
        driverName={selectedTour?.driver_name || ''}
        thirdCrewName={selectedTour?.third_crew_name}
        showVehicleRatings={showVehicleRatings}
        showNomadCrewRatings={showNomadCrewRatings}
      />
      
      {showCrewDetailedRatings && (
        <CrewDetailedRatings
          formData={formData}
          updateFormData={updateFormData}
          guideName={selectedTour?.guide_name || ''}
          driverName={selectedTour?.driver_name || ''}
        />
      )}
      
      <div className="flex justify-center">
        <Button 
          onClick={onNext}
          className="bg-tour-primary hover:bg-tour-secondary px-8 py-3"
          disabled={!selectedClient}
        >
          Continue to Page 2
        </Button>
      </div>
    </div>
  );
};

export default PageOne;
