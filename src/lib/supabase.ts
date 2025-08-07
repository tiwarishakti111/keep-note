import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_name: string
          user_email: string
          created_on: string
          last_update: string
        }
        Insert: {
          id: string
          user_name: string
          user_email: string
          created_on?: string
          last_update?: string
        }
        Update: {
          id?: string
          user_name?: string
          user_email?: string
          created_on?: string
          last_update?: string
        }
      }
      notes: {
        Row: {
          note_id: string
          user_id: string
          note_title: string
          note_content: string
          created_on: string
          last_update: string
        }
        Insert: {
          note_id?: string
          user_id: string
          note_title?: string
          note_content?: string
          created_on?: string
          last_update?: string
        }
        Update: {
          note_id?: string
          user_id?: string
          note_title?: string
          note_content?: string
          created_on?: string
          last_update?: string
        }
      }
    }
  }
}