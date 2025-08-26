
import { ComprehensiveFeedback } from './api/types';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Configure localforage for comprehensive feedback
const comprehensiveFeedbackStore = localforage.createInstance({
  name: 'comprehensive-feedback',
  storeName: 'submissions'
});

export interface FeedbackAnalytics {
  totalSubmissions: number;
  averageRatings: {
    accommodation: number;
    information: number;
    qualityEquipment: number;
    truckComfort: number;
    foodQuantity: number;
    foodQuality: number;
    driving: number;
    guiding: number;
    organisation: number;
    overview: number;
  };
  satisfactionMetrics: {
    metExpectations: { yes: number; no: number; percentage: number };
    valueForMoney: { yes: number; no: number; percentage: number };
    wouldRecommend: { yes: number; no: number; percentage: number };
  };
  commonFeedback: {
    highlights: string[];
    improvements: string[];
    additionalComments: string[];
  };
  crewPerformance: {
    guide: {
      averageRating: number;
      professionalism: number;
      organisation: number;
      peopleSkills: number;
      enthusiasm: number;
      information: number;
    };
    driver: {
      averageRating: number;
      professionalism: number;
      organisation: number;
      peopleSkills: number;
      enthusiasm: number;
      information: number;
    };
  };
}

function calculateAverage(feedback: ComprehensiveFeedback[], field: keyof ComprehensiveFeedback): number {
  const values = feedback
    .map(f => f[field] as number)
    .filter(v => typeof v === 'number' && !isNaN(v));
  
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 100) / 100;
}

function calculateBooleanMetrics(feedback: ComprehensiveFeedback[], field: keyof ComprehensiveFeedback) {
  const responses = feedback
    .map(f => f[field])
    .filter(v => v === true || v === false);
  
  const yes = responses.filter(r => r === true).length;
  const no = responses.filter(r => r === false).length;
  const total = yes + no;
  
  return {
    yes,
    no,
    percentage: total > 0 ? Math.round((yes / total) * 100) : 0
  };
}

export const comprehensiveFeedbackService = {
  // Phase 1: Basic storage and retrieval
  async submitFeedback(feedbackData: Omit<ComprehensiveFeedback, 'id' | 'status' | 'submitted_at'>): Promise<ComprehensiveFeedback> {
    const newFeedback: ComprehensiveFeedback = {
      ...feedbackData,
      id: uuidv4(),
      status: 'Pending',
      submitted_at: new Date().toISOString()
    };

    await comprehensiveFeedbackStore.setItem(newFeedback.id, newFeedback);
    
    
    return newFeedback;
  },

  async getAllFeedback(): Promise<ComprehensiveFeedback[]> {
    const feedback: ComprehensiveFeedback[] = [];
    const keys = await comprehensiveFeedbackStore.keys();
    
    for (const key of keys) {
      const item = await comprehensiveFeedbackStore.getItem<ComprehensiveFeedback>(key);
      if (item) {
        feedback.push(item);
      }
    }
    
    return feedback.sort((a, b) => 
      new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime()
    );
  },

  async getFeedbackByTour(tourId: string): Promise<ComprehensiveFeedback[]> {
    const allFeedback = await this.getAllFeedback();
    return allFeedback.filter(feedback => feedback.tour_id === tourId);
  },

  async clearAllFeedback(): Promise<void> {
    await comprehensiveFeedbackStore.clear();
  },

  // Phase 2: Data analysis and reporting
  async generateAnalytics(): Promise<FeedbackAnalytics> {
    const allFeedback = await this.getAllFeedback();
    
    if (allFeedback.length === 0) {
      return {
        totalSubmissions: 0,
        averageRatings: {
          accommodation: 0,
          information: 0,
          qualityEquipment: 0,
          truckComfort: 0,
          foodQuantity: 0,
          foodQuality: 0,
          driving: 0,
          guiding: 0,
          organisation: 0,
          overview: 0
        },
        satisfactionMetrics: {
          metExpectations: { yes: 0, no: 0, percentage: 0 },
          valueForMoney: { yes: 0, no: 0, percentage: 0 },
          wouldRecommend: { yes: 0, no: 0, percentage: 0 }
        },
        commonFeedback: {
          highlights: [],
          improvements: [],
          additionalComments: []
        },
        crewPerformance: {
          guide: {
            averageRating: 0,
            professionalism: 0,
            organisation: 0,
            peopleSkills: 0,
            enthusiasm: 0,
            information: 0
          },
          driver: {
            averageRating: 0,
            professionalism: 0,
            organisation: 0,
            peopleSkills: 0,
            enthusiasm: 0,
            information: 0
          }
        }
      };
    }

    // Calculate average ratings
    const averageRatings = {
      accommodation: calculateAverage(allFeedback, 'accommodation_rating'),
      information: calculateAverage(allFeedback, 'information_rating'),
      qualityEquipment: calculateAverage(allFeedback, 'quality_equipment_rating'),
      truckComfort: calculateAverage(allFeedback, 'truck_comfort_rating'),
      foodQuantity: calculateAverage(allFeedback, 'food_quantity_rating'),
      foodQuality: calculateAverage(allFeedback, 'food_quality_rating'),
      driving: calculateAverage(allFeedback, 'driving_rating'),
      guiding: calculateAverage(allFeedback, 'guiding_rating'),
      organisation: calculateAverage(allFeedback, 'organisation_rating'),
      overview: calculateAverage(allFeedback, 'overview_rating')
    };

    // Calculate satisfaction metrics
    const satisfactionMetrics = {
      metExpectations: calculateBooleanMetrics(allFeedback, 'met_expectations'),
      valueForMoney: calculateBooleanMetrics(allFeedback, 'value_for_money'),
      wouldRecommend: calculateBooleanMetrics(allFeedback, 'would_recommend')
    };

    // Extract common feedback
    const commonFeedback = {
      highlights: allFeedback
        .map(f => f.tour_highlight)
        .filter(h => h && h.trim().length > 0) as string[],
      improvements: allFeedback
        .map(f => f.improvement_suggestions)
        .filter(i => i && i.trim().length > 0) as string[],
      additionalComments: allFeedback
        .map(f => f.additional_comments)
        .filter(c => c && c.trim().length > 0) as string[]
    };

    // Calculate crew performance
    const crewPerformance = {
      guide: {
        averageRating: calculateAverage(allFeedback, 'guide_individual_rating'),
        professionalism: calculateAverage(allFeedback, 'guide_professionalism'),
        organisation: calculateAverage(allFeedback, 'guide_organisation'),
        peopleSkills: calculateAverage(allFeedback, 'guide_people_skills'),
        enthusiasm: calculateAverage(allFeedback, 'guide_enthusiasm'),
        information: calculateAverage(allFeedback, 'guide_information')
      },
      driver: {
        averageRating: calculateAverage(allFeedback, 'driver_individual_rating'),
        professionalism: calculateAverage(allFeedback, 'driver_professionalism'),
        organisation: calculateAverage(allFeedback, 'driver_organisation'),
        peopleSkills: calculateAverage(allFeedback, 'driver_people_skills'),
        enthusiasm: calculateAverage(allFeedback, 'driver_enthusiasm'),
        information: calculateAverage(allFeedback, 'driver_information')
      }
    };

    return {
      totalSubmissions: allFeedback.length,
      averageRatings,
      satisfactionMetrics,
      commonFeedback,
      crewPerformance
    };
  },

  // Export functionality
  async exportToJSON(): Promise<Blob> {
    const allFeedback = await this.getAllFeedback();
    const analytics = await this.generateAnalytics();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      analytics,
      submissions: allFeedback
    };
    
    return new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
  },

  async exportToCSV(): Promise<Blob> {
    const allFeedback = await this.getAllFeedback();
    
    if (allFeedback.length === 0) {
      return new Blob(['No feedback data available'], { type: 'text/csv' });
    }
    
    // Create CSV headers
    const headers = [
      'Submission ID',
      'Tour ID',
      'Client ID',
      'Submitted Date',
      'Tour Section',
      'Accommodation Rating',
      'Information Rating',
      'Equipment Rating',
      'Truck Comfort Rating',
      'Food Quantity Rating',
      'Food Quality Rating',
      'Driving Rating',
      'Guiding Rating',
      'Organisation Rating',
      'Overview Rating',
      'Met Expectations',
      'Value for Money',
      'Would Recommend',
      'Tour Highlight',
      'Improvement Suggestions',
      'Client Name',
      'Client Email',
      'Nationality'
    ];
    
    // Create CSV rows
    const rows = allFeedback.map(feedback => [
      feedback.id,
      feedback.tour_id,
      feedback.client_id,
      feedback.submitted_at,
      feedback.tour_section_completed,
      feedback.accommodation_rating,
      feedback.information_rating,
      feedback.quality_equipment_rating,
      feedback.truck_comfort_rating,
      feedback.food_quantity_rating,
      feedback.food_quality_rating,
      feedback.driving_rating,
      feedback.guiding_rating,
      feedback.organisation_rating,
      feedback.overview_rating,
      feedback.met_expectations,
      feedback.value_for_money,
      feedback.would_recommend,
      feedback.tour_highlight?.replace(/"/g, '""'),
      feedback.improvement_suggestions?.replace(/"/g, '""'),
      feedback.client_name,
      feedback.client_email,
      feedback.nationality
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => 
        typeof field === 'string' && field.includes(',') 
          ? `"${field}"` 
          : field
      ).join(','))
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
};
