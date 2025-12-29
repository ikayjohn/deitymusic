-- ============================================
-- DEITYMUSIC DISTRIBUTION PLATFORM
-- Initial Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE account_type AS ENUM ('ARTIST', 'LABEL', 'ADMIN');
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE release_type AS ENUM ('SINGLE', 'EP', 'ALBUM');
CREATE TYPE release_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'LIVE', 'TAKEDOWN', 'SCHEDULED');
CREATE TYPE contributor_role AS ENUM ('PRIMARY_ARTIST', 'FEATURED_ARTIST', 'PRODUCER', 'COMPOSER', 'LYRICIST', 'PUBLISHER', 'REMIXER', 'ENGINEER');
CREATE TYPE platform_name AS ENUM ('SPOTIFY', 'APPLE_MUSIC', 'AMAZON_MUSIC', 'YOUTUBE_MUSIC', 'TIKTOK', 'INSTAGRAM', 'DEEZER', 'TIDAL', 'PANDORA', 'NAPSTER', 'AUDIOMACK', 'BOOMPLAY');
CREATE TYPE platform_status AS ENUM ('PENDING', 'LIVE', 'REMOVED', 'ERROR');
CREATE TYPE transaction_type AS ENUM ('EARNING', 'WITHDRAWAL', 'FEE', 'ADJUSTMENT');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE withdrawal_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');
CREATE TYPE notification_type AS ENUM ('RELEASE_LIVE', 'RELEASE_APPROVED', 'RELEASE_REJECTED', 'PAYMENT_PROCESSED', 'ANALYTICS_UPDATE', 'SYSTEM_UPDATE');

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  name VARCHAR(255),
  password VARCHAR(255),
  image TEXT,

  -- Artist/Label Profile
  account_type account_type DEFAULT 'ARTIST',
  role user_role DEFAULT 'OWNER',
  artist_name VARCHAR(255),
  label_name VARCHAR(255),
  phone VARCHAR(50),
  country VARCHAR(2),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Payment
  paypal_email VARCHAR(255),
  bank_account TEXT, -- Encrypted
  payout_threshold DECIMAL(10, 2) DEFAULT 50.00,
  current_balance DECIMAL(10, 2) DEFAULT 0.00,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_type ON users(account_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- RELEASES
-- ============================================

CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Basic Info
  title VARCHAR(255) NOT NULL,
  release_type release_type NOT NULL,
  status release_status DEFAULT 'DRAFT',

  -- Identifiers
  upc VARCHAR(15) UNIQUE,
  copyright_year INTEGER NOT NULL,
  copyright_holder VARCHAR(255) NOT NULL,

  -- Artwork & Metadata
  artwork_url TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  sub_genre VARCHAR(100),

  -- Release Settings
  explicit_content BOOLEAN DEFAULT false,
  language VARCHAR(10) DEFAULT 'en',
  original_release_date DATE,
  digital_release_date DATE,

  -- Pricing
  price_tier VARCHAR(50) DEFAULT 'standard',

  -- Distribution
  territories TEXT[] DEFAULT ARRAY['*'], -- * = worldwide

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  live_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_releases_user_id ON releases(user_id);
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_upc ON releases(upc);
CREATE INDEX idx_releases_digital_release_date ON releases(digital_release_date);
CREATE INDEX idx_releases_created_at ON releases(created_at);

-- ============================================
-- TRACKS
-- ============================================

CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,

  -- Basic Info
  title VARCHAR(255) NOT NULL,
  track_number INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- in seconds

  -- Audio
  audio_file_url TEXT NOT NULL,
  audio_file_size BIGINT NOT NULL, -- in bytes
  preview_start INTEGER DEFAULT 30, -- in seconds
  preview_duration INTEGER DEFAULT 30, -- in seconds

  -- Identifiers
  isrc VARCHAR(12) UNIQUE,

  -- Metadata
  explicit_content BOOLEAN DEFAULT false,
  lyrics TEXT,
  language VARCHAR(10) DEFAULT 'en',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(release_id, track_number)
);

-- Indexes
CREATE INDEX idx_tracks_release_id ON tracks(release_id);
CREATE INDEX idx_tracks_isrc ON tracks(isrc);

-- ============================================
-- CONTRIBUTORS
-- ============================================

CREATE TABLE contributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Can be attached to release or individual track
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,

  -- Contributor Info
  name VARCHAR(255) NOT NULL,
  role contributor_role NOT NULL,
  share_percentage DECIMAL(5, 2) DEFAULT 0.00,

  -- Contact
  email VARCHAR(255),
  phone VARCHAR(50),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CHECK (release_id IS NOT NULL OR track_id IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_contributors_release_id ON contributors(release_id);
CREATE INDEX idx_contributors_track_id ON contributors(track_id);

-- ============================================
-- DISTRIBUTION PLATFORMS
-- ============================================

CREATE TABLE platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  name platform_name NOT NULL,
  status platform_status DEFAULT 'PENDING',

  -- Platform-specific IDs
  platform_release_id VARCHAR(255),
  platform_url TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  live_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(release_id, name)
);

-- Indexes
CREATE INDEX idx_platforms_release_id ON platforms(release_id);
CREATE INDEX idx_platforms_status ON platforms(status);

-- ============================================
-- ANALYTICS
-- ============================================

CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  platform platform_name,
  country VARCHAR(2),

  -- Metrics
  streams INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0.00,

  -- Period
  date DATE NOT NULL,
  period VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(release_id, track_id, platform, country, date, period)
);

-- Indexes
CREATE INDEX idx_analytics_release_id_date ON analytics(release_id, date);
CREATE INDEX idx_analytics_track_id_date ON analytics(track_id, date);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_analytics_platform ON analytics(platform);

-- ============================================
-- EARNINGS & PAYOUTS
-- ============================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Details
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'PENDING',
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Reference
  release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
  description TEXT,
  reference_id VARCHAR(255), -- External reference

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Amount
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  fee DECIMAL(10, 2) DEFAULT 0.00,

  -- Payment Method
  method VARCHAR(50) NOT NULL, -- paypal, bank_transfer
  payment_details TEXT NOT NULL, -- Encrypted

  -- Status
  status withdrawal_status DEFAULT 'PENDING',

  -- Processing
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES users(id),
  notes TEXT,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at);

-- ============================================
-- ADMIN & MODERATION
-- ============================================

CREATE TABLE rejection_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID NOT NULL UNIQUE REFERENCES releases(id) ON DELETE CASCADE,

  reason TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- quality, metadata, copyright, other
  suggested_fixes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE takedown_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,

  reason TEXT NOT NULL,
  requested_by UUID NOT NULL, -- User or Admin ID
  takedown_type VARCHAR(50) NOT NULL, -- artist_request, dmca, violation

  -- Restoration
  restored_at TIMESTAMP WITH TIME ZONE,
  restore_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_takedown_history_release_id ON takedown_history(release_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,

  read BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- SYSTEM CONFIGURATION
-- ============================================

CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_system_config_key ON system_config(key);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributors_updated_at BEFORE UPDATE ON contributors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.account_type = 'ADMIN'
    )
  );

-- Releases table policies
CREATE POLICY "Users can view own releases" ON releases
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own releases" ON releases
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own releases" ON releases
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all releases" ON releases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.account_type = 'ADMIN'
    )
  );

-- Tracks table policies
CREATE POLICY "Users can view own tracks" ON tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = tracks.release_id AND releases.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tracks for own releases" ON tracks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = tracks.release_id AND releases.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tracks" ON tracks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = tracks.release_id AND releases.user_id = auth.uid()
    )
  );

-- Contributors table policies
CREATE POLICY "Users can view own contributors" ON contributors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = contributors.release_id AND releases.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM tracks
      JOIN releases ON releases.id = tracks.release_id
      WHERE tracks.id = contributors.track_id AND releases.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own contributors" ON contributors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = contributors.release_id AND releases.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM tracks
      JOIN releases ON releases.id = tracks.release_id
      WHERE tracks.id = contributors.track_id AND releases.user_id = auth.uid()
    )
  );

-- Platforms table policies
CREATE POLICY "Users can view own platforms" ON platforms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = platforms.release_id AND releases.user_id = auth.uid()
    )
  );

-- Analytics table policies
CREATE POLICY "Users can view own analytics" ON analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM releases
      WHERE releases.id = analytics.release_id AND releases.user_id = auth.uid()
    )
  );

-- Transactions table policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

-- Withdrawal requests table policies
CREATE POLICY "Users can view own withdrawal requests" ON withdrawal_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own withdrawal requests" ON withdrawal_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications table policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- INSERT DEFAULT SYSTEM CONFIG
-- ============================================

INSERT INTO system_config (key, value, description) VALUES
  ('min_payout_threshold', '50.00', 'Minimum payout threshold in USD'),
  ('platform_fee_percentage', '15.00', 'Platform fee percentage'),
  ('max_file_size_audio', '52428800', 'Max audio file size in bytes (50MB)'),
  ('max_file_size_artwork', '10485760', 'Max artwork file size in bytes (10MB)'),
  ('min_artwork_width', '3000', 'Minimum artwork width in pixels'),
  ('min_artwork_height', '3000', 'Minimum artwork height in pixels'),
  ('supported_audio_formats', 'audio/wav,audio/mpeg', 'Supported audio file formats'),
  ('supported_artwork_formats', 'image/jpeg,image/png', 'Supported artwork file formats');

-- ============================================
-- END OF MIGRATION
-- ============================================
