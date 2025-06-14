import { Feedback, ComprehensiveFeedback, Tour, Client } from './api/types';
import { comprehensiveFeedbackService } from './comprehensiveFeedbackService';

export interface ExcelExportData {
  tourId: string;
  tourName: string;
  clientName: string;
  clientEmail: string;
  submissionDate: string;
  overallRating: number;
  guideRating: number;
  driverRating: number;
  foodRating?: number;
  equipmentRating?: number;
  accommodationRating?: number;
  informationRating?: number;
  truckComfortRating?: number;
  organisationRating?: number;
  comments: string;
  additionalComments?: string;
  tourHighlight?: string;
  improvementSuggestions?: string;
  metExpectations?: boolean;
  valueForMoney?: boolean;
  wouldRecommend?: boolean;
}

export const excelExportService = {
  // Convert feedback data to Excel-friendly format
  async prepareExportData(): Promise<ExcelExportData[]> {
    const exportData: ExcelExportData[] = [];

    // Get simple feedback data
    const simpleFeedback = JSON.parse(localStorage.getItem('feedback') || '[]') as Feedback[];
    
    // Get comprehensive feedback data
    const comprehensiveFeedback = await comprehensiveFeedbackService.getAllFeedback();

    // Process simple feedback
    for (const feedback of simpleFeedback) {
      const tourData = this.getTourData(feedback.tour_id);
      const clientData = this.getClientData(feedback.client_id);

      exportData.push({
        tourId: feedback.tour_id,
        tourName: tourData?.tour_name || 'Unknown Tour',
        clientName: clientData?.full_name || 'Unknown Client',
        clientEmail: clientData?.email || '',
        submissionDate: feedback.submitted_at || '',
        overallRating: feedback.rating_overall,
        guideRating: feedback.rating_guide,
        driverRating: feedback.rating_driver,
        foodRating: feedback.rating_food,
        equipmentRating: feedback.rating_equipment,
        comments: feedback.comments || ''
      });
    }

    // Process comprehensive feedback
    for (const feedback of comprehensiveFeedback) {
      const tourData = this.getTourData(feedback.tour_id);
      const clientData = this.getClientData(feedback.client_id);

      exportData.push({
        tourId: feedback.tour_id,
        tourName: tourData?.tour_name || 'Unknown Tour',
        clientName: feedback.client_name || clientData?.full_name || 'Unknown Client',
        clientEmail: feedback.client_email || clientData?.email || '',
        submissionDate: feedback.submitted_at || '',
        overallRating: feedback.overview_rating,
        guideRating: feedback.guide_individual_rating,
        driverRating: feedback.driver_individual_rating,
        foodRating: (feedback.food_quantity_rating + feedback.food_quality_rating) / 2,
        equipmentRating: feedback.quality_equipment_rating,
        accommodationRating: feedback.accommodation_rating,
        informationRating: feedback.information_rating,
        truckComfortRating: feedback.truck_comfort_rating,
        organisationRating: feedback.organisation_rating,
        comments: feedback.additional_comments || '',
        additionalComments: feedback.additional_comments,
        tourHighlight: feedback.tour_highlight,
        improvementSuggestions: feedback.improvement_suggestions,
        metExpectations: feedback.met_expectations,
        valueForMoney: feedback.value_for_money,
        wouldRecommend: feedback.would_recommend
      });
    }

    return exportData.sort((a, b) => 
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  },

  // Generate CSV content for Excel import
  async generateCSV(): Promise<string> {
    const data = await this.prepareExportData();
    
    const headers = [
      'Tour ID',
      'Tour Name',
      'Client Name',
      'Client Email',
      'Submission Date',
      'Overall Rating',
      'Guide Rating',
      'Driver Rating',
      'Food Rating',
      'Equipment Rating',
      'Accommodation Rating',
      'Information Rating',
      'Truck Comfort Rating',
      'Organisation Rating',
      'Comments',
      'Tour Highlight',
      'Improvement Suggestions',
      'Met Expectations',
      'Value for Money',
      'Would Recommend'
    ];

    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        this.escapeCSV(row.tourId),
        this.escapeCSV(row.tourName),
        this.escapeCSV(row.clientName),
        this.escapeCSV(row.clientEmail),
        this.escapeCSV(row.submissionDate),
        row.overallRating || '',
        row.guideRating || '',
        row.driverRating || '',
        row.foodRating || '',
        row.equipmentRating || '',
        row.accommodationRating || '',
        row.informationRating || '',
        row.truckComfortRating || '',
        row.organisationRating || '',
        this.escapeCSV(row.comments),
        this.escapeCSV(row.tourHighlight || ''),
        this.escapeCSV(row.improvementSuggestions || ''),
        this.booleanToText(row.metExpectations),
        this.booleanToText(row.valueForMoney),
        this.booleanToText(row.wouldRecommend)
      ].join(','))
    ];

    return csvRows.join('\n');
  },

  // Generate Excel-compatible blob
  async exportToExcel(): Promise<Blob> {
    const csvContent = await this.generateCSV();
    return new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
  },

  // Generate summary report
  async generateSummaryReport(): Promise<string> {
    const data = await this.prepareExportData();
    
    if (data.length === 0) {
      return 'No feedback data available for export.';
    }

    const avgOverall = this.calculateAverage(data.map(d => d.overallRating));
    const avgGuide = this.calculateAverage(data.map(d => d.guideRating));
    const avgDriver = this.calculateAverage(data.map(d => d.driverRating));

    const summary = `
TOUR FEEDBACK SUMMARY REPORT
Generated: ${new Date().toLocaleDateString()}

OVERVIEW:
- Total Responses: ${data.length}
- Average Overall Rating: ${avgOverall.toFixed(2)}/7
- Average Guide Rating: ${avgGuide.toFixed(2)}/7
- Average Driver Rating: ${avgDriver.toFixed(2)}/7

RECENT FEEDBACK:
${data.slice(0, 5).map(d => `
- ${d.tourName} (${d.clientName}): Overall ${d.overallRating}/7
  Comment: "${d.comments.substring(0, 100)}${d.comments.length > 100 ? '...' : ''}"
`).join('')}

EXPORT INSTRUCTIONS:
1. Download the CSV file
2. Open in Excel or Google Sheets
3. Use "Data > Text to Columns" if needed
4. Format rating columns as numbers
5. Format date columns as dates
    `;

    return summary.trim();
  },

  // Helper functions
  getTourData(tourId: string) {
    const tours = JSON.parse(localStorage.getItem('tours') || '[]');
    return tours.find((tour: Tour) => tour.tour_id === tourId);
  },

  getClientData(clientId: string) {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    return clients.find((client: Client) => client.client_id === clientId);
  },

  escapeCSV(value: string | undefined): string {
    if (!value) return '';
    const stringValue = value.toString();
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  },

  booleanToText(value: boolean | null | undefined): string {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return '';
  },

  calculateAverage(values: number[]): number {
    const validValues = values.filter(v => typeof v === 'number' && !isNaN(v));
    if (validValues.length === 0) return 0;
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  }
};
