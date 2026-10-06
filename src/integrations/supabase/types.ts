export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      ai_chats: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          retrieved: Json | null;
          role: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          retrieved?: Json | null;
          role: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          retrieved?: Json | null;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_rollup: {
        Row: {
          calcium_mg: number;
          calories: number;
          carbs_g: number;
          day: string;
          fat_g: number;
          fiber_g: number;
          iron_mg: number;
          magnesium_mg: number;
          meal_count: number;
          omega3_g: number;
          potassium_mg: number;
          protein_g: number;
          score: number;
          sodium_mg: number;
          steps: number;
          sugar_g: number;
          updated_at: string;
          user_id: string;
          vit_a_ug: number;
          vit_b12_ug: number;
          vit_d_ug: number;
          water_glasses: number;
        };
        Insert: {
          calcium_mg?: number;
          calories?: number;
          carbs_g?: number;
          day: string;
          fat_g?: number;
          fiber_g?: number;
          iron_mg?: number;
          magnesium_mg?: number;
          meal_count?: number;
          omega3_g?: number;
          potassium_mg?: number;
          protein_g?: number;
          score?: number;
          sodium_mg?: number;
          steps?: number;
          sugar_g?: number;
          updated_at?: string;
          user_id: string;
          vit_a_ug?: number;
          vit_b12_ug?: number;
          vit_d_ug?: number;
          water_glasses?: number;
        };
        Update: {
          calcium_mg?: number;
          calories?: number;
          carbs_g?: number;
          day?: string;
          fat_g?: number;
          fiber_g?: number;
          iron_mg?: number;
          magnesium_mg?: number;
          meal_count?: number;
          omega3_g?: number;
          potassium_mg?: number;
          protein_g?: number;
          score?: number;
          sodium_mg?: number;
          steps?: number;
          sugar_g?: number;
          updated_at?: string;
          user_id?: string;
          vit_a_ug?: number;
          vit_b12_ug?: number;
          vit_d_ug?: number;
          water_glasses?: number;
        };
        Relationships: [];
      };
      meal_micros: {
        Row: {
          calcium_mg: number;
          iron_mg: number;
          magnesium_mg: number;
          meal_id: string;
          omega3_g: number;
          potassium_mg: number;
          user_id: string;
          vit_a_ug: number;
          vit_b12_ug: number;
          vit_d_ug: number;
        };
        Insert: {
          calcium_mg?: number;
          iron_mg?: number;
          magnesium_mg?: number;
          meal_id: string;
          omega3_g?: number;
          potassium_mg?: number;
          user_id: string;
          vit_a_ug?: number;
          vit_b12_ug?: number;
          vit_d_ug?: number;
        };
        Update: {
          calcium_mg?: number;
          iron_mg?: number;
          magnesium_mg?: number;
          meal_id?: string;
          omega3_g?: number;
          potassium_mg?: number;
          user_id?: string;
          vit_a_ug?: number;
          vit_b12_ug?: number;
          vit_d_ug?: number;
        };
        Relationships: [
          {
            foreignKeyName: "meal_micros_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: true;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          },
        ];
      };
      meals: {
        Row: {
          calories: number;
          carbs_g: number;
          confidence: number | null;
          created_at: string;
          eaten_at: string;
          eaten_on: string;
          fat_g: number;
          fiber_g: number;
          id: string;
          name: string;
          protein_g: number;
          raw_model_response: Json | null;
          serving_desc: string | null;
          sodium_mg: number;
          source: Database["public"]["Enums"]["meal_source"];
          sugar_g: number;
          user_id: string;
        };
        Insert: {
          calories?: number;
          carbs_g?: number;
          confidence?: number | null;
          created_at?: string;
          eaten_at?: string;
          eaten_on?: string;
          fat_g?: number;
          fiber_g?: number;
          id?: string;
          name: string;
          protein_g?: number;
          raw_model_response?: Json | null;
          serving_desc?: string | null;
          sodium_mg?: number;
          source?: Database["public"]["Enums"]["meal_source"];
          sugar_g?: number;
          user_id: string;
        };
        Update: {
          calories?: number;
          carbs_g?: number;
          confidence?: number | null;
          created_at?: string;
          eaten_at?: string;
          eaten_on?: string;
          fat_g?: number;
          fiber_g?: number;
          id?: string;
          name?: string;
          protein_g?: number;
          raw_model_response?: Json | null;
          serving_desc?: string | null;
          sodium_mg?: number;
          source?: Database["public"]["Enums"]["meal_source"];
          sugar_g?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          activity: Database["public"]["Enums"]["activity_level"] | null;
          age: number | null;
          created_at: string;
          daily_calorie_target: number | null;
          diet: Database["public"]["Enums"]["diet_type"] | null;
          display_name: string | null;
          extended_data: Json;
          gender: string | null;
          goal: Database["public"]["Enums"]["goal_type"] | null;
          goal_weight_kg: number | null;
          height_cm: number | null;
          onboarded: boolean;
          protein_target_g: number | null;
          updated_at: string;
          user_id: string;
          water_goal_l: number | null;
          water_target_glasses: number | null;
          weight_kg: number | null;
        };
        Insert: {
          activity?: Database["public"]["Enums"]["activity_level"] | null;
          age?: number | null;
          created_at?: string;
          daily_calorie_target?: number | null;
          diet?: Database["public"]["Enums"]["diet_type"] | null;
          display_name?: string | null;
          extended_data?: Json;
          gender?: string | null;
          goal?: Database["public"]["Enums"]["goal_type"] | null;
          goal_weight_kg?: number | null;
          height_cm?: number | null;
          onboarded?: boolean;
          protein_target_g?: number | null;
          updated_at?: string;
          user_id: string;
          water_goal_l?: number | null;
          water_target_glasses?: number | null;
          weight_kg?: number | null;
        };
        Update: {
          activity?: Database["public"]["Enums"]["activity_level"] | null;
          age?: number | null;
          created_at?: string;
          daily_calorie_target?: number | null;
          diet?: Database["public"]["Enums"]["diet_type"] | null;
          display_name?: string | null;
          extended_data?: Json;
          gender?: string | null;
          goal?: Database["public"]["Enums"]["goal_type"] | null;
          goal_weight_kg?: number | null;
          height_cm?: number | null;
          onboarded?: boolean;
          protein_target_g?: number | null;
          updated_at?: string;
          user_id?: string;
          water_goal_l?: number | null;
          water_target_glasses?: number | null;
          weight_kg?: number | null;
        };
        Relationships: [];
      };
      step_logs: {
        Row: {
          active_minutes: number;
          calories_burned: number;
          day: string;
          distance_km: number;
          id: string;
          steps: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active_minutes?: number;
          calories_burned?: number;
          day?: string;
          distance_km?: number;
          id?: string;
          steps?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active_minutes?: number;
          calories_burned?: number;
          day?: string;
          distance_km?: number;
          id?: string;
          steps?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_medical_flags: {
        Row: {
          flag: Database["public"]["Enums"]["medical_flag"];
          user_id: string;
        };
        Insert: {
          flag: Database["public"]["Enums"]["medical_flag"];
          user_id: string;
        };
        Update: {
          flag?: Database["public"]["Enums"]["medical_flag"];
          user_id?: string;
        };
        Relationships: [];
      };
      water_logs: {
        Row: {
          created_at: string;
          day: string;
          glasses: number;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          day?: string;
          glasses?: number;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          day?: string;
          glasses?: number;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      weights: {
        Row: {
          created_at: string;
          day: string;
          id: string;
          user_id: string;
          weight_kg: number;
        };
        Insert: {
          created_at?: string;
          day?: string;
          id?: string;
          user_id: string;
          weight_kg: number;
        };
        Update: {
          created_at?: string;
          day?: string;
          id?: string;
          user_id?: string;
          weight_kg?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      recompute_daily_rollup: {
        Args: { p_day: string; p_user: string };
        Returns: undefined;
      };
    };
    Enums: {
      activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active";
      diet_type: "vegetarian" | "vegan" | "non_veg" | "jain" | "keto" | "high_protein";
      goal_type: "fat_loss" | "lean_bulk" | "muscle_gain" | "maintenance" | "recomp";
      meal_source: "photo" | "manual" | "barcode";
      medical_flag:
        "diabetes" | "pcos" | "hypertension" | "fatty_liver" | "kidney_disease" | "food_allergy";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      activity_level: ["sedentary", "light", "moderate", "active", "very_active"],
      diet_type: ["vegetarian", "vegan", "non_veg", "jain", "keto", "high_protein"],
      goal_type: ["fat_loss", "lean_bulk", "muscle_gain", "maintenance", "recomp"],
      meal_source: ["photo", "manual", "barcode"],
      medical_flag: [
        "diabetes",
        "pcos",
        "hypertension",
        "fatty_liver",
        "kidney_disease",
        "food_allergy",
      ],
    },
  },
} as const;
