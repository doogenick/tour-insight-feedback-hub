
import React from 'react';
import { Tour, Client } from '../../services/api';

interface TourDetailsSectionProps {
  selectedTour: Tour | null;
  selectedClient: Client | null;
}

const TourDetailsSection: React.FC<TourDetailsSectionProps> = ({
  selectedTour,
  selectedClient
}) => {
  return (
    <div className="grid grid-cols-7 gap-2 border-2 border-black p-4 text-center text-sm">
      <div className="border-r border-black pr-2">
        <div className="font-bold">{selectedTour?.truck_name || 'N/A'}</div>
        <div className="text-xs">TRUCK</div>
      </div>
      <div className="border-r border-black pr-2">
        <div className="font-bold">{selectedTour?.driver_name || 'N/A'}</div>
        <div className="text-xs">DRIVER</div>
      </div>
      <div className="border-r border-black pr-2">
        <div className="font-bold">{selectedTour?.guide_name || 'N/A'}</div>
        <div className="text-xs">COURIER</div>
      </div>
      <div className="border-r border-black pr-2">
        <div className="font-bold">0</div>
        <div className="text-xs">3RD CREW</div>
      </div>
      <div className="border-r border-black pr-2">
        <div className="font-bold">{selectedTour?.tour_name?.substring(0, 3).toUpperCase() || 'N/A'}</div>
        <div className="text-xs">TOUR</div>
      </div>
      <div className="border-r border-black pr-2">
        <div className="font-bold">{selectedTour?.tour_code || selectedTour?.tour_id?.substring(0, 4) || 'N/A'}</div>
        <div className="text-xs">CODE</div>
      </div>
      <div>
        <div className="font-bold">{selectedTour?.tour_leader || selectedTour?.guide_name || 'N/A'}</div>
        <div className="text-xs">TOUR LEADER</div>
      </div>
    </div>
  );
};

export default TourDetailsSection;
