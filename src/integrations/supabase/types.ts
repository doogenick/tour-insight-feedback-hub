export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comprehensive_feedback: {
        Row: {
          accommodation_rating: number | null
          activity_level_rating: number | null
          additional_comments: string | null
          age: string | null
          cellphone: string | null
          client_email: string | null
          client_id: string | null
          client_initials: string | null
          client_name: string
          client_nationality: string | null
          client_phone: string | null
          client_signature: string | null
          client_signature_date: string | null
          created_at: string
          crew_signature: string | null
          driver_enthusiasm: number | null
          driver_individual_rating: number | null
          driver_information: number | null
          driver_organisation: number | null
          driver_people_skills: number | null
          driver_professionalism: number | null
          driver_rating: number | null
          driving_rating: number | null
          expectations_comment: string | null
          food_quality_rating: number | null
          food_quantity_rating: number | null
          food_rating: number | null
          gender: string | null
          guide_enthusiasm: number | null
          guide_individual_rating: number | null
          guide_information: number | null
          guide_organisation: number | null
          guide_people_skills: number | null
          guide_professionalism: number | null
          guide_rating: number | null
          guiding_rating: number | null
          heard_about_other: string | null
          heard_about_source: string | null
          highlights: string | null
          id: string
          improvement_suggestions: string | null
          improvements: string | null
          information_rating: number | null
          likely_to_return: boolean | null
          met_expectations: boolean | null
          nationality: string | null
          newsletter_signup: boolean | null
          organisation_rating: number | null
          overall_rating: number
          overview_rating: number | null
          pace_rating: number | null
          price_rating: number | null
          quality_equipment_rating: number | null
          repeat_travel: boolean | null
          repeat_travel_comment: string | null
          route_rating: number | null
          safety_comment: string | null
          safety_rating: number | null
          signature_data_url: string | null
          status: string | null
          submitted_at: string
          tour_expectations_met: boolean | null
          tour_highlight: string | null
          tour_id: string
          tour_leader_knowledge: number | null
          tour_leader_knowledge_comment: string | null
          tour_section_completed: string | null
          truck_comfort_rating: number | null
          truck_satisfaction: boolean | null
          truck_satisfaction_comment: string | null
          value_for_money: boolean | null
          value_for_money_comment: string | null
          value_rating: number | null
          vehicle_rating: number | null
          willing_to_review_google: boolean | null
          willing_to_review_tripadvisor: boolean | null
          would_recommend: boolean | null
          would_recommend_comment: string | null
        }
        Insert: {
          accommodation_rating?: number | null
          activity_level_rating?: number | null
          additional_comments?: string | null
          age?: string | null
          cellphone?: string | null
          client_email?: string | null
          client_id?: string | null
          client_initials?: string | null
          client_name: string
          client_nationality?: string | null
          client_phone?: string | null
          client_signature?: string | null
          client_signature_date?: string | null
          created_at?: string
          crew_signature?: string | null
          driver_enthusiasm?: number | null
          driver_individual_rating?: number | null
          driver_information?: number | null
          driver_organisation?: number | null
          driver_people_skills?: number | null
          driver_professionalism?: number | null
          driver_rating?: number | null
          driving_rating?: number | null
          expectations_comment?: string | null
          food_quality_rating?: number | null
          food_quantity_rating?: number | null
          food_rating?: number | null
          gender?: string | null
          guide_enthusiasm?: number | null
          guide_individual_rating?: number | null
          guide_information?: number | null
          guide_organisation?: number | null
          guide_people_skills?: number | null
          guide_professionalism?: number | null
          guide_rating?: number | null
          guiding_rating?: number | null
          heard_about_other?: string | null
          heard_about_source?: string | null
          highlights?: string | null
          id?: string
          improvement_suggestions?: string | null
          improvements?: string | null
          information_rating?: number | null
          likely_to_return?: boolean | null
          met_expectations?: boolean | null
          nationality?: string | null
          newsletter_signup?: boolean | null
          organisation_rating?: number | null
          overall_rating: number
          overview_rating?: number | null
          pace_rating?: number | null
          price_rating?: number | null
          quality_equipment_rating?: number | null
          repeat_travel?: boolean | null
          repeat_travel_comment?: string | null
          route_rating?: number | null
          safety_comment?: string | null
          safety_rating?: number | null
          signature_data_url?: string | null
          status?: string | null
          submitted_at?: string
          tour_expectations_met?: boolean | null
          tour_highlight?: string | null
          tour_id: string
          tour_leader_knowledge?: number | null
          tour_leader_knowledge_comment?: string | null
          tour_section_completed?: string | null
          truck_comfort_rating?: number | null
          truck_satisfaction?: boolean | null
          truck_satisfaction_comment?: string | null
          value_for_money?: boolean | null
          value_for_money_comment?: string | null
          value_rating?: number | null
          vehicle_rating?: number | null
          willing_to_review_google?: boolean | null
          willing_to_review_tripadvisor?: boolean | null
          would_recommend?: boolean | null
          would_recommend_comment?: string | null
        }
        Update: {
          accommodation_rating?: number | null
          activity_level_rating?: number | null
          additional_comments?: string | null
          age?: string | null
          cellphone?: string | null
          client_email?: string | null
          client_id?: string | null
          client_initials?: string | null
          client_name?: string
          client_nationality?: string | null
          client_phone?: string | null
          client_signature?: string | null
          client_signature_date?: string | null
          created_at?: string
          crew_signature?: string | null
          driver_enthusiasm?: number | null
          driver_individual_rating?: number | null
          driver_information?: number | null
          driver_organisation?: number | null
          driver_people_skills?: number | null
          driver_professionalism?: number | null
          driver_rating?: number | null
          driving_rating?: number | null
          expectations_comment?: string | null
          food_quality_rating?: number | null
          food_quantity_rating?: number | null
          food_rating?: number | null
          gender?: string | null
          guide_enthusiasm?: number | null
          guide_individual_rating?: number | null
          guide_information?: number | null
          guide_organisation?: number | null
          guide_people_skills?: number | null
          guide_professionalism?: number | null
          guide_rating?: number | null
          guiding_rating?: number | null
          heard_about_other?: string | null
          heard_about_source?: string | null
          highlights?: string | null
          id?: string
          improvement_suggestions?: string | null
          improvements?: string | null
          information_rating?: number | null
          likely_to_return?: boolean | null
          met_expectations?: boolean | null
          nationality?: string | null
          newsletter_signup?: boolean | null
          organisation_rating?: number | null
          overall_rating?: number
          overview_rating?: number | null
          pace_rating?: number | null
          price_rating?: number | null
          quality_equipment_rating?: number | null
          repeat_travel?: boolean | null
          repeat_travel_comment?: string | null
          route_rating?: number | null
          safety_comment?: string | null
          safety_rating?: number | null
          signature_data_url?: string | null
          status?: string | null
          submitted_at?: string
          tour_expectations_met?: boolean | null
          tour_highlight?: string | null
          tour_id?: string
          tour_leader_knowledge?: number | null
          tour_leader_knowledge_comment?: string | null
          tour_section_completed?: string | null
          truck_comfort_rating?: number | null
          truck_satisfaction?: boolean | null
          truck_satisfaction_comment?: string | null
          value_for_money?: boolean | null
          value_for_money_comment?: string | null
          value_rating?: number | null
          vehicle_rating?: number | null
          willing_to_review_google?: boolean | null
          willing_to_review_tripadvisor?: boolean | null
          would_recommend?: boolean | null
          would_recommend_comment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comprehensive_feedback_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          emergency_contact: string | null
          full_name: string
          id: string
          passport_number: string | null
          phone: string | null
          role: string
          updated_at: string
          visa_status: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          full_name: string
          id?: string
          passport_number?: string | null
          phone?: string | null
          role: string
          updated_at?: string
          visa_status?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          full_name?: string
          id?: string
          passport_number?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          visa_status?: string | null
        }
        Relationships: []
      }
      tours: {
        Row: {
          created_at: string
          crew_count: number | null
          date_end: string | null
          date_start: string | null
          driver_id: string | null
          guide_id: string | null
          id: string
          passenger_count: number | null
          status: string
          tour_code: string
          tour_leader: string | null
          tour_name: string
          tour_type: string | null
          truck_name: string | null
          updated_at: string
          vehicle_name: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string
          crew_count?: number | null
          date_end?: string | null
          date_start?: string | null
          driver_id?: string | null
          guide_id?: string | null
          id?: string
          passenger_count?: number | null
          status?: string
          tour_code: string
          tour_leader?: string | null
          tour_name: string
          tour_type?: string | null
          truck_name?: string | null
          updated_at?: string
          vehicle_name?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string
          crew_count?: number | null
          date_end?: string | null
          date_start?: string | null
          driver_id?: string | null
          guide_id?: string | null
          id?: string
          passenger_count?: number | null
          status?: string
          tour_code?: string
          tour_leader?: string | null
          tour_name?: string
          tour_type?: string | null
          truck_name?: string | null
          updated_at?: string
          vehicle_name?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
