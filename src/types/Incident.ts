
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
}
