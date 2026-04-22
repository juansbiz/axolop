-- FIX CHECKOUT ERROR - Step by step
-- Run this in Supabase SQL Editor

-- STEP 1: Check what invalid values exist
SELECT subscription_tier, COUNT(*) as count
FROM agencies
WHERE subscription_tier NOT IN ('sales', 'build', 'scale')
GROUP BY subscription_tier;

-- STEP 2: Update invalid values to 'sales' (default tier)
-- This converts 'free' and 'god' to 'sales'
UPDATE agencies
SET subscription_tier = 'sales'
WHERE subscription_tier NOT IN ('sales', 'build', 'scale');

-- STEP 3: Drop old constraint
ALTER TABLE agencies DROP CONSTRAINT IF EXISTS agencies_subscription_tier_check;

-- STEP 4: Add new constraint with only valid subscription tiers
ALTER TABLE agencies ADD CONSTRAINT agencies_subscription_tier_check
CHECK (subscription_tier IN ('sales', 'build', 'scale'));

-- STEP 5: Set default to 'sales'
ALTER TABLE agencies ALTER COLUMN subscription_tier SET DEFAULT 'sales';

-- STEP 6: Verify the fix
SELECT
    'Fix applied successfully!' as status,
    'Updated ' || COUNT(*) || ' agencies' as agencies_updated
FROM agencies
WHERE subscription_tier IN ('sales', 'build', 'scale');
