export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      group_members: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          group_id: string | null;
          id: string;
          role: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          group_id?: string | null;
          id?: string;
          role: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          group_id?: string | null;
          id?: string;
          role?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      groups: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          description: string;
          id: string;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          description: string;
          id?: string;
          name: string;
          owner_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          display_name: string | null;
          email: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          display_name?: string | null;
          email?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          display_name?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      shopping_list: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          due_date_at: string | null;
          group_id: string | null;
          id: string;
          name: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          due_date_at?: string | null;
          group_id?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          due_date_at?: string | null;
          group_id?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shopping_list_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shopping_list_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      shopping_list_item: {
        Row: {
          category: string | null;
          created_at: string;
          deleted_at: string | null;
          id: string;
          is_purchased: boolean | null;
          name: string | null;
          note: string | null;
          priority: number | null;
          quantity: number | null;
          shopping_list_id: string | null;
          unit: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_purchased?: boolean | null;
          name?: string | null;
          note?: string | null;
          priority?: number | null;
          quantity?: number | null;
          shopping_list_id?: string | null;
          unit?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_purchased?: boolean | null;
          name?: string | null;
          note?: string | null;
          priority?: number | null;
          quantity?: number | null;
          shopping_list_id?: string | null;
          unit?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shopping_list_item_shopping_list_id_fkey";
            columns: ["shopping_list_id"];
            isOneToOne: false;
            referencedRelation: "shopping_list";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shopping_list_item_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      epoch_to_timestamp:
        | {
            Args: {
              epoch: number;
            };
            Returns: string;
          }
        | {
            Args: {
              epoch: string;
            };
            Returns: string;
          };
      pull: {
        Args: {
          last_pulled_at?: number;
        };
        Returns: Json;
      };
      pull_user_data: {
        Args: {
          last_pulled_at?: number;
        };
        Returns: Json;
      };
      pullsync: {
        Args: {
          last_pulled_at?: number;
        };
        Returns: Json;
      };
      pullv2: {
        Args: {
          last_pulled_at?: number;
        };
        Returns: Json;
      };
      push: {
        Args: {
          changes: Json;
        };
        Returns: undefined;
      };
      pushsync: {
        Args: {
          changes: Json;
        };
        Returns: undefined;
      };
      timestamp_to_epoch: {
        Args: {
          ts: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
