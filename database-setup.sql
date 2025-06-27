-- HEALTHCARE APP DATABASE SCHEMA
-- Execute this entire script in Supabase SQL Editor

-- 1. CREATE PROFILES TABLE
-- This table stores public data for each user, linked to their secure login information.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a comment to explain the table's purpose.
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- 2. CREATE MOOD ENTRIES TABLE
-- This table stores every mood log a user makes.
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood_score INT NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5), -- e.g., 1 for sad, 5 for happy
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.mood_entries IS 'Stores individual mood log entries for each user.';

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- This is a critical security step. It ensures users can ONLY access their own data.
-- By default, no one can access anything until we create policies below.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES IF THEY EXIST (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- 5. CREATE RLS POLICIES FOR THE 'profiles' TABLE
-- These rules define who can do what with the data.
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6. DROP EXISTING POLICIES FOR MOOD ENTRIES (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own mood entries." ON public.mood_entries;
DROP POLICY IF EXISTS "Users can insert their own mood entries." ON public.mood_entries;
DROP POLICY IF EXISTS "Users can update their own mood entries." ON public.mood_entries;
DROP POLICY IF EXISTS "Users can delete their own mood entries." ON public.mood_entries;

-- 7. CREATE RLS POLICIES FOR THE 'mood_entries' TABLE
CREATE POLICY "Users can view their own mood entries."
  ON public.mood_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries."
  ON public.mood_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries."
  ON public.mood_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries."
  ON public.mood_entries FOR DELETE
  USING (auth.uid() = user_id);

-- 8. DROP EXISTING TRIGGER AND FUNCTION (to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 9. CREATE A FUNCTION TO AUTOMATICALLY ADD A NEW USER TO THE 'profiles' TABLE
-- This function runs automatically whenever a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, updated_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    NOW()
  );
  RETURN new;
END;
$$;

-- 10. CREATE A TRIGGER TO EXECUTE THE FUNCTION
-- This connects the function to Supabase's authentication system.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at);

-- 12. VERIFY THE SETUP
SELECT 'Database schema setup completed successfully!' as status;
