-- Migration: Add Daily Questions Functionality Only
-- This migration adds only the daily questions tracking without recreating existing structures

-- Add daily question tracking columns to existing profiles table
DO $$ 
BEGIN
    -- Add daily_questions_used column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'daily_questions_used') THEN
        ALTER TABLE public.profiles ADD COLUMN daily_questions_used INTEGER DEFAULT 0;
    END IF;
    
    -- Add last_question_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'last_question_date') THEN
        ALTER TABLE public.profiles ADD COLUMN last_question_date DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- Create index for efficient daily question queries (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_daily_questions ON public.profiles(last_question_date, daily_questions_used);

-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a clean function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      subscription_tier,
      tokens_used,
      tokens_limit,
      daily_questions_used,
      last_question_date
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      'free',
      0,
      100,
      0,
      CURRENT_DATE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the single trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all existing users have profiles with daily questions columns
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  subscription_tier,
  tokens_used,
  tokens_limit,
  daily_questions_used,
  last_question_date
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
  'free',
  0,
  100,
  0,
  CURRENT_DATE
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Update existing profiles to have today's date for last_question_date if NULL
UPDATE public.profiles 
SET last_question_date = CURRENT_DATE 
WHERE last_question_date IS NULL;
