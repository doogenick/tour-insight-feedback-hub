
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { FileText, Download, RotateCcw } from 'lucide-react';

interface SubmissionActionsProps {
  formData: Partial<ComprehensiveFeedback>;
  onClearForm: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SubmissionActions: React.FC<SubmissionActionsProps> = ({
  formData,
  onClearForm,
  onSubmit,
  isSubmitting
}) => {
  const { toast } = useToast();

  const printReport = () => {
    const reportContent = generateReportContent(formData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Nomad Africa Tour Feedback Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2 { color: #333; }
              .section { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; }
              .rating { font-weight: bold; color: #0066cc; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${reportContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportData = () => {
    const dataToExport = {
      ...formData,
      exported_at: new Date().toISOString(),
      export_type: 'comprehensive_feedback'
    };
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `nomad-feedback-${formData.client_id || 'unknown'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Feedback data has been downloaded as JSON file",
      duration: 3000,
    });
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      onClearForm();
      toast({
        title: "Form Cleared",
        description: "All form data has been reset",
        duration: 3000,
      });
    }
  };

  const generateReportContent = (data: Partial<ComprehensiveFeedback>): string => {
    return `
      <h1>Nomad Africa Tour Feedback Report</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      
      <div class="section">
        <h2>Tour Information</h2>
        <p><strong>Tour Section:</strong> ${data.tour_section_completed || 'Not specified'}</p>
      </div>
      
      <div class="section">
        <h2>Main Ratings (1=Excellent, 7=Poor)</h2>
        <p><strong>Accommodation:</strong> <span class="rating">${data.accommodation_rating || 'N/A'}</span></p>
        <p><strong>Information:</strong> <span class="rating">${data.information_rating || 'N/A'}</span></p>
        <p><strong>Equipment Quality:</strong> <span class="rating">${data.quality_equipment_rating || 'N/A'}</span></p>
        <p><strong>Truck Comfort:</strong> <span class="rating">${data.truck_comfort_rating || 'N/A'}</span></p>
        <p><strong>Food Quality:</strong> <span class="rating">${data.food_quality_rating || 'N/A'}</span></p>
        <p><strong>Food Quantity:</strong> <span class="rating">${data.food_quantity_rating || 'N/A'}</span></p>
        <p><strong>Driving:</strong> <span class="rating">${data.driving_rating || 'N/A'}</span></p>
        <p><strong>Guiding:</strong> <span class="rating">${data.guiding_rating || 'N/A'}</span></p>
        <p><strong>Organisation:</strong> <span class="rating">${data.organisation_rating || 'N/A'}</span></p>
        <p><strong>Overall:</strong> <span class="rating">${data.overview_rating || 'N/A'}</span></p>
      </div>
      
      <div class="section">
        <h2>General Feedback</h2>
        <p><strong>Met Expectations:</strong> ${data.met_expectations === true ? 'Yes' : data.met_expectations === false ? 'No' : 'Not answered'}</p>
        <p><strong>Would Recommend:</strong> ${data.would_recommend === true ? 'Yes' : data.would_recommend === false ? 'No' : 'Not answered'}</p>
        <p><strong>Value for Money:</strong> ${data.value_for_money === true ? 'Yes' : data.value_for_money === false ? 'No' : 'Not answered'}</p>
      </div>
      
      ${data.tour_highlight ? `<div class="section"><h2>Tour Highlight</h2><p>${data.tour_highlight}</p></div>` : ''}
      ${data.improvement_suggestions ? `<div class="section"><h2>Improvement Suggestions</h2><p>${data.improvement_suggestions}</p></div>` : ''}
      ${data.additional_comments ? `<div class="section"><h2>Additional Comments</h2><p>${data.additional_comments}</p></div>` : ''}
    `;
  };

  return (
    <div className="bg-gray-100 border-2 border-black p-6 text-center space-y-4">
      <h3 className="font-bold text-lg">Form Actions</h3>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={printReport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Print Report
        </Button>
        
        <Button
          onClick={exportData}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
        
        <Button
          onClick={handleClearForm}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Clear Form
        </Button>
        
        <Button
          onClick={onSubmit}
          className="bg-tour-primary hover:bg-tour-secondary px-8 py-3 flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
};

export default SubmissionActions;
