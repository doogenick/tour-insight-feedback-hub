
export interface Tour {
  tour_id: string;
  tour_name: string;
  tour_code?: string;
  date_start: string;
  date_end: string;
  passenger_count: number;
  guide_name: string;
  driver_name: string;
  truck_name?: string;
  tour_leader?: string;
  third_crew_name?: string;
  tour_type?: 'camping' | 'camping_accommodated' | 'accommodated';
  vehicle_name?: string;
  hotels?: Hotel[];
  properties?: Property[];
  status?: 'planned' | 'active' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  check_in_date: string;
  check_out_date: string;
  room_type?: string;
  supplier?: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  type: 'camp' | 'lodge' | 'hotel' | 'guesthouse';
  supplier: string;
  capacity: number;
  amenities?: string[];
}
