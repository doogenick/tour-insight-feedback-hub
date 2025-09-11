
export interface ComprehensiveFeedback {
  id?: string;
  status?: string;
  submitted_at?: string;
  created_at?: string;
  tour_id: string;
  client_id?: string;
  client_name: string;
  client_email?: string;
  client_nationality?: string;
  nationality?: string; // Keep both for backward compatibility
  cellphone?: string;
  client_phone?: string; // Keep both for backward compatibility
  client_initials?: string;
  tour_section_completed?: string;

  // Ratings - match Supabase schema exactly
  accommodation_rating?: number;
  information_rating?: number;
  quality_equipment_rating?: number;
  truck_comfort_rating?: number;
  food_quantity_rating?: number;
  food_quality_rating?: number;
  food_rating?: number; // Additional field in Supabase
  driving_rating?: number;
  guiding_rating?: number;
  organisation_rating?: number;
  guide_individual_rating?: number;
  driver_individual_rating?: number;
  pace_rating?: number;
  route_rating?: number;
  activity_level_rating?: number;
  price_rating?: number;
  value_rating?: number;
  overview_rating?: number;
  overall_rating: number; // Required field in Supabase
  guide_professionalism?: number;
  guide_organisation?: number;
  guide_people_skills?: number;
  guide_enthusiasm?: number;
  guide_information?: number;
  guide_rating?: number; // Additional field in Supabase
  driver_professionalism?: number;
  driver_organisation?: number;
  driver_people_skills?: number;
  driver_enthusiasm?: number;
  driver_information?: number;
  driver_rating?: number; // Additional field in Supabase
  tour_leader_knowledge?: number;
  safety_rating?: number;
  vehicle_rating?: number; // Additional field in Supabase

  // Satisfaction metrics - match Supabase schema
  met_expectations?: boolean | null;
  tour_expectations_met?: boolean | null; // Additional field in Supabase
  value_for_money?: boolean | null;
  truck_satisfaction?: boolean | null;
  would_recommend?: boolean | null;
  likely_to_return?: boolean | null; // Additional field in Supabase
  heard_about_source?: string;
  repeat_travel?: boolean | null;

  // Comments for satisfaction/ratings
  expectations_comment?: string;
  value_for_money_comment?: string;
  truck_satisfaction_comment?: string;
  tour_leader_knowledge_comment?: string;
  safety_comment?: string;
  would_recommend_comment?: string;
  repeat_travel_comment?: string;

  // Free text - match Supabase field names
  tour_highlight?: string;
  highlights?: string; // Additional field in Supabase
  improvement_suggestions?: string;
  improvements?: string; // Additional field in Supabase
  additional_comments?: string;

  // "How did you hear about us"
  heard_about_other?: string;

  // Personal details
  age?: string;
  gender?: string;
  newsletter_signup?: boolean;

  // Review preference
  willing_to_review_google?: boolean;
  willing_to_review_tripadvisor?: boolean;

  // Signature, etc.
  client_signature?: string;
  client_signature_date?: string;
  crew_signature?: string;
  signature_data_url?: string;
}
