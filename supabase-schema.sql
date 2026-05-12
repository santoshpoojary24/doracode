-- ============================================
-- DoraCode Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Profiles (extends auth.users) ──
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'viewer')) DEFAULT 'viewer',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Repositories ──
CREATE TABLE IF NOT EXISTS repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  language TEXT,
  stars INT DEFAULT 0,
  forks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Files ──
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT,
  storage_path TEXT,
  language TEXT,
  size_bytes INT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Commits / Version History ──
CREATE TABLE IF NOT EXISTS commits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  previous_content TEXT,
  new_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Stars ──
CREATE TABLE IF NOT EXISTS stars (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  repo_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, repo_id)
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, owner can update
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Own profile update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Own profile insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Repositories: public repos viewable by all; admins have full access
CREATE POLICY "Public repos viewable" ON repositories FOR SELECT
  USING (is_private = false OR owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins manage repos" ON repositories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Files: same as repos
CREATE POLICY "Public files viewable" ON files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM repositories r WHERE r.id = repo_id AND
    (r.is_private = false OR r.owner_id = auth.uid() OR
     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  ));

CREATE POLICY "Admins manage files" ON files FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Commits: readable if repo is accessible
CREATE POLICY "Commits readable" ON commits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM repositories r WHERE r.id = repo_id AND
    (r.is_private = false OR r.owner_id = auth.uid() OR
     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  ));

CREATE POLICY "Admins manage commits" ON commits FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Stars: anyone can read/manage their own
CREATE POLICY "Stars readable" ON stars FOR SELECT USING (true);
CREATE POLICY "Users manage stars" ON stars FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Helper Functions
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
