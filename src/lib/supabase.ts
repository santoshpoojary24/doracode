/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type helpers
export type Profile = {
  id: string
  username: string
  avatar_url?: string
  role: 'admin' | 'viewer'
  bio?: string
  created_at: string
}

export type Repository = {
  id: string
  owner_id: string
  name: string
  description?: string
  is_private: boolean
  language?: string
  stars: number
  forks: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type FileRecord = {
  id: string
  repo_id: string
  name: string
  path: string
  content?: string
  storage_path?: string
  language?: string
  size_bytes?: number
  created_by: string
  created_at: string
  updated_at: string
}

export type Commit = {
  id: string
  repo_id: string
  file_id?: string
  author_id: string
  message: string
  previous_content?: string
  new_content?: string
  created_at: string
  profiles?: Profile
}
