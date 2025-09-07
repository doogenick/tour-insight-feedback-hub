
import React from 'react';
import { Tour, Client } from '../../services/api/types';

interface TourDetailsSectionProps {
  selectedTour: Tour | null;
  selectedClient: Client | null;
}

const TourDetailsSection: React.FC<TourDetailsSectionProps> = ({
  selectedTour,
  selectedClient
}) => {
  if (!selectedTour || !selectedClient) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded">
        <p className="text-red-600">Please select a tour and client first.</p>
      </div>
    );
  }

  return (
    <div className="tour-details grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 border border-black p-4 mb-6 text-xs sm:text-sm">
      <div className="text-center border-r border-black pr-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.truck_name || selectedTour.vehicle_name || 'Truck Name'}</div>
        <div className="text-xs text-gray-600">TRUCK</div>
      </div>
      
      <div className="text-center border-r border-black px-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.driver_name || 'Driver'}</div>
        <div className="text-xs text-gray-600">DRIVER</div>
      </div>
      
      <div className="text-center border-r border-black px-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.guide_name || 'Guide'}</div>
        <div className="text-xs text-gray-600">COURIER</div>
      </div>
      
      <div className="text-center border-r border-black px-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.third_crew_name || '-'}</div>
        <div className="text-xs text-gray-600">3RD CREW</div>
      </div>
      
      <div className="text-center border-r border-black px-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.tour_code || 'CODE'}</div>
        <div className="text-xs text-gray-600">TOUR</div>
      </div>
      
      <div className="text-center border-r border-black px-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.tour_leader || selectedTour.tour_code}</div>
        <div className="text-xs text-gray-600">CODE</div>
      </div>
      
      <div className="text-center pl-2 min-w-0">
        <div className="font-bold truncate">{selectedTour.tour_leader || selectedTour.guide_name || 'Tour Leader'}</div>
        <div className="text-xs text-gray-600">TOUR LEADER</div>
      </div>
    </div>
  );
};

export default TourDetailsSection;
