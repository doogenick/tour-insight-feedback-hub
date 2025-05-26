
import React from 'react';
import { BarChart4, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Tour } from '../../services/api';

interface FilterControlsProps {
  selectedTourId: string;
  tours: Tour[];
  onTourChange: (tourId: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  selectedTourId, 
  tours, 
  onTourChange 
}) => {
  return (
    <div className="flex items-end justify-between pb-4 border-b">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <BarChart4 className="h-5 w-5" />
        <span>Performance Dashboard</span>
      </h3>
      
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="tour-filter" className="text-sm">Filter by Tour</Label>
          <Select value={selectedTourId} onValueChange={onTourChange}>
            <SelectTrigger id="tour-filter" className="w-[200px]">
              <SelectValue placeholder="Select Tour" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tours</SelectItem>
              {tours.map(tour => (
                <SelectItem key={tour.tour_id} value={tour.tour_id}>
                  {tour.tour_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Filter className="h-4 w-4 mr-1" />
          <span>
            {selectedTourId === 'all' 
              ? 'Showing all feedback' 
              : `Filtered to ${tours.find(t => t.tour_id === selectedTourId)?.tour_name}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
