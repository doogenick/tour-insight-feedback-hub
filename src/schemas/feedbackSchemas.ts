import { z } from 'zod';

/**
 * Zod schemas for runtime validation of feedback data
 */

// Rating schema (1-7 scale)
export const ratingSchema = z.number().min(1).max(7).optional();

// Boolean schema for satisfaction metrics
export const booleanSchema = z.boolean().nullable().optional();

// Text schema for comments and feedback
export const textSchema = z.string().min(1).optional();

// Email schema
export const emailSchema = z.string().email().optional();

// Phone schema (basic validation)
export const phoneSchema = z.string().min(1).optional();

// Comprehensive feedback schema
export const comprehensiveFeedbackSchema = z.object({
  // Basic info
  id: z.string().optional(),
  status: z.string().optional(),
  submitted_at: z.string().optional(),
  created_at: z.string().optional(),
  tour_id: z.string().min(1),
  client_id: z.string().optional(),
  client_name: z.string().min(1),
  client_email: emailSchema,
  client_nationality: z.string().optional(),
  nationality: z.string().optional(), // Backward compatibility
  cellphone: phoneSchema,
  client_phone: phoneSchema, // Backward compatibility
  client_initials: z.string().optional(),
  tour_section_completed: z.string().optional(),

  // Ratings (1-7 scale)
  accommodation_rating: ratingSchema,
  information_rating: ratingSchema,
  quality_equipment_rating: ratingSchema,
  truck_comfort_rating: ratingSchema,
  food_quantity_rating: ratingSchema,
  food_quality_rating: ratingSchema,
  food_rating: ratingSchema,
  driving_rating: ratingSchema,
  guiding_rating: ratingSchema,
  guide_rating: ratingSchema,
  driver_rating: ratingSchema,
  organisation_rating: ratingSchema,
  guide_individual_rating: ratingSchema,
  driver_individual_rating: ratingSchema,
  pace_rating: ratingSchema,
  route_rating: ratingSchema,
  activity_level_rating: ratingSchema,
  price_rating: ratingSchema,
  value_rating: ratingSchema,
  overview_rating: ratingSchema,
  overall_rating: z.number().min(1).max(7), // Required field
  vehicle_rating: ratingSchema,
  safety_rating: ratingSchema,

  // Guide ratings
  guide_professionalism: ratingSchema,
  guide_organisation: ratingSchema,
  guide_people_skills: ratingSchema,
  guide_enthusiasm: ratingSchema,
  guide_information: ratingSchema,

  // Driver ratings
  driver_professionalism: ratingSchema,
  driver_organisation: ratingSchema,
  driver_people_skills: ratingSchema,
  driver_enthusiasm: ratingSchema,
  driver_information: ratingSchema,

  // Tour leader
  tour_leader_knowledge: ratingSchema,

  // Satisfaction metrics
  met_expectations: booleanSchema,
  tour_expectations_met: booleanSchema,
  value_for_money: booleanSchema,
  truck_satisfaction: booleanSchema,
  would_recommend: booleanSchema,
  likely_to_return: booleanSchema,
  repeat_travel: booleanSchema,

  // Comments
  expectations_comment: textSchema,
  value_for_money_comment: textSchema,
  truck_satisfaction_comment: textSchema,
  tour_leader_knowledge_comment: textSchema,
  safety_comment: textSchema,
  would_recommend_comment: textSchema,
  repeat_travel_comment: textSchema,

  // Free text
  tour_highlight: textSchema,
  highlights: textSchema,
  improvement_suggestions: textSchema,
  improvements: textSchema,
  additional_comments: textSchema,

  // Marketing
  heard_about_source: z.string().optional(),
  heard_about_other: textSchema,

  // Personal details
  age: z.string().optional(),
  gender: z.string().optional(),
  newsletter_signup: booleanSchema,

  // Review preferences
  willing_to_review_google: booleanSchema,
  willing_to_review_tripadvisor: booleanSchema,

  // Signatures
  client_signature: z.string().optional(),
  client_signature_date: z.string().optional(),
  crew_signature: z.string().optional(),
  signature_data_url: z.string().optional(),
});

// Tour schema
export const tourSchema = z.object({
  id: z.string().optional(),
  tour_code: z.string().min(1),
  tour_name: z.string().min(1),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
  passenger_count: z.number().min(0).optional(),
  guide_id: z.string().optional(),
  driver_id: z.string().optional(),
  truck_name: z.string().optional(),
  tour_leader: z.string().optional(),
  tour_type: z.enum(['camping', 'camping_accommodated', 'accommodated']).optional(),
  vehicle_name: z.string().optional(),
  crew_count: z.number().min(0).optional(),
  vehicle_type: z.string().optional(),
  status: z.enum(['planned', 'active', 'completed', 'cancelled']).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Client schema
export const clientSchema = z.object({
  client_id: z.string().min(1),
  full_name: z.string().min(1),
  email: emailSchema,
  tour_id: z.string().min(1),
});

// Validation functions
export const validateComprehensiveFeedback = (data: any) => {
  try {
    return {
      success: true,
      data: comprehensiveFeedbackSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Unknown validation error' }]
    };
  }
};

export const validateTour = (data: any) => {
  try {
    return {
      success: true,
      data: tourSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Unknown validation error' }]
    };
  }
};

export const validateClient = (data: any) => {
  try {
    return {
      success: true,
      data: clientSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Unknown validation error' }]
    };
  }
};

// Type exports
export type ComprehensiveFeedbackInput = z.infer<typeof comprehensiveFeedbackSchema>;
export type TourInput = z.infer<typeof tourSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
