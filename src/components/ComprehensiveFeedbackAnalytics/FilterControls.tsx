
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Filter, X } from 'lucide-react';
import { ComprehensiveFeedback } from '../../services/api/types';

interface FilterControlsProps {
  feedback: ComprehensiveFeedback[];
  onFilterChange: (filteredFeedback: ComprehensiveFeedback[]) => void;
  filters: {
    tourSection: string;
    dateRange: string;
    nationality: string;
    ratingThreshold: number;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  feedback,
  onFilterChange,
  filters,
  onFiltersChange
}) => {
  const applyFilters = () => {
    let filtered = [...feedback];

    // Filter by tour section
    if (filters.tourSection) {
      filtered = filtered.filter(f => f.tour_section_completed === filters.tourSection);
    }

    // Filter by nationality
    if (filters.nationality) {
      filtered = filtered.filter(f => f.nationality === filters.nationality);
    }

    // Filter by rating threshold (show only ratings below threshold)
    if (filters.ratingThreshold > 0) {
      filtered = filtered.filter(f => 
        f.overview_rating >= filters.ratingThreshold ||
        f.accommodation_rating >= filters.ratingThreshold ||
        f.guiding_rating >= filters.ratingThreshold ||
        f.driving_rating >= filters.ratingThreshold
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      let dateThreshold: Date;
      
      switch (filters.dateRange) {
        case 'week':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateThreshold = new Date(0);
      }
      
      filtered = filtered.filter(f => 
        f.submitted_at && new Date(f.submitted_at) >= dateThreshold
      );
    }

    onFilterChange(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, feedback]);

  const clearFilters = () => {
    const clearedFilters = {
      tourSection: '',
      dateRange: '',
      nationality: '',
      ratingThreshold: 0
    };
    onFiltersChange(clearedFilters);
  };

  // Get unique values for filter options
  const tourSections = [...new Set(feedback.map(f => f.tour_section_completed).filter(Boolean))];
  const nationalities = [...new Set(feedback.map(f => f.nationality).filter(Boolean))];

  const hasActiveFilters = filters.tourSection || filters.dateRange || filters.nationality || filters.ratingThreshold > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tour-section">Tour Section</Label>
            <Select 
              value={filters.tourSection} 
              onValueChange={(value) => onFiltersChange({...filters, tourSection: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sections</SelectItem>
                {tourSections.map(section => (
                  <SelectItem key={section} value={section}>
                    {section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => onFiltersChange({...filters, dateRange: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All time</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Select 
              value={filters.nationality} 
              onValueChange={(value) => onFiltersChange({...filters, nationality: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All nationalities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All nationalities</SelectItem>
                {nationalities.map(nationality => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating-threshold">Problem Ratings</Label>
            <Select 
              value={filters.ratingThreshold.toString()} 
              onValueChange={(value) => onFiltersChange({...filters, ratingThreshold: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All ratings</SelectItem>
                <SelectItem value="5">Show ratings 5+ (Poor)</SelectItem>
                <SelectItem value="6">Show ratings 6+ (Very Poor)</SelectItem>
                <SelectItem value="7">Show ratings 7 (Unacceptable)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Active filters applied
            </p>
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterControls;
