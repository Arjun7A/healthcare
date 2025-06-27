-- ADVANCED MOOD TRACKER DATABASE SCHEMA
-- Execute this script in Supabase SQL Editor to upgrade the mood tracking system

-- 1. DROP EXISTING MOOD ENTRIES TABLE TO RECREATE WITH ADVANCED STRUCTURE
DROP TABLE IF EXISTS public.mood_entries CASCADE;

-- 2. CREATE ADVANCED MOOD ENTRIES TABLE
CREATE TABLE public.mood_entries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core mood data
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_score INT NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10), -- 1-10 scale
  mood_emoji TEXT,
  mood_category TEXT,
  
  -- Advanced metrics
  energy_level INT CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  stress_level INT CHECK (stress_level >= 1 AND stress_level <= 10),
  anxiety_level INT CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  productivity_score INT CHECK (productivity_score >= 1 AND productivity_score <= 10),
  social_interactions INT CHECK (social_interactions >= 1 AND social_interactions <= 10),
  
  -- Journal and notes
  note TEXT,
  gratitude TEXT,
  
  -- Context data
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening')),
  weather TEXT,
  
  -- Array fields for complex data
  activities TEXT[], -- Array of activity strings
  tags TEXT[], -- Array of tag strings
  
  -- Media
  image_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one entry per user per day
  UNIQUE(user_id, date)
);

-- 3. ADD COMMENTS FOR DOCUMENTATION
COMMENT ON TABLE public.mood_entries IS 'Advanced mood tracking entries with comprehensive emotional and contextual data';
COMMENT ON COLUMN public.mood_entries.mood_score IS 'Mood rating from 1 (terrible) to 10 (amazing)';
COMMENT ON COLUMN public.mood_entries.activities IS 'Array of activities performed during the day';
COMMENT ON COLUMN public.mood_entries.tags IS 'Array of mood-related tags for categorization';

-- 4. CREATE ACHIEVEMENT TRACKING TABLE
CREATE TABLE public.mood_achievements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  achievement_title TEXT NOT NULL,
  achievement_description TEXT,
  achievement_icon TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate achievements
  UNIQUE(user_id, achievement_id)
);

COMMENT ON TABLE public.mood_achievements IS 'Track user achievements and milestones in mood tracking';

-- 5. CREATE MOOD INSIGHTS TABLE FOR AI ANALYSIS
CREATE TABLE public.mood_insights (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'pattern', 'recommendation', 'trend', etc.
  insight_title TEXT NOT NULL,
  insight_content TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- When this insight becomes stale
);

COMMENT ON TABLE public.mood_insights IS 'AI-generated insights and recommendations based on mood patterns';

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_insights ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR MOOD ENTRIES
CREATE POLICY "Users can view their own mood entries"
  ON public.mood_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
  ON public.mood_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
  ON public.mood_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
  ON public.mood_entries FOR DELETE
  USING (auth.uid() = user_id);

-- 8. CREATE RLS POLICIES FOR ACHIEVEMENTS
CREATE POLICY "Users can view their own achievements"
  ON public.mood_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.mood_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. CREATE RLS POLICIES FOR INSIGHTS
CREATE POLICY "Users can view their own insights"
  ON public.mood_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights"
  ON public.mood_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON public.mood_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON public.mood_insights FOR DELETE
  USING (auth.uid() = user_id);

-- 10. CREATE PERFORMANCE INDEXES
CREATE INDEX idx_mood_entries_user_date ON public.mood_entries(user_id, date DESC);
CREATE INDEX idx_mood_entries_user_created ON public.mood_entries(user_id, created_at DESC);
CREATE INDEX idx_mood_entries_mood_score ON public.mood_entries(mood_score);
CREATE INDEX idx_mood_entries_mood_category ON public.mood_entries(mood_category);
CREATE INDEX idx_mood_entries_date ON public.mood_entries(date DESC);

CREATE INDEX idx_mood_achievements_user ON public.mood_achievements(user_id, unlocked_at DESC);
CREATE INDEX idx_mood_insights_user ON public.mood_insights(user_id, generated_at DESC);
CREATE INDEX idx_mood_insights_type ON public.mood_insights(insight_type);

-- 11. CREATE TRIGGER FOR UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_mood_entries_updated_at ON public.mood_entries;
CREATE TRIGGER update_mood_entries_updated_at
    BEFORE UPDATE ON public.mood_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 12. CREATE VIEW FOR MOOD ANALYTICS
CREATE OR REPLACE VIEW public.mood_analytics AS
SELECT 
    user_id,
    COUNT(*) as total_entries,
    AVG(mood_score) as avg_mood_score,
    AVG(energy_level) as avg_energy_level,
    AVG(sleep_hours) as avg_sleep_hours,
    AVG(stress_level) as avg_stress_level,
    AVG(anxiety_level) as avg_anxiety_level,
    AVG(productivity_score) as avg_productivity_score,
    MAX(date) as last_entry_date,
    MIN(date) as first_entry_date,
    (CURRENT_DATE - MIN(date)) as tracking_days,
    -- Calculate current streak
    (
        SELECT COUNT(*)
        FROM public.mood_entries me2
        WHERE me2.user_id = me.user_id
        AND me2.date >= CURRENT_DATE - INTERVAL '1000 days' -- Look back far enough
        AND me2.date <= CURRENT_DATE
        AND NOT EXISTS (
            SELECT 1
            FROM generate_series(me2.date::date, CURRENT_DATE, '1 day'::interval) gs(d)
            WHERE NOT EXISTS (
                SELECT 1
                FROM public.mood_entries me3
                WHERE me3.user_id = me2.user_id
                AND me3.date = gs.d::date
            )
        )
    ) as current_streak
FROM public.mood_entries me
GROUP BY user_id;

COMMENT ON VIEW public.mood_analytics IS 'Aggregated analytics and statistics for each user';

-- 13. VERIFY SETUP
SELECT 'Advanced Mood Tracker database schema setup completed successfully!' as status;

-- Display table structures for verification
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('mood_entries', 'mood_achievements', 'mood_insights')
ORDER BY table_name, ordinal_position;
