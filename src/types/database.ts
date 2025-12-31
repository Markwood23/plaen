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
      attachments: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: Json | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: Json | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: Json | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          quantity: number | null
          sort_order: number | null
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          quantity?: number | null
          sort_order?: number | null
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number | null
          sort_order?: number | null
          unit_price?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_paid: number | null
          balance_due: number | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          customer_id: string | null
          discount_amount: number | null
          discount_type: string | null
          discount_value: number | null
          due_date: string | null
          footer: string | null
          id: string
          invoice_number: string
          issue_date: string
          metadata: Json | null
          notes: string | null
          paid_at: string | null
          payment_instructions: Json | null
          public_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          terms: string | null
          total: number | null
          updated_at: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          balance_due?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          customer_id?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          due_date?: string | null
          footer?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          metadata?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_instructions?: Json | null
          public_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          balance_due?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          customer_id?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          due_date?: string | null
          footer?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          metadata?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_instructions?: Json | null
          public_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_pinned: boolean | null
          is_published: boolean | null
          published_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_allocations: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string
          payment_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id: string
          payment_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string
          payment_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          id: string
          metadata: Json | null
          notes: string | null
          payer_email: string | null
          payer_name: string | null
          payer_phone: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          reference?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      receipt_snapshots: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string | null
          payment_id: string
          receipt_number: string
          snapshot_data: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          payment_id: string
          receipt_number: string
          snapshot_data: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          payment_id?: string
          receipt_number?: string
          snapshot_data?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          address: Json | null
          bank_details: Json | null
          business_name: string | null
          created_at: string | null
          crypto_wallets: Json | null
          default_currency: Database["public"]["Enums"]["currency_code"] | null
          default_payment_terms: number | null
          email: string
          full_name: string | null
          id: string
          logo_url: string | null
          mobile_money_details: Json | null
          phone: string | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          bank_details?: Json | null
          business_name?: string | null
          created_at?: string | null
          crypto_wallets?: Json | null
          default_currency?: Database["public"]["Enums"]["currency_code"] | null
          default_payment_terms?: number | null
          email: string
          full_name?: string | null
          id: string
          logo_url?: string | null
          mobile_money_details?: Json | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          bank_details?: Json | null
          business_name?: string | null
          created_at?: string | null
          crypto_wallets?: Json | null
          default_currency?: Database["public"]["Enums"]["currency_code"] | null
          default_payment_terms?: number | null
          email?: string
          full_name?: string | null
          id?: string
          logo_url?: string | null
          mobile_money_details?: Json | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: { Args: { p_user_id: string }; Returns: string }
      generate_public_id: { Args: never; Returns: string }
    }
    Enums: {
      currency_code: "GHS" | "USD" | "EUR" | "GBP" | "NGN" | "KES" | "ZAR"
      invoice_status:
        | "draft"
        | "sent"
        | "viewed"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "cancelled"
      payment_method:
        | "bank_transfer"
        | "mobile_money"
        | "card"
        | "crypto"
        | "cash"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Convenience types
export type User = Tables<"users">
export type UserInsert = TablesInsert<"users">
export type UserUpdate = TablesUpdate<"users">

export type Customer = Tables<"customers">
export type CustomerInsert = TablesInsert<"customers">
export type CustomerUpdate = TablesUpdate<"customers">

export type Invoice = Tables<"invoices">
export type InvoiceInsert = TablesInsert<"invoices">
export type InvoiceUpdate = TablesUpdate<"invoices">
export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"]

export type InvoiceLineItem = Tables<"invoice_line_items">
export type InvoiceLineItemInsert = TablesInsert<"invoice_line_items">
export type InvoiceLineItemUpdate = TablesUpdate<"invoice_line_items">

export type Payment = Tables<"payments">
export type PaymentInsert = TablesInsert<"payments">
export type PaymentUpdate = TablesUpdate<"payments">
export type PaymentMethod = Database["public"]["Enums"]["payment_method"]

export type PaymentAllocation = Tables<"payment_allocations">
export type PaymentAllocationInsert = TablesInsert<"payment_allocations">

export type ReceiptSnapshot = Tables<"receipt_snapshots">
export type ReceiptSnapshotInsert = TablesInsert<"receipt_snapshots">

export type CurrencyCode = Database["public"]["Enums"]["currency_code"]
