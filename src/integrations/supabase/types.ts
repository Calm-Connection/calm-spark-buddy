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
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          requirement_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_count?: number | null
        }
        Relationships: []
      }
      carer_journal_entries: {
        Row: {
          carer_id: string
          created_at: string
          drawing_data: Json | null
          entry_text: string | null
          entry_type: string
          id: string
          updated_at: string
          voice_url: string | null
        }
        Insert: {
          carer_id: string
          created_at?: string
          drawing_data?: Json | null
          entry_text?: string | null
          entry_type?: string
          id?: string
          updated_at?: string
          voice_url?: string | null
        }
        Update: {
          carer_id?: string
          created_at?: string
          drawing_data?: Json | null
          entry_text?: string | null
          entry_type?: string
          id?: string
          updated_at?: string
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carer_journal_entries_carer_id_fkey"
            columns: ["carer_id"]
            isOneToOne: false
            referencedRelation: "carer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carer_profiles: {
        Row: {
          avatar_json: Json | null
          created_at: string
          id: string
          nickname: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_json?: Json | null
          created_at?: string
          id?: string
          nickname?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_json?: Json | null
          created_at?: string
          id?: string
          nickname?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      children_profiles: {
        Row: {
          avatar_json: Json | null
          created_at: string
          id: string
          linked_carer_id: string | null
          nickname: string
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_json?: Json | null
          created_at?: string
          id?: string
          linked_carer_id?: string | null
          nickname: string
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_json?: Json | null
          created_at?: string
          id?: string
          linked_carer_id?: string | null
          nickname?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coping_tools: {
        Row: {
          age_range: string
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          instructions: Json
          name: string
          tags: string[]
        }
        Insert: {
          age_range?: string
          category: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          instructions: Json
          name: string
          tags?: string[]
        }
        Update: {
          age_range?: string
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          instructions?: Json
          name?: string
          tags?: string[]
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          carer_user_id: string
          child_user_id: string | null
          code: string
          created_at: string
          expires_at: string
          id: string
          used: boolean | null
        }
        Insert: {
          carer_user_id: string
          child_user_id?: string | null
          code: string
          created_at?: string
          expires_at: string
          id?: string
          used?: boolean | null
        }
        Update: {
          carer_user_id?: string
          child_user_id?: string | null
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          used?: boolean | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          child_id: string
          created_at: string
          drawing_data: Json | null
          entry_text: string
          flag_reasons: Json | null
          flagged: boolean | null
          id: string
          mood_tag: Database["public"]["Enums"]["mood_tag"] | null
          share_with_carer: boolean | null
          updated_at: string
          voice_url: string | null
        }
        Insert: {
          child_id: string
          created_at?: string
          drawing_data?: Json | null
          entry_text: string
          flag_reasons?: Json | null
          flagged?: boolean | null
          id?: string
          mood_tag?: Database["public"]["Enums"]["mood_tag"] | null
          share_with_carer?: boolean | null
          updated_at?: string
          voice_url?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string
          drawing_data?: Json | null
          entry_text?: string
          flag_reasons?: Json | null
          flagged?: boolean | null
          id?: string
          mood_tag?: Database["public"]["Enums"]["mood_tag"] | null
          share_with_carer?: boolean | null
          updated_at?: string
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_lessons: {
        Row: {
          content: string
          content_type: string
          created_at: string
          id: string
          media_url: string | null
          module_id: string
          order_index: number
          title: string
        }
        Insert: {
          content: string
          content_type?: string
          created_at?: string
          id?: string
          media_url?: string | null
          module_id: string
          order_index?: number
          title: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          media_url?: string | null
          module_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          order_index?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      safeguarding_logs: {
        Row: {
          action_taken: string | null
          child_id: string
          created_at: string
          detected_keywords: Json | null
          id: string
          journal_entry_id: string | null
          severity_score: number | null
        }
        Insert: {
          action_taken?: string | null
          child_id: string
          created_at?: string
          detected_keywords?: Json | null
          id?: string
          journal_entry_id?: string | null
          severity_score?: number | null
        }
        Update: {
          action_taken?: string | null
          child_id?: string
          created_at?: string
          detected_keywords?: Json | null
          id?: string
          journal_entry_id?: string | null
          severity_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "safeguarding_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safeguarding_logs_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string | null
          module_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          module_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          module_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wendy_insights: {
        Row: {
          child_id: string
          created_at: string
          escalate: boolean | null
          id: string
          journal_entry_id: string
          mood_score: number | null
          recommended_tool_ids: string[] | null
          recommended_tools: Json | null
          summary: string | null
          themes: Json | null
        }
        Insert: {
          child_id: string
          created_at?: string
          escalate?: boolean | null
          id?: string
          journal_entry_id: string
          mood_score?: number | null
          recommended_tool_ids?: string[] | null
          recommended_tools?: Json | null
          summary?: string | null
          themes?: Json | null
        }
        Update: {
          child_id?: string
          created_at?: string
          escalate?: boolean | null
          id?: string
          journal_entry_id?: string
          mood_score?: number | null
          recommended_tool_ids?: string[] | null
          recommended_tools?: Json | null
          summary?: string | null
          themes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "wendy_insights_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wendy_insights_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: true
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "child" | "carer"
      mood_tag:
        | "happy"
        | "sad"
        | "angry"
        | "worried"
        | "calm"
        | "excited"
        | "scared"
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
    Enums: {
      app_role: ["child", "carer"],
      mood_tag: [
        "happy",
        "sad",
        "angry",
        "worried",
        "calm",
        "excited",
        "scared",
      ],
    },
  },
} as const
