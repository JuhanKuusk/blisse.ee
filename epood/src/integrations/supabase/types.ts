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
      abi_memory: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          created_at: string | null
          error_details: string | null
          error_message: string | null
          id: number
          source: string | null
        }
        Insert: {
          created_at?: string | null
          error_details?: string | null
          error_message?: string | null
          id?: never
          source?: string | null
        }
        Update: {
          created_at?: string | null
          error_details?: string | null
          error_message?: string | null
          id?: never
          source?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          count: number | null
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          name: string
          parent: number | null
          slug: string
          updated_at: string | null
          wc_id: number
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          name: string
          parent?: number | null
          slug: string
          updated_at?: string | null
          wc_id: number
        }
        Update: {
          count?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          parent?: number | null
          slug?: string
          updated_at?: string | null
          wc_id?: number
        }
        Relationships: []
      }
      product_category_mapping: {
        Row: {
          category_slug: string
          created_at: string
          id: number
          product_slug: string
          product_wc_id: number
          updated_at: string
          wc_category_name: string | null
          wc_category_slug: string | null
        }
        Insert: {
          category_slug: string
          created_at?: string
          id?: number
          product_slug: string
          product_wc_id: number
          updated_at?: string
          wc_category_name?: string | null
          wc_category_slug?: string | null
        }
        Update: {
          category_slug?: string
          created_at?: string
          id?: number
          product_slug?: string
          product_wc_id?: number
          updated_at?: string
          wc_category_name?: string | null
          wc_category_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_category_mapping_category_slug"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "website_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      products: {
        Row: {
          categories: string[] | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number | null
          regular_price: number | null
          sale_price: number | null
          sku: string | null
          status: string | null
          stock_quantity: number | null
          tags: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          id: number
          image_url?: string | null
          name: string
          price?: number | null
          regular_price?: number | null
          sale_price?: number | null
          sku?: string | null
          status?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number | null
          regular_price?: number | null
          sale_price?: number | null
          sku?: string | null
          status?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      treatment_external_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: number
          is_featured: boolean | null
          media_order: number | null
          media_type: string
          src_url: string
          title: string | null
          treatment_slug: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: number
          is_featured?: boolean | null
          media_order?: number | null
          media_type?: string
          src_url: string
          title?: string | null
          treatment_slug: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: number
          is_featured?: boolean | null
          media_order?: number | null
          media_type?: string
          src_url?: string
          title?: string | null
          treatment_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_treatment_external_media_treatment_slug"
            columns: ["treatment_slug"]
            isOneToOne: false
            referencedRelation: "treatment_external_pages"
            referencedColumns: ["treatment_slug"]
          },
        ]
      }
      treatment_external_pages: {
        Row: {
          created_at: string
          error_message: string | null
          external_url: string
          id: number
          last_scraped_at: string | null
          scrape_status: string | null
          text_content: string | null
          treatment_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          external_url: string
          id?: number
          last_scraped_at?: string | null
          scrape_status?: string | null
          text_content?: string | null
          treatment_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          external_url?: string
          id?: number
          last_scraped_at?: string | null
          scrape_status?: string | null
          text_content?: string | null
          treatment_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      treatment_woocommerce_mapping: {
        Row: {
          category_type: string
          created_at: string | null
          id: number
          treatment_slug: string
          updated_at: string | null
          wc_product_id: number
        }
        Insert: {
          category_type: string
          created_at?: string | null
          id?: number
          treatment_slug: string
          updated_at?: string | null
          wc_product_id: number
        }
        Update: {
          category_type?: string
          created_at?: string | null
          id?: number
          treatment_slug?: string
          updated_at?: string | null
          wc_product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "treatment_woocommerce_mapping_wc_product_id_fkey"
            columns: ["wc_product_id"]
            isOneToOne: false
            referencedRelation: "woocommerce_products"
            referencedColumns: ["wc_id"]
          },
        ]
      }
      treatments: {
        Row: {
          aftercare: Json | null
          benefits: Json | null
          category: string | null
          contraindications: Json | null
          created_at: string
          description: string | null
          duration: string | null
          id: number
          images: Json | null
          mechanism: string | null
          name: string
          price: number | null
          slug: string
          updated_at: string
          wc_product_id: number | null
        }
        Insert: {
          aftercare?: Json | null
          benefits?: Json | null
          category?: string | null
          contraindications?: Json | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: number
          images?: Json | null
          mechanism?: string | null
          name: string
          price?: number | null
          slug: string
          updated_at?: string
          wc_product_id?: number | null
        }
        Update: {
          aftercare?: Json | null
          benefits?: Json | null
          category?: string | null
          contraindications?: Json | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: number
          images?: Json | null
          mechanism?: string | null
          name?: string
          price?: number | null
          slug?: string
          updated_at?: string
          wc_product_id?: number | null
        }
        Relationships: []
      }
      url_routes: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          source_path: string
          target_slug: string
          target_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          source_path: string
          target_slug: string
          target_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          source_path?: string
          target_slug?: string
          target_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          parent_slug: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          parent_slug?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          parent_slug?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      woocommerce_categories: {
        Row: {
          count: number | null
          created_at: string
          description: string | null
          display: string | null
          id: number
          image: Json | null
          menu_order: number | null
          name: string
          parent: number | null
          slug: string
          updated_at: string
          wc_id: number
        }
        Insert: {
          count?: number | null
          created_at?: string
          description?: string | null
          display?: string | null
          id?: number
          image?: Json | null
          menu_order?: number | null
          name: string
          parent?: number | null
          slug: string
          updated_at?: string
          wc_id: number
        }
        Update: {
          count?: number | null
          created_at?: string
          description?: string | null
          display?: string | null
          id?: number
          image?: Json | null
          menu_order?: number | null
          name?: string
          parent?: number | null
          slug?: string
          updated_at?: string
          wc_id?: number
        }
        Relationships: []
      }
      woocommerce_product_variations: {
        Row: {
          attributes: Json | null
          created_at: string
          date_created: string | null
          date_modified: string | null
          dimensions: Json | null
          id: number
          image: Json | null
          manage_stock: boolean | null
          meta_data: Json | null
          on_sale: boolean | null
          parent_product_id: number
          parent_product_wc_id: number
          permalink: string | null
          price: number | null
          regular_price: number | null
          sale_price: number | null
          shipping_class: string | null
          sku: string | null
          status: string | null
          stock_quantity: number | null
          stock_status: string | null
          updated_at: string
          variation_id: number
          weight: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          date_created?: string | null
          date_modified?: string | null
          dimensions?: Json | null
          id?: number
          image?: Json | null
          manage_stock?: boolean | null
          meta_data?: Json | null
          on_sale?: boolean | null
          parent_product_id: number
          parent_product_wc_id: number
          permalink?: string | null
          price?: number | null
          regular_price?: number | null
          sale_price?: number | null
          shipping_class?: string | null
          sku?: string | null
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          updated_at?: string
          variation_id: number
          weight?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          date_created?: string | null
          date_modified?: string | null
          dimensions?: Json | null
          id?: number
          image?: Json | null
          manage_stock?: boolean | null
          meta_data?: Json | null
          on_sale?: boolean | null
          parent_product_id?: number
          parent_product_wc_id?: number
          permalink?: string | null
          price?: number | null
          regular_price?: number | null
          sale_price?: number | null
          shipping_class?: string | null
          sku?: string | null
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          updated_at?: string
          variation_id?: number
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_variation_parent_product"
            columns: ["parent_product_wc_id"]
            isOneToOne: false
            referencedRelation: "woocommerce_products"
            referencedColumns: ["wc_id"]
          },
        ]
      }
      woocommerce_products: {
        Row: {
          attributes: Json | null
          benefits: Json | null
          catalog_visibility: string | null
          categories: Json | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          featured: boolean | null
          full_ingredients: string | null
          id: number
          images: Json | null
          last_synced_at: string | null
          manage_stock: boolean | null
          meta_data: Json | null
          name: string
          on_sale: boolean | null
          permalink: string | null
          price: number | null
          regular_price: number | null
          related_ids: Json | null
          sale_price: number | null
          short_description: string | null
          sku: string | null
          slug: string
          status: string | null
          stock_quantity: number | null
          stock_status: string | null
          tags: Json | null
          type: string | null
          updated_at: string | null
          url_path: string | null
          variations: Json | null
          wc_id: number
          weight: string | null
        }
        Insert: {
          attributes?: Json | null
          benefits?: Json | null
          catalog_visibility?: string | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          featured?: boolean | null
          full_ingredients?: string | null
          id?: number
          images?: Json | null
          last_synced_at?: string | null
          manage_stock?: boolean | null
          meta_data?: Json | null
          name: string
          on_sale?: boolean | null
          permalink?: string | null
          price?: number | null
          regular_price?: number | null
          related_ids?: Json | null
          sale_price?: number | null
          short_description?: string | null
          sku?: string | null
          slug: string
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: Json | null
          type?: string | null
          updated_at?: string | null
          url_path?: string | null
          variations?: Json | null
          wc_id: number
          weight?: string | null
        }
        Update: {
          attributes?: Json | null
          benefits?: Json | null
          catalog_visibility?: string | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          featured?: boolean | null
          full_ingredients?: string | null
          id?: number
          images?: Json | null
          last_synced_at?: string | null
          manage_stock?: boolean | null
          meta_data?: Json | null
          name?: string
          on_sale?: boolean | null
          permalink?: string | null
          price?: number | null
          regular_price?: number | null
          related_ids?: Json | null
          sale_price?: number | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: Json | null
          type?: string | null
          updated_at?: string | null
          url_path?: string | null
          variations?: Json | null
          wc_id?: number
          weight?: string | null
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
