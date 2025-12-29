-- Confirm all existing user emails (for development/testing)
-- Run this after disabling email verification in Supabase settings

-- Method 1: Update email_confirmed_at to a past timestamp (marks as confirmed)
UPDATE auth.users
SET email_confirmed_at = now() - interval '1 day'
WHERE email_confirmed_at IS NULL;

-- Alternative Method 2: Set raw_app_meta_data to mark as confirmed
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{provider}',
  '"email"'
)
WHERE raw_app_meta_data->>'provider' IS NULL;

-- Check the results
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_app_meta_data->>'provider' as provider
FROM auth.users;
