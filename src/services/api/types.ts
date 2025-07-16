export * from "../../types/ComprehensiveFeedback";
export * from "../../types/Tour";
export * from "../../types/Client";
export * from "../../types/Feedback";
export * from "../../types/CrewMember";
export * from "../../types/TourCrewAssignment";
export * from "../../types/Incident";

// Legacy API compatibility - deprecated, use types from /types folder instead
export interface LegacyTour {
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