import { supabase } from "@/integrations/supabase/client";

interface TourData {
  tour_code: string;
  tour_name: string;
  date_start?: string;
  date_end?: string;
  passenger_count?: number;
  guide_id?: string;
  driver_id?: string;
  truck_name?: string;
  tour_leader?: string;
  tour_type?: 'camping' | 'camping_accommodated' | 'accommodated';
  vehicle_name?: string;
  status?: 'planned' | 'active' | 'completed' | 'cancelled';
}

interface CrewMemberData {
  full_name: string;
  role: 'guide' | 'driver' | 'assistant';
  email?: string;
  phone?: string;
  passport_number?: string;
  visa_status?: string;
  emergency_contact?: string;
  active?: boolean;
}

interface FeedbackData {
  tour_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_nationality?: string;
  overall_rating: number;
  guide_rating?: number;
  driver_rating?: number;
  vehicle_rating?: number;
  accommodation_rating?: number;
  food_rating?: number;
  value_rating?: number;
  highlights?: string;
  improvements?: string;
  additional_comments?: string;
  would_recommend?: boolean;
  likely_to_return?: boolean;
  tour_expectations_met?: boolean;
}

// Tour Services
export const tourSupabaseService = {
  async getAllTours() {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        guide:crew_members!tours_guide_id_fkey(full_name),
        driver:crew_members!tours_driver_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createTour(tourData: TourData) {
    const { data, error } = await supabase
      .from('tours')
      .insert(tourData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTour(id: string, updates: Partial<TourData>) {
    const { data, error } = await supabase
      .from('tours')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTour(id: string) {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getTourByCode(tourCode: string) {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        guide:crew_members!tours_guide_id_fkey(full_name),
        driver:crew_members!tours_driver_id_fkey(full_name)
      `)
      .eq('tour_code', tourCode)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Crew Services
export const crewSupabaseService = {
  async getAllCrew() {
    const { data, error } = await supabase
      .from('crew_members')
      .select('*')
      .eq('active', true)
      .order('full_name');
    
    if (error) throw error;
    return data;
  },

  async createCrewMember(crewData: CrewMemberData) {
    const { data, error } = await supabase
      .from('crew_members')
      .insert(crewData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCrewMember(id: string, updates: Partial<CrewMemberData>) {
    const { data, error } = await supabase
      .from('crew_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCrewMember(id: string) {
    const { error } = await supabase
      .from('crew_members')
      .update({ active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Feedback Services
export const feedbackSupabaseService = {
  async submitFeedback(feedbackData: FeedbackData) {
    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .insert(feedbackData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFeedbackByTour(tourId: string) {
    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .select('*')
      .eq('tour_id', tourId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAllFeedback() {
    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .select(`
        *,
        tour:tours(tour_code, tour_name, guide_id, driver_id)
      `)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFeedbackStats() {
    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .select('overall_rating, tour_id, submitted_at');
    
    if (error) throw error;
    
    const totalFeedback = data.length;
    const averageRating = data.reduce((sum, feedback) => sum + feedback.overall_rating, 0) / totalFeedback;
    const uniqueTours = new Set(data.map(f => f.tour_id)).size;
    
    return {
      totalFeedback,
      averageRating: Number(averageRating.toFixed(1)),
      uniqueTours,
      data
    };
  }
};