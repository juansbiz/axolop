-- Check if there are any existing users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if there are any agencies
SELECT id, name, created_at 
FROM public.agencies 
ORDER BY created_at DESC 
LIMIT 5;

-- Check user_preferences table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_preferences';