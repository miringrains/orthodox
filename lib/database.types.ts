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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          is_pinned: boolean | null
          parish_id: string
          published_at: string | null
          scheduled_for: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          is_pinned?: boolean | null
          parish_id: string
          published_at?: string | null
          scheduled_for?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_pinned?: boolean | null
          parish_id?: string
          published_at?: string | null
          scheduled_for?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          parish_id: string | null
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          parish_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          parish_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_needs: {
        Row: {
          created_at: string | null
          created_by: string
          current_amount: number | null
          description: string | null
          goal_amount: number | null
          id: string
          parish_id: string
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          current_amount?: number | null
          description?: string | null
          goal_amount?: number | null
          id?: string
          parish_id: string
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          current_amount?: number | null
          description?: string | null
          goal_amount?: number | null
          id?: string
          parish_id?: string
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_needs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_needs_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      diocese_parishes: {
        Row: {
          created_at: string | null
          diocese_id: string
          parish_id: string
        }
        Insert: {
          created_at?: string | null
          diocese_id: string
          parish_id: string
        }
        Update: {
          created_at?: string | null
          diocese_id?: string
          parish_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diocese_parishes_diocese_id_fkey"
            columns: ["diocese_id"]
            isOneToOne: false
            referencedRelation: "dioceses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diocese_parishes_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      dioceses: {
        Row: {
          created_at: string | null
          id: string
          jurisdiction: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          jurisdiction?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          jurisdiction?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_funds: {
        Row: {
          created_at: string | null
          description: string | null
          fund_type: string
          id: string
          is_default: boolean | null
          name: string
          parish_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fund_type: string
          id?: string
          is_default?: boolean | null
          name: string
          parish_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fund_type?: string
          id?: string
          is_default?: boolean | null
          name?: string
          parish_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_funds_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          candle_count: number | null
          candle_intention: string | null
          community_need_id: string | null
          created_at: string | null
          currency: string | null
          donor_id: string | null
          fund_id: string | null
          id: string
          is_candle: boolean | null
          is_recurring: boolean | null
          metadata: Json | null
          parish_id: string
          project_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          candle_count?: number | null
          candle_intention?: string | null
          community_need_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_id?: string | null
          fund_id?: string | null
          id?: string
          is_candle?: boolean | null
          is_recurring?: boolean | null
          metadata?: Json | null
          parish_id: string
          project_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          candle_count?: number | null
          candle_intention?: string | null
          community_need_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_id?: string | null
          fund_id?: string | null
          id?: string
          is_candle?: boolean | null
          is_recurring?: boolean | null
          metadata?: Json | null
          parish_id?: string
          project_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_community_need_fk"
            columns: ["community_need_id"]
            isOneToOne: false
            referencedRelation: "community_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "donation_funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_project_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: Json | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_at: string | null
          event_type: string
          feast_name: string | null
          id: string
          is_feast: boolean | null
          location: string | null
          parish_id: string
          start_at: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_at?: string | null
          event_type: string
          feast_name?: string | null
          id?: string
          is_feast?: boolean | null
          location?: string | null
          parish_id: string
          start_at: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_at?: string | null
          event_type?: string
          feast_name?: string | null
          id?: string
          is_feast?: boolean | null
          location?: string | null
          parish_id?: string
          start_at?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      global_projects: {
        Row: {
          created_at: string | null
          description: string | null
          goal_amount: number | null
          id: string
          is_active: boolean | null
          project_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          project_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          project_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          bucket_name: string | null
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          parish_id: string
          uploaded_by: string
        }
        Insert: {
          bucket_name?: string | null
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          parish_id: string
          uploaded_by: string
        }
        Update: {
          bucket_name?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          parish_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          builder_enabled: boolean | null
          builder_schema: Json | null
          created_at: string | null
          id: string
          is_system: boolean | null
          kind: string
          parish_id: string
          slug: string
          title: Json
          updated_at: string | null
        }
        Insert: {
          builder_enabled?: boolean | null
          builder_schema?: Json | null
          created_at?: string | null
          id?: string
          is_system?: boolean | null
          kind: string
          parish_id: string
          slug: string
          title: Json
          updated_at?: string | null
        }
        Update: {
          builder_enabled?: boolean | null
          builder_schema?: Json | null
          created_at?: string | null
          id?: string
          is_system?: boolean | null
          kind?: string
          parish_id?: string
          slug?: string
          title?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      parish_users: {
        Row: {
          created_at: string | null
          id: string
          parish_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parish_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parish_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parish_users_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parish_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parishes: {
        Row: {
          created_at: string | null
          custom_domain: string | null
          default_languages: string[] | null
          id: string
          is_active: boolean | null
          jurisdiction: string | null
          location: Json | null
          name: string
          slug: string
          subdomain: string | null
          theme_config: Json | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_domain?: string | null
          default_languages?: string[] | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          location?: Json | null
          name: string
          slug: string
          subdomain?: string | null
          theme_config?: Json | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_domain?: string | null
          default_languages?: string[] | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          location?: Json | null
          name?: string
          slug?: string
          subdomain?: string | null
          theme_config?: Json | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string
          current_amount: number | null
          description: string | null
          goal_amount: number | null
          id: string
          is_visible: boolean | null
          parish_id: string
          project_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          current_amount?: number | null
          description?: string | null
          goal_amount?: number | null
          id?: string
          is_visible?: boolean | null
          parish_id: string
          project_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          current_amount?: number | null
          description?: string | null
          goal_amount?: number | null
          id?: string
          is_visible?: boolean | null
          parish_id?: string
          project_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string | null
          created_by: string
          date_preached: string | null
          description: string | null
          id: string
          parish_id: string
          series_id: string | null
          text_content: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          created_by: string
          date_preached?: string | null
          description?: string | null
          id?: string
          parish_id: string
          series_id?: string | null
          text_content?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          created_by?: string
          date_preached?: string | null
          description?: string | null
          id?: string
          parish_id?: string
          series_id?: string | null
          text_content?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sermons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermons_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermons_series_fk"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "sermons"
            referencedColumns: ["id"]
          },
        ]
      }
      service_schedules: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          id: string
          is_recurring: boolean | null
          notes: string | null
          parish_id: string
          service_type: string
          time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          parish_id: string
          service_type: string
          time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          parish_id?: string
          service_type?: string
          time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_schedules_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_platform_admin: boolean | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_platform_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_platform_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_with_password: {
        Args: {
          user_email: string
          user_metadata?: Json
          user_password: string
        }
        Returns: string
      }
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


