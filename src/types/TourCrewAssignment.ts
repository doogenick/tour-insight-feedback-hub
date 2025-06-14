
export interface TourCrewAssignment {
  assignment_id: string;
  tour_id: string;
  crew_id: string;
  role: 'guide' | 'driver' | 'assistant';
  assigned_at: string;
}
