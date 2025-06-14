
export type CrewRole = 'guide' | 'driver' | 'assistant';

export interface CrewMember {
  crew_id: string;
  full_name: string;
  role: CrewRole;
  email?: string;
  phone?: string;
  passport_number?: string;
  visa_status?: string;
  emergency_contact?: string;
  active: boolean;
  created_at: string;
}
