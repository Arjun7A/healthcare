-- Sample data for testing mood analytics
-- Replace 'your-user-id-here' with your actual user ID from auth.users
-- Run this after setting up the main database schema

-- First, get your user ID by running:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then replace the user ID below and run this script:

INSERT INTO mood_entries (user_id, date, mood, emotions, activities, notes) VALUES
-- Last 2 weeks of sample data
('your-user-id-here', CURRENT_DATE - INTERVAL '14 days', 3, ARRAY['calm', 'content'], ARRAY['work', 'exercise'], 'Started a new project at work'),
('your-user-id-here', CURRENT_DATE - INTERVAL '13 days', 4, ARRAY['happy', 'energetic'], ARRAY['friends', 'hobbies'], 'Great weekend with friends'),
('your-user-id-here', CURRENT_DATE - INTERVAL '12 days', 2, ARRAY['anxious', 'tired'], ARRAY['work', 'stress'], 'Feeling overwhelmed with deadlines'),
('your-user-id-here', CURRENT_DATE - INTERVAL '11 days', 4, ARRAY['relaxed', 'grateful'], ARRAY['family', 'exercise'], 'Nice family dinner and evening walk'),
('your-user-id-here', CURRENT_DATE - INTERVAL '10 days', 3, ARRAY['neutral', 'focused'], ARRAY['work', 'reading'], 'Regular workday, caught up on reading'),
('your-user-id-here', CURRENT_DATE - INTERVAL '9 days', 5, ARRAY['excited', 'happy'], ARRAY['celebration', 'friends'], 'Celebrated a major achievement!'),
('your-user-id-here', CURRENT_DATE - INTERVAL '8 days', 3, ARRAY['calm', 'thoughtful'], ARRAY['reflection', 'nature'], 'Spent time outdoors, feeling peaceful'),
('your-user-id-here', CURRENT_DATE - INTERVAL '7 days', 4, ARRAY['optimistic', 'motivated'], ARRAY['goals', 'planning'], 'Planning for the week ahead'),
('your-user-id-here', CURRENT_DATE - INTERVAL '6 days', 2, ARRAY['stressed', 'worried'], ARRAY['work', 'health'], 'Dealing with some health concerns'),
('your-user-id-here', CURRENT_DATE - INTERVAL '5 days', 3, ARRAY['improving', 'hopeful'], ARRAY['self-care', 'meditation'], 'Focused on self-care today'),
('your-user-id-here', CURRENT_DATE - INTERVAL '4 days', 4, ARRAY['balanced', 'productive'], ARRAY['work', 'exercise'], 'Found a good work-life balance'),
('your-user-id-here', CURRENT_DATE - INTERVAL '3 days', 3, ARRAY['tired', 'content'], ARRAY['rest', 'family'], 'Quiet day with family'),
('your-user-id-here', CURRENT_DATE - INTERVAL '2 days', 5, ARRAY['joyful', 'grateful'], ARRAY['celebration', 'love'], 'Amazing day with loved ones'),
('your-user-id-here', CURRENT_DATE - INTERVAL '1 day', 4, ARRAY['confident', 'determined'], ARRAY['goals', 'work'], 'Making progress on important goals'),
('your-user-id-here', CURRENT_DATE, 4, ARRAY['optimistic', 'energetic'], ARRAY['planning', 'future'], 'Excited about upcoming opportunities');

-- Verify the data was inserted
SELECT 
    COUNT(*) as total_entries,
    AVG(mood) as average_mood,
    MIN(date) as earliest_date,
    MAX(date) as latest_date
FROM mood_entries 
WHERE user_id = 'your-user-id-here';

-- View the data
SELECT date, mood, emotions, activities, notes
FROM mood_entries 
WHERE user_id = 'your-user-id-here'
ORDER BY date DESC
LIMIT 10;
