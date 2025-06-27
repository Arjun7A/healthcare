# Healthcare App - Supabase Setup Guide

## Current Issue
Your Supabase API key is invalid. You need fresh credentials.

## Steps to Fix:

### Option 1: Update Existing Project
1. Go to https://supabase.com
2. Sign in to your account
3. Find your project: `dpcjzhfuifjmqnvshrtt`
4. Go to Settings → API
5. Copy the new credentials

### Option 2: Create New Project (Recommended)
1. Go to https://supabase.com
2. Click "New Project"
3. Choose a name: "healthcare-dashboard"
4. Set a strong database password
5. Select a region close to you
6. Wait for setup to complete (~2 minutes)

### After Getting New Credentials:
1. Update your `.env.local` file with:
   ```
   VITE_SUPABASE_URL=your_new_project_url
   VITE_SUPABASE_ANON_KEY=your_new_anon_key
   ```

2. Set up authentication in Supabase:
   - Go to Authentication → Settings
   - Enable Email/Password provider
   - Configure email templates (optional)

3. Create necessary tables (if needed):
   ```sql
   -- Example user profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     full_name TEXT,
     email TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Policy to allow users to read their own profile
   CREATE POLICY "Users can read own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
   
   -- Policy to allow users to update their own profile
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   ```

### Need Help?
If you're unsure about any step, I can guide you through the process step by step.
