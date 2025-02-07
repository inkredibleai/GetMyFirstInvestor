export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      investors: {
        Row: {
          active: boolean | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          invested_startups: number | null
          investment_focus: string | null
          maximum_investment: string | null
          minimum_investment: string | null
          name: string
          organization: string | null
          status: string | null
          total_investment: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          invested_startups?: number | null
          investment_focus?: string | null
          maximum_investment?: string | null
          minimum_investment?: string | null
          name: string
          organization?: string | null
          status?: string | null
          total_investment?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          invested_startups?: number | null
          investment_focus?: string | null
          maximum_investment?: string | null
          minimum_investment?: string | null
          name?: string
          organization?: string | null
          status?: string | null
          total_investment?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      startups: {
        Row: {
          business_model: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          funding_stage: string | null
          id: string
          industry: string | null
          location: string | null
          name: string
          pitch_deck: string | null
          status: string | null
          team_size: number | null
          total_funding: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          business_model?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          funding_stage?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          name: string
          pitch_deck?: string | null
          status?: string | null
          team_size?: number | null
          total_funding?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          business_model?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          funding_stage?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          name?: string
          pitch_deck?: string | null
          status?: string | null
          team_size?: number | null
          total_funding?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          integration_details: string | null
          name: string
          price_model: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          users: number | null
          website: string | null
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          integration_details?: string | null
          name: string
          price_model?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          users?: number | null
          website?: string | null
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          integration_details?: string | null
          name?: string
          price_model?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          users?: number | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      startup_status: "idea" | "mvp" | "beta" | "live" | "acquired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
