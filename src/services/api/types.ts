// Define types for our data models
export interface Tour {
  tour_id: string;
  tour_name: string;
  date_start: string;
  date_end: string;
  passenger_count: number;
  guide_name: string;
  driver_name: string;
  truck_name?: string;
  tour_code?: string;
  tour_leader?: string;
}

export interface Client {
  client_id: string;
  tour_id: string;
  full_name: string;
  email?: string;
  willing_to_review_google?: boolean;
  willing_to_review_tripadvisor?: boolean;
  has_reviewed_google?: boolean;
  has_reviewed_tripadvisor?: boolean;
  review_reminder_sent_google?: string;
  review_reminder_sent_tripadvisor?: string;
  created_at?: string;
}

// Enhanced comprehensive feedback interface with all form fields
export interface ComprehensiveFeedback {
  id: string;
  tour_id: string;
  client_id: string;
  
  // Tour section completed
  tour_section_completed: 'cape_town_vic_falls' | 'cape_town_windhoek' | 'cape_town_swakopmund_vic_falls' | 'windhoek_vic_falls' | '';
  
  // Main ratings (1-7 scale)
  accommodation_rating: number;
  accommodation_comments?: string;
  information_rating: number;
  information_comments?: string;
  quality_equipment_rating: number;
  quality_equipment_comments?: string;
  truck_comfort_rating: number;
  truck_comfort_comments?: string;
  food_quantity_rating: number;
  food_quantity_comments?: string;
  food_quality_rating: number;
  food_quality_comments?: string;
  driving_rating: number;
  driving_comments?: string;
  guiding_rating: number;
  guiding_comments?: string;
  organisation_rating: number;
  organisation_comments?: string;
  
  // Individual crew ratings
  guide_individual_rating: number;
  guide_individual_comments?: string;
  driver_individual_rating: number;
  driver_individual_comments?: string;
  third_crew_rating?: number;
  third_crew_comments?: string;
  
  // Tour experience ratings
  pace_rating: number;
  pace_comments?: string;
  route_rating: number;
  route_comments?: string;
  activity_level_rating: number;
  activity_level_comments?: string;
  price_rating: number;
  price_comments?: string;
  value_rating: number;
  value_comments?: string;
  overview_rating: number;
  overview_comments?: string;
  
  // Crew detailed ratings (professionalism, organisation, people skills, enthusiasm, information)
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
  
  // Additional feedback
  additional_comments?: string;
  
  // Page 2 - General Questions
  met_expectations: boolean | null;
  expectations_comment?: string;
  
  // Value and satisfaction questions
  value_for_money: boolean | null;
  value_for_money_comment?: string;
  truck_satisfaction: boolean | null;
  truck_satisfaction_comment?: string;
  tour_leader_knowledge: number; // 1-7 rating
  tour_leader_knowledge_comment?: string;
  safety_rating: number; // 1-7 rating
  safety_comment?: string;
  would_recommend: boolean | null;
  would_recommend_comment?: string;
  
  // How they heard about us
  heard_about_source: 'word_of_mouth' | 'internet' | 'travel_agent' | 'brochure' | 'repeat_client' | 'other' | '';
  heard_about_other?: string;
  
  // Repeat travel intentions
  repeat_travel: boolean | null;
  repeat_travel_comment?: string;
  
  // Open-ended feedback
  tour_highlight?: string;
  improvement_suggestions?: string;
  
  // Personal details (optional)
  client_name?: string;
  client_email?: string;
  email?: string; // Added for compatibility
  nationality?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | '';
  
  // Contact preferences
  willing_to_review_google?: boolean;
  willing_to_review_tripadvisor?: boolean;
  newsletter_signup?: boolean;
  
  // Signatures and completion
  client_signature?: string;
  client_signature_date?: string;
  crew_signature?: string;
  
  submitted_at?: string;
  status: 'Pending' | 'Synced';
}

// Keep original Feedback interface for backward compatibility
export interface Feedback {
  id: string;
  tour_id: string;
  client_id: string;
  guide_name: string;
  driver_name: string;
  rating_overall: number;
  rating_guide: number;
  rating_driver: number;
  rating_food?: number;
  rating_equipment?: number;
  comments?: string;
  submitted_at?: string;
  status: 'Pending' | 'Synced';
}

export interface CrewMember {
  crew_id: string;
  full_name: string;
  role: 'guide' | 'driver' | 'assistant';
  email?: string;
  phone?: string;
  passport_number?: string;
  visa_status?: string;
  emergency_contact?: string;
  active: boolean;
  created_at: string;
}

export interface TourCrewAssignment {
  assignment_id: string;
  tour_id: string;
  crew_id: string;
  role: 'guide' | 'driver' | 'assistant';
  assigned_at: string;
}

export interface Incident {
  incident_id: string;
  tour_id: string;
  reported_by_crew_id: string;
  incident_type: 'medical' | 'vehicle' | 'weather' | 'theft' | 'accident' | 'other';
  date: string;
  time: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface ClientImport {
  import_id: string;
  tour_id: string;
  file_name?: string;
  import_type: 'manual' | 'csv' | 'excel' | 'rooming_list';
  clients_count: number;
  imported_at: string;
  imported_by: string;
}
