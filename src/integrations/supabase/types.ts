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
          additional_comments: string | null
          client_email: string | null
          client_name: string
          client_nationality: string | null
          client_phone: string | null
          created_at: string
          driver_rating: number | null
          food_rating: number | null
          guide_rating: number | null
          highlights: string | null
          id: string
          improvements: string | null
          likely_to_return: boolean | null
          overall_rating: number
          submitted_at: string
          tour_expectations_met: boolean | null
          tour_id: string
          value_rating: number | null
          vehicle_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          accommodation_rating?: number | null
          additional_comments?: string | null
          client_email?: string | null
          client_name: string
          client_nationality?: string | null
          client_phone?: string | null
          created_at?: string
          driver_rating?: number | null
          food_rating?: number | null
          guide_rating?: number | null
          highlights?: string | null
          id?: string
          improvements?: string | null
          likely_to_return?: boolean | null
          overall_rating: number
          submitted_at?: string
          tour_expectations_met?: boolean | null
          tour_id: string
          value_rating?: number | null
          vehicle_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          accommodation_rating?: number | null
          additional_comments?: string | null
          client_email?: string | null
          client_name?: string
          client_nationality?: string | null
          client_phone?: string | null
          created_at?: string
          driver_rating?: number | null
          food_rating?: number | null
          guide_rating?: number | null
          highlights?: string | null
          id?: string
          improvements?: string | null
          likely_to_return?: boolean | null
          overall_rating?: number
          submitted_at?: string
          tour_expectations_met?: boolean | null
          tour_id?: string
          value_rating?: number | null
          vehicle_rating?: number | null
          would_recommend?: boolean | null
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
        }
        Insert: {
          created_at?: string
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
        }
        Update: {
          created_at?: string
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
