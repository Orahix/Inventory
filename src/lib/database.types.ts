export interface Database {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string;
          name: string;
          category: string;
          project: string | null;
          current_stock: number;
          min_stock: number;
          max_stock: number;
          unit_price: number;
          supplier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          project?: string | null;
          current_stock?: number;
          min_stock?: number;
          max_stock?: number;
          unit_price?: number;
          supplier: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          project?: string | null;
          current_stock?: number;
          min_stock?: number;
          max_stock?: number;
          unit_price?: number;
          supplier?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff_members: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'Admin' | 'Manager' | 'Staff';
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'Admin' | 'Manager' | 'Staff';
          department: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'Admin' | 'Manager' | 'Staff';
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          item_id: string | null;
          item_name: string;
          type: 'input' | 'output';
          quantity: number;
          unit_price: number;
          total_value: number;
          project: string;
          staff_id: string | null;
          staff_name: string;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id?: string | null;
          item_name: string;
          type: 'input' | 'output';
          quantity: number;
          unit_price: number;
          total_value: number;
          project: string;
          staff_id?: string | null;
          staff_name: string;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string | null;
          item_name?: string;
          type?: 'input' | 'output';
          quantity?: number;
          unit_price?: number;
          total_value?: number;
          project?: string;
          staff_id?: string | null;
          staff_name?: string;
          comment?: string | null;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          staff_id: string;
          email: string;
          role: 'Admin' | 'Manager' | 'Staff';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          staff_id: string;
          email: string;
          role: 'Admin' | 'Manager' | 'Staff';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          staff_id?: string;
          email?: string;
          role?: 'Admin' | 'Manager' | 'Staff';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}