-- Subscriptions table for managing user plans
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('STARTER', 'PRO', 'ELITE')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_method TEXT,
  payment_reference TEXT UNIQUE,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one active subscription per user at a time
  EXCLUDE USING GIST (user_id WITH =)
  WHERE (status = 'ACTIVE')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM subscriptions
    WHERE user_id = user_uuid
    AND status = 'ACTIVE'
    AND end_date > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_current_subscription(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  plan TEXT,
  status TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  amount NUMERIC,
  currency TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.plan, s.status, s.start_date, s.end_date, s.amount, s.currency
  FROM subscriptions s
  WHERE s.user_id = user_uuid
  AND s.status = 'ACTIVE'
  AND s.end_date > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Artist limit configuration (for reference, enforced in application)
-- STARTER: 1 artist
-- PRO: 2 artists
-- ELITE: 5 artists

COMMENT ON TABLE subscriptions IS 'User subscription plans for music distribution';
COMMENT ON COLUMN subscriptions.plan IS 'Plan type: STARTER (₦10,000), PRO (₦25,000), ELITE (₦80,000)';
COMMENT ON COLUMN subscriptions.status IS 'Subscription status: ACTIVE, EXPIRED, CANCELLED';
COMMENT ON COLUMN subscriptions.end_date IS 'Subscription expiry date (1 year from start)';
COMMENT ON COLUMN subscriptions.auto_renew IS 'Whether subscription should automatically renew';
