import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';

/**
 * Utility functions for handling feedback data display and mapping
 */

export const getDisplayValue = (value: any, fallback: string = 'Not provided'): string => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return String(value);
};

export const getRatingValue = (feedback: any, field: string): number | null => {
  const value = feedback[field];
  return (value && value > 0) ? value : null;
};

export const getBooleanValue = (feedback: any, field: string): boolean | null => {
  const value = feedback[field];
  return (value !== null && value !== undefined) ? Boolean(value) : null;
};

export const getTextValue = (feedback: any, field: string): string | null => {
  const value = feedback[field];
  return (value && value.trim()) ? value.trim() : null;
};

/**
 * Get the primary rating value, checking multiple possible field names
 */
export const getPrimaryRating = (feedback: any): number => {
  return feedback.overall_rating || feedback.overview_rating || 0;
};

/**
 * Get client phone number, checking multiple possible field names
 */
export const getClientPhone = (feedback: any): string => {
  return feedback.client_phone || feedback.cellphone || 'Not provided';
};

/**
 * Get client nationality, checking multiple possible field names
 */
export const getClientNationality = (feedback: any): string => {
  return feedback.client_nationality || feedback.nationality || 'Not provided';
};

/**
 * Get tour highlights, checking multiple possible field names
 */
export const getTourHighlights = (feedback: any): string | null => {
  return getTextValue(feedback, 'highlights') || getTextValue(feedback, 'tour_highlight');
};

/**
 * Get improvement suggestions, checking multiple possible field names
 */
export const getImprovementSuggestions = (feedback: any): string | null => {
  return getTextValue(feedback, 'improvements') || getTextValue(feedback, 'improvement_suggestions');
};

/**
 * Get expectations met value, checking multiple possible field names
 */
export const getExpectationsMet = (feedback: any): boolean | null => {
  return getBooleanValue(feedback, 'tour_expectations_met') || getBooleanValue(feedback, 'met_expectations');
};

/**
 * Get likely to return value, checking multiple possible field names
 */
export const getLikelyToReturn = (feedback: any): boolean | null => {
  return getBooleanValue(feedback, 'likely_to_return') || getBooleanValue(feedback, 'repeat_travel');
};

/**
 * Get guide rating, checking multiple possible field names
 */
export const getGuideRating = (feedback: any): number | null => {
  return getRatingValue(feedback, 'guide_rating') || getRatingValue(feedback, 'guiding_rating');
};

/**
 * Get driver rating, checking multiple possible field names
 */
export const getDriverRating = (feedback: any): number | null => {
  return getRatingValue(feedback, 'driver_rating') || getRatingValue(feedback, 'driving_rating');
};

/**
 * Get food rating, checking multiple possible field names
 */
export const getFoodRating = (feedback: any): number | null => {
  return getRatingValue(feedback, 'food_rating') || getRatingValue(feedback, 'food_quality_rating');
};

/**
 * Get vehicle rating, checking multiple possible field names
 */
export const getVehicleRating = (feedback: any): number | null => {
  return getRatingValue(feedback, 'vehicle_rating') || getRatingValue(feedback, 'truck_comfort_rating');
};

/**
 * Format rating for display (e.g., "4.5/7")
 */
export const formatRating = (rating: number | null, maxRating: number = 7): string => {
  if (!rating || rating <= 0) return 'N/A';
  return `${rating}/${maxRating}`;
};

/**
 * Get rating description based on 1-7 scale
 */
export const getRatingDescription = (rating: number): string => {
  if (rating <= 1.5) return 'Perfect';
  if (rating <= 2.5) return 'Excellent'; 
  if (rating <= 3.5) return 'Good';
  if (rating <= 4.5) return 'Average';
  if (rating <= 5.5) return 'Below Average';
  if (rating <= 6.5) return 'Poor';
  return 'Very Poor';
};

/**
 * Get rating color class based on 1-7 scale
 */
export const getRatingColor = (rating: number): string => {
  if (rating <= 1.5) return 'bg-emerald-500';
  if (rating <= 2.5) return 'bg-green-500';
  if (rating <= 3.5) return 'bg-lime-500';
  if (rating <= 4.5) return 'bg-yellow-500';
  if (rating <= 5.5) return 'bg-orange-500';
  if (rating <= 6.5) return 'bg-red-500';
  return 'bg-rose-600';
};
