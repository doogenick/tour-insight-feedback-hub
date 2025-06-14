
export interface ComprehensiveFeedback {
  id?: string;
  status?: string;
  submitted_at?: string;
  tour_id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  nationality?: string;
  cellphone?: string;
  tour_section_completed: string;

  // Ratings
  accommodation_rating: number;
  information_rating: number;
  quality_equipment_rating: number;
  truck_comfort_rating: number;
  food_quantity_rating: number;
  food_quality_rating: number;
  driving_rating: number;
  guiding_rating: number;
  organisation_rating: number;
  guide_individual_rating: number;
  driver_individual_rating: number;
  pace_rating: number;
  route_rating: number;
  activity_level_rating: number;
  price_rating: number;
  value_rating: number;
  overview_rating: number;
  guide_professionalism: number;
  guide_organisation: number;
  guide_people_skills: number;
  guide_enthusiasm: number;
  guide_information: number;
  driver_professionalism: number;
  driver_organisation: number;
  driver_people_skills: number;
  driver_enthusiasm: number;
  driver_information: number;
  tour_leader_knowledge: number;
  safety_rating: number;

  // Satisfaction metrics
  met_expectations: boolean | null;
  value_for_money: boolean | null;
  truck_satisfaction: boolean | null;
  would_recommend: boolean | null;
  heard_about_source?: string;
  repeat_travel: boolean | null;

  // Comments for satisfaction/ratings
  expectations_comment?: string;
  value_for_money_comment?: string;
  truck_satisfaction_comment?: string;
  tour_leader_knowledge_comment?: string;
  safety_comment?: string;
  would_recommend_comment?: string;
  repeat_travel_comment?: string;

  // Free text
  tour_highlight?: string;
  improvement_suggestions?: string;
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
