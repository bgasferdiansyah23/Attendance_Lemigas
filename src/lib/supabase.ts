import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kxedyhprtdmpaivumyjw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWR5aHBydGRtcGFpdnVteWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTY1NjAsImV4cCI6MjA3MDMzMjU2MH0.YohQMwYvUYjrx6MNkXuURg_1J_o0YngEUmyjuDXlROk';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using placeholder Supabase credentials. Please update .env file with your actual Supabase project credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          full_name: string;
          role: 'intern' | 'supervisor' | 'admin';
          photo_url?: string;
          supervisor_id?: string;
          internship_start_date?: string;
          internship_end_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      attendance: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          check_in_time?: string;
          check_out_time?: string;
          check_in_location?: { lat: number; lng: number; address: string };
          check_out_location?: { lat: number; lng: number; address: string };
          status: 'present' | 'absent' | 'late' | 'early_leave';
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>;
      };
      schedules: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string;
          description?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['schedules']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['schedules']['Insert']>;
      };
      leave_requests: {
        Row: {
          id: string;
          user_id: string;
          leave_type: 'sick' | 'personal' | 'emergency' | 'vacation';
          start_date: string;
          end_date: string;
          reason: string;
          approval_status: 'pending' | 'approved' | 'rejected';
          approved_by?: string;
          approved_at?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leave_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['leave_requests']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'warning' | 'success' | 'error';
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
};