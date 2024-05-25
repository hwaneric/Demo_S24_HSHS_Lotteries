export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          biography: string | null;
          display_name: string;
          email: string;
          id: string;
        };
        Insert: {
          biography?: string | null;
          display_name: string;
          email: string;
          id: string;
        };
        Update: {
          biography?: string | null;
          display_name?: string;
          email?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      responses: {
        Row: {
          contact_status: "accepted" | "awaiting response" | "not contacted" | "no response" | "declined";
          dob: string | null;
          email: string | null;
          gender: Database["public"]["Enums"]["gender"];
          id: number;
          is_duplicate: boolean;
          duplicate_ids: number[];
          is_processed: boolean;
          is_waitlisted: boolean;
          lottery_info: string | null;
          lottery_type: Database["public"]["Enums"]["gender"][] | undefined;
          // lottery_type: "man" | "woman";

          name: string | null;
          notes: string | null;
          other_contact: string | null;
          phone: string | null;
          submitted_at: string;
          unwaitlisted_at: string | null;
          uploaded_at: string;
          waitlisted_at: string | null;
          won_at: string | null;
          has_won: boolean;
          is_banned: boolean;
          banned_ids: number[];
        };
        Insert: {
          contact_status?: string | null;
          dob?: string | null;
          email?: string | null;
          gender: Database["public"]["Enums"]["gender"];
          id?: number;
          is_duplicate?: boolean;
          duplicate_ids?: number[];
          is_processed?: boolean;
          is_waitlisted?: boolean;
          lottery_info?: string | null;
          lottery_type?: Database["public"]["Enums"]["gender"][] | null;
          name?: string | null;
          notes?: string | null;
          other_contact?: string | null;
          phone?: string | null;
          submitted_at?: string;
          unwaitlisted_at?: string | null;
          uploaded_at?: string;
          waitlisted_at?: string | null;
          won_at?: string | null;
          has_won?: boolean;
          is_banned?: boolean;
          banned_ids?: number[];
        };
        Update: {
          contact_status?: string | null;
          dob?: string | null;
          email?: string | null;
          gender?: Database["public"]["Enums"]["gender"];
          id?: number;
          is_duplicate?: boolean;
          duplicate_ids?: number[];
          is_processed?: boolean;
          is_waitlisted?: boolean;
          lottery_info?: string | null;
          lottery_type?: Database["public"]["Enums"]["gender"][] | null;
          name?: string | null;
          notes?: string | null;
          other_contact?: string | null;
          phone?: string | null;
          submitted_at?: string;
          unwaitlisted_at?: string | null;
          uploaded_at?: string;
          waitlisted_at?: string | null;
          won_at?: string | null;
          has_won?: boolean;
          is_banned?: boolean;
          banned_ids?: number[];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      gender: "man" | "woman" | "non-binary";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
