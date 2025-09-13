import { supabase } from "@/integrations/supabase/client";

interface DuplicateEntry {
  id: string;
  submitted_at: string;
  overall_rating: number;
}

interface DuplicateGroup {
  key: string;
  tour: {
    tour_code: string;
    tour_name: string;
  };
  client_name: string;
  client_email: string;
  count: number;
  entries: DuplicateEntry[];
}

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
  feedback_gathering_status?: 'inactive' | 'active' | 'completed';
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

    // Ensure feedback_gathering_status is set if not provided and add version tracking
    const tourDataWithStatus = {
      ...tourData,
      feedback_gathering_status: tourData.feedback_gathering_status || 'inactive',
      app_version: '1.0.6',
      created_by_client: 'nomad-feedback-mobile'
    };

    const { data, error } = await supabase
      .from('tours')
      .insert(tourDataWithStatus)
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

  async startFeedbackGathering(tourId: string) {
    const { data, error } = await supabase
      .from('tours')
      .update({ feedback_gathering_status: 'active' })
      .eq('id', tourId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async endFeedbackGathering(tourId: string) {
    const { data, error } = await supabase
      .from('tours')
      .update({ feedback_gathering_status: 'completed' })
      .eq('id', tourId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getToursByFeedbackStatus(status: 'inactive' | 'active' | 'completed') {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        guide:crew_members!tours_guide_id_fkey(full_name),
        driver:crew_members!tours_driver_id_fkey(full_name)
      `)
      .eq('feedback_gathering_status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async deleteTour(tourId: string) {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', tourId);
    
    if (error) throw error;
    return { success: true };
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
  async checkForDuplicateFeedback(tourId: string, clientName: string, clientEmail: string) {
    // Check if feedback already exists for this client and tour
    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .select('id, client_name, client_email, submitted_at')
      .eq('tour_id', tourId)
      .eq('client_name', clientName)
      .eq('client_email', clientEmail)
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  async submitFeedback(feedbackData: ComprehensiveFeedbackData) {
    // Check for duplicates before submitting
    if (feedbackData.tour_id && feedbackData.client_name && feedbackData.client_email) {
      const existingFeedback = await this.checkForDuplicateFeedback(
        feedbackData.tour_id,
        feedbackData.client_name,
        feedbackData.client_email
      );
      
      if (existingFeedback) {
        throw new Error(`Feedback already submitted by ${feedbackData.client_name} (${feedbackData.client_email}) for this tour. Previous submission was on ${new Date(existingFeedback.submitted_at).toLocaleDateString()}.`);
      }
    }

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
      // Add version tracking
      app_version: '1.0.6',
      submitted_by_client: 'nomad-feedback-mobile'
    };

    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .insert(mappedData)
      .select()
      .single();
    
    if (error) {
      // Check if it's a duplicate constraint violation
      if (error.code === '23505' && error.constraint === 'unique_client_feedback_per_tour') {
        throw new Error(`Feedback already submitted by ${feedbackData.client_name} (${feedbackData.client_email}) for this tour.`);
      }
      throw error;
    }
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
  },

  async findDuplicateFeedback() {
    // Find all feedback entries grouped by tour_id, client_name, and client_email
    const { data, error } = await supabase
      .from('comprehensive_feedback')
      .select(`
        id,
        tour_id,
        client_name,
        client_email,
        submitted_at,
        overall_rating,
        tour:tours(tour_code, tour_name)
      `)
      .order('tour_id, client_name, client_email, submitted_at');
    
    if (error) throw error;
    
    // Group by tour_id, client_name, client_email to find duplicates
    const grouped = data.reduce((acc, item) => {
      const key = `${item.tour_id}-${item.client_name}-${item.client_email}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Find groups with more than one entry (duplicates)
    const duplicates = Object.entries(grouped)
      .filter(([key, entries]) => entries.length > 1)
      .map(([key, entries]) => ({
        key,
        tour: entries[0].tour,
        client_name: entries[0].client_name,
        client_email: entries[0].client_email,
        count: entries.length,
        entries: entries.map(entry => ({
          id: entry.id,
          submitted_at: entry.submitted_at,
          overall_rating: entry.overall_rating
        }))
      }));
    
    return {
      total_feedback: data.length,
      unique_clients: Object.keys(grouped).length,
      duplicate_groups: duplicates.length,
      duplicates: duplicates
    };
  },

  async deleteFeedback(feedbackId: string) {
    const { error } = await supabase
      .from('comprehensive_feedback')
      .delete()
      .eq('id', feedbackId);
    
    if (error) throw error;
    return { success: true };
  },

  async deleteDuplicateFeedback(duplicateGroup: DuplicateGroup, keepLatest: boolean = true) {
    // Sort entries by submission date (newest first)
    const sortedEntries = [...duplicateGroup.entries].sort((a, b) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
    
    // Keep the first entry (newest if keepLatest=true, oldest if false)
    const keepEntry = keepLatest ? sortedEntries[0] : sortedEntries[sortedEntries.length - 1];
    const deleteEntries = keepLatest ? sortedEntries.slice(1) : sortedEntries.slice(0, -1);
    
    // Delete the duplicate entries
    const deletePromises = deleteEntries.map(entry => this.deleteFeedback(entry.id));
    
    try {
      await Promise.all(deletePromises);
      return {
        success: true,
        kept: keepEntry,
        deleted: deleteEntries.length
      };
    } catch (error) {
      throw new Error(`Failed to delete duplicates: ${error}`);
    }
  }
};