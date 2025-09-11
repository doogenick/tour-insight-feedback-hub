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
  crew_count?: number;
  vehicle_type?: string;
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

interface ComprehensiveFeedbackData {
  tour_id: string;
  client_id?: string;
  client_name: string;
  client_email?: string;
  nationality?: string;
  cellphone?: string;
  client_initials?: string;
  tour_section_completed: string;
  
  // All the rating fields from ComprehensiveFeedback
  accommodation_rating: number;
  information_rating: number;
  quality_equipment_rating: number;
  truck_comfort_rating: number;
  food_quantity_rating: number;
  food_quality_rating: number;
  driving_rating: number;
  guiding_rating: number;
  organisation_rating: number;
  guide_individual_rating: number;
  driver_individual_rating: number;
  pace_rating: number;
  route_rating: number;
  activity_level_rating: number;
  price_rating: number;
  value_rating: number;
  overview_rating: number;
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
  tour_leader_knowledge: number;
  safety_rating: number;

  // Satisfaction metrics
  met_expectations?: boolean;
  value_for_money?: boolean;
  truck_satisfaction?: boolean;
  would_recommend?: boolean;
  heard_about_source?: string;
  repeat_travel?: boolean;

  // Comments
  expectations_comment?: string;
  value_for_money_comment?: string;
  truck_satisfaction_comment?: string;
  tour_leader_knowledge_comment?: string;
  safety_comment?: string;
  would_recommend_comment?: string;
  repeat_travel_comment?: string;
  tour_highlight?: string;
  improvement_suggestions?: string;
  additional_comments?: string;
  heard_about_other?: string;

  // Personal details
  age?: string;
  gender?: string;
  newsletter_signup?: boolean;

  // Review preferences
  willing_to_review_google?: boolean;
  willing_to_review_tripadvisor?: boolean;

  // Signatures
  client_signature?: string;
  client_signature_date?: string;
  crew_signature?: string;
  signature_data_url?: string;

  // Status
  status?: string;
  submitted_at?: string;
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
    // Check if tour code already exists
    const { data: existingTour } = await supabase
      .from('tours')
      .select('id')
      .eq('tour_code', tourData.tour_code)
      .single();
    
    if (existingTour) {
      throw new Error('A tour with this tour code already exists. Please use a different tour code.');
    }

    const { data, error } = await supabase
      .from('tours')
      .insert(tourData)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505' && error.message.includes('tours_tour_code_key')) {
        throw new Error('A tour with this tour code already exists. Please use a different tour code.');
      }
      throw error;
    }
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
  async submitFeedback(feedbackData: ComprehensiveFeedbackData) {
    // Map the data to ensure required fields exist and provide defaults
    const mappedData = {
      ...feedbackData,
      // Ensure we have the overall_rating field that Supabase expects
      overall_rating: feedbackData.overview_rating || 3,
      // Map other fields that might have different names
      client_phone: feedbackData.cellphone || null,
      client_nationality: feedbackData.nationality || null,
      status: feedbackData.status || 'submitted',
      submitted_at: feedbackData.submitted_at || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .insert(mappedData)
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
        tour:tours(tour_code, tour_name, guide_id, driver_id, guide:crew_members!tours_guide_id_fkey(full_name), driver:crew_members!tours_driver_id_fkey(full_name))
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
    
    if (!data || data.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        uniqueTours: 0,
        data: []
      };
    }
    
    const totalFeedback = data.length;
    const averageRating = data.reduce((sum, feedback) => sum + (feedback.overall_rating || 0), 0) / totalFeedback;
    const uniqueTours = new Set(data.map(f => f.tour_id)).size;
    
    return {
      totalFeedback,
      averageRating: Number(averageRating.toFixed(1)),
      uniqueTours,
      data
    };
  }
};