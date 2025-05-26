
import React from 'react';
import { Tour, Client } from '../../services/api';

interface ClientInfoDisplayProps {
  selectedClient: Client | null;
  selectedTour: Tour | null;
}

const ClientInfoDisplay: React.FC<ClientInfoDisplayProps> = ({
  selectedClient,
  selectedTour
}) => {
  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <h3 className="font-medium mb-2">Selected Client:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Name:</p>
          <p className="font-medium">{selectedClient?.full_name || 'No client selected'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tour:</p>
          <p className="font-medium">{selectedTour?.tour_name || 'No tour selected'}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoDisplay;
