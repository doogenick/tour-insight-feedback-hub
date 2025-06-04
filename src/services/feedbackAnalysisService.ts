
import { Feedback, ComprehensiveFeedback, Tour } from './api/types';
import { comprehensiveFeedbackService } from './comprehensiveFeedbackService';

export interface FeedbackAnalysisByTour {
  tourId: string;
  tourName: string;
  totalResponses: number;
  averageRatings: {
    overall: number;
    guide: number;
    driver: number;
    food?: number;
    equipment?: number;
  };
  comments: {
    positive: string[];
    negative: string[];
    neutral: string[];
    highlights: string[];
    improvements: string[];
  };
  clientSatisfaction: {
    metExpectations: { yes: number; no: number; percentage: number };
    wouldRecommend: { yes: number; no: number; percentage: number };
  };
}

export const feedbackAnalysisService = {
  // Get all feedback comments organized by tour
  async getCommentsByTour(tourId?: string): Promise<FeedbackAnalysisByTour[]> {
    const analyses: FeedbackAnalysisByTour[] = [];
    
    // Get tours data
    const tours = JSON.parse(localStorage.getItem('tours') || '[]') as Tour[];
    const toursToAnalyze = tourId ? tours.filter(t => t.tour_id === tourId) : tours;
    
    for (const tour of toursToAnalyze) {
      const analysis = await this.analyzeTourFeedback(tour);
      analyses.push(analysis);
    }
    
    return analyses;
  },

  // Analyze feedback for a specific tour
  async analyzeTourFeedback(tour: Tour): Promise<FeedbackAnalysisByTour> {
    // Get simple feedback
    const simpleFeedback = JSON.parse(localStorage.getItem('feedback') || '[]') as Feedback[];
    const tourSimpleFeedback = simpleFeedback.filter(f => f.tour_id === tour.tour_id);
    
    // Get comprehensive feedback
    const comprehensiveFeedback = await comprehensiveFeedbackService.getFeedbackByTour(tour.tour_id);
    
    const totalResponses = tourSimpleFeedback.length + comprehensiveFeedback.length;
    
    // Calculate average ratings
    const allOverallRatings = [
      ...tourSimpleFeedback.map(f => f.rating_overall),
      ...comprehensiveFeedback.map(f => f.overview_rating)
    ].filter(r => typeof r === 'number');
    
    const allGuideRatings = [
      ...tourSimpleFeedback.map(f => f.rating_guide),
      ...comprehensiveFeedback.map(f => f.guide_individual_rating)
    ].filter(r => typeof r === 'number');
    
    const allDriverRatings = [
      ...tourSimpleFeedback.map(f => f.rating_driver),
      ...comprehensiveFeedback.map(f => f.driver_individual_rating)
    ].filter(r => typeof r === 'number');
    
    // Collect all comments
    const allComments = [
      ...tourSimpleFeedback.map(f => f.comments).filter(c => c && c.trim()),
      ...comprehensiveFeedback.map(f => f.additional_comments).filter(c => c && c.trim())
    ] as string[];
    
    const highlights = comprehensiveFeedback
      .map(f => f.tour_highlight)
      .filter(h => h && h.trim()) as string[];
    
    const improvements = comprehensiveFeedback
      .map(f => f.improvement_suggestions)
      .filter(i => i && i.trim()) as string[];
    
    // Categorize comments (simple sentiment analysis)
    const categorizedComments = this.categorizeComments(allComments);
    
    // Calculate satisfaction metrics
    const metExpectations = this.calculateBooleanMetric(
      comprehensiveFeedback.map(f => f.met_expectations)
    );
    
    const wouldRecommend = this.calculateBooleanMetric(
      comprehensiveFeedback.map(f => f.would_recommend)
    );
    
    return {
      tourId: tour.tour_id,
      tourName: tour.tour_name,
      totalResponses,
      averageRatings: {
        overall: this.calculateAverage(allOverallRatings),
        guide: this.calculateAverage(allGuideRatings),
        driver: this.calculateAverage(allDriverRatings),
        food: this.calculateAverage(tourSimpleFeedback.map(f => f.rating_food).filter(r => r)),
        equipment: this.calculateAverage(tourSimpleFeedback.map(f => f.rating_equipment).filter(r => r))
      },
      comments: {
        ...categorizedComments,
        highlights,
        improvements
      },
      clientSatisfaction: {
        metExpectations,
        wouldRecommend
      }
    };
  },

  // Simple sentiment analysis for comment categorization
  categorizeComments(comments: string[]): { positive: string[]; negative: string[]; neutral: string[] } {
    const positive: string[] = [];
    const negative: string[] = [];
    const neutral: string[] = [];
    
    const positiveWords = ['excellent', 'amazing', 'great', 'wonderful', 'fantastic', 'perfect', 'love', 'best', 'awesome', 'outstanding'];
    const negativeWords = ['terrible', 'awful', 'bad', 'worse', 'horrible', 'disappointing', 'poor', 'worst', 'hate', 'unacceptable'];
    
    for (const comment of comments) {
      const lowerComment = comment.toLowerCase();
      const hasPositive = positiveWords.some(word => lowerComment.includes(word));
      const hasNegative = negativeWords.some(word => lowerComment.includes(word));
      
      if (hasPositive && !hasNegative) {
        positive.push(comment);
      } else if (hasNegative && !hasPositive) {
        negative.push(comment);
      } else {
        neutral.push(comment);
      }
    }
    
    return { positive, negative, neutral };
  },

  // Export tour analysis to text format
  async exportTourAnalysis(tourId: string): Promise<Blob> {
    const analysis = await this.getCommentsByTour(tourId);
    const tourAnalysis = analysis[0];
    
    if (!tourAnalysis) {
      return new Blob(['No feedback data found for this tour.'], { type: 'text/plain' });
    }
    
    const report = `
TOUR FEEDBACK ANALYSIS REPORT
Tour: ${tourAnalysis.tourName} (${tourAnalysis.tourId})
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
========
Total Responses: ${tourAnalysis.totalResponses}
Average Overall Rating: ${tourAnalysis.averageRatings.overall.toFixed(2)}/7
Average Guide Rating: ${tourAnalysis.averageRatings.guide.toFixed(2)}/7
Average Driver Rating: ${tourAnalysis.averageRatings.driver.toFixed(2)}/7

CLIENT SATISFACTION
==================
Met Expectations: ${tourAnalysis.clientSatisfaction.metExpectations.percentage}% (${tourAnalysis.clientSatisfaction.metExpectations.yes} yes, ${tourAnalysis.clientSatisfaction.metExpectations.no} no)
Would Recommend: ${tourAnalysis.clientSatisfaction.wouldRecommend.percentage}% (${tourAnalysis.clientSatisfaction.wouldRecommend.yes} yes, ${tourAnalysis.clientSatisfaction.wouldRecommend.no} no)

TOUR HIGHLIGHTS
===============
${tourAnalysis.comments.highlights.map(h => `• ${h}`).join('\n')}

IMPROVEMENT SUGGESTIONS
======================
${tourAnalysis.comments.improvements.map(i => `• ${i}`).join('\n')}

POSITIVE FEEDBACK
================
${tourAnalysis.comments.positive.map(c => `• ${c}`).join('\n')}

AREAS FOR IMPROVEMENT
====================
${tourAnalysis.comments.negative.map(c => `• ${c}`).join('\n')}

NEUTRAL FEEDBACK
===============
${tourAnalysis.comments.neutral.map(c => `• ${c}`).join('\n')}
    `;
    
    return new Blob([report.trim()], { type: 'text/plain' });
  },

  // Helper functions
  calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  },

  calculateBooleanMetric(values: (boolean | null | undefined)[]): { yes: number; no: number; percentage: number } {
    const responses = values.filter(v => v === true || v === false);
    const yes = responses.filter(r => r === true).length;
    const no = responses.filter(r => r === false).length;
    const total = yes + no;
    
    return {
      yes,
      no,
      percentage: total > 0 ? Math.round((yes / total) * 100) : 0
    };
  }
};
