
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
