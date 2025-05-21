
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
