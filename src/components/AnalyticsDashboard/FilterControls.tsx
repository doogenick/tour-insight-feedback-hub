
import React from 'react';
import { BarChart4, Filter, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tour } from '../../services/api';
import { excelExportService } from '../../services/excelExportService';
import { useToast } from '../ui/use-toast';

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
  const { toast } = useToast();

  const handleExportTourFeedback = async () => {
    try {
      const exportData = await excelExportService.prepareExportData();
      
      // Filter data for selected tour if not "all"
      const filteredData = selectedTourId === 'all' 
        ? exportData 
        : exportData.filter(item => item.tourId === selectedTourId);

      if (filteredData.length === 0) {
        toast({
          title: "No Data",
          description: "No feedback found for the selected tour",
          variant: "destructive"
        });
        return;
      }

      // Generate CSV for filtered data
      const headers = [
        'Tour ID', 'Tour Name', 'Client Name', 'Client Email', 'Submission Date',
        'Overall Rating', 'Guide Rating', 'Driver Rating', 'Food Rating', 'Equipment Rating',
        'Accommodation Rating', 'Information Rating', 'Truck Comfort Rating', 'Organisation Rating',
        'Comments', 'Tour Highlight', 'Improvement Suggestions', 'Met Expectations', 'Value for Money', 'Would Recommend'
      ];

      const csvRows = [
        headers.join(','),
        ...filteredData.map(row => [
          excelExportService.escapeCSV(row.tourId),
          excelExportService.escapeCSV(row.tourName),
          excelExportService.escapeCSV(row.clientName),
          excelExportService.escapeCSV(row.clientEmail),
          excelExportService.escapeCSV(row.submissionDate),
          row.overallRating || '',
          row.guideRating || '',
          row.driverRating || '',
          row.foodRating || '',
          row.equipmentRating || '',
          row.accommodationRating || '',
          row.informationRating || '',
          row.truckComfortRating || '',
          row.organisationRating || '',
          excelExportService.escapeCSV(row.comments),
          excelExportService.escapeCSV(row.tourHighlight || ''),
          excelExportService.escapeCSV(row.improvementSuggestions || ''),
          excelExportService.booleanToText(row.metExpectations),
          excelExportService.booleanToText(row.valueForMoney),
          excelExportService.booleanToText(row.wouldRecommend)
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const tourName = selectedTourId === 'all' 
        ? 'all-tours' 
        : tours.find(t => t.tour_id === selectedTourId)?.tour_name?.replace(/[^a-zA-Z0-9]/g, '-') || selectedTourId;
      
      link.download = `feedback-${tourName}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Exported ${filteredData.length} feedback entries for ${selectedTourId === 'all' ? 'all tours' : 'selected tour'}`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export feedback data",
        variant: "destructive"
      });
    }
  };

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
        
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Filter className="h-4 w-4 mr-1" />
            <span>
              {selectedTourId === 'all' 
                ? 'Showing all feedback' 
                : `Filtered to ${tours.find(t => t.tour_id === selectedTourId)?.tour_name}`}
            </span>
          </div>
          
          <Button 
            onClick={handleExportTourFeedback}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
