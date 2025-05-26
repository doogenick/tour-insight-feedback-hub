// Define types for our data models
export interface Tour {
  tour_id: string;
  tour_name: string;
  date_start: string;
  date_end: string;
  passenger_count: number;
  guide_name: string;
  driver_name: string;
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
