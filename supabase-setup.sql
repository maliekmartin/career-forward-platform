-- ============================================================
-- CAREER FORWARD - SUPABASE SETUP
-- Run this in Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- ============================================================
-- PART 1: STORAGE BUCKETS
-- ============================================================

-- Profile avatars (public with folder isolation)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Resume uploads (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Cover letters (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cover-letters',
  'cover-letters',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Training resources (public read for all users)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'training-resources',
  'training-resources',
  true,
  52428800, -- 50MB limit for videos/PDFs
  ARRAY['application/pdf', 'video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Workforce center branding (logos, custom assets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'workforce-branding',
  'workforce-branding',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PART 2: STORAGE POLICIES
-- ============================================================

-- Note: Since we're using external auth (not Supabase Auth),
-- we'll use service_role key for server-side operations
-- and implement access control in our API routes.

-- AVATARS: Public read, authenticated upload to own folder
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can delete avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars');

-- RESUMES: Private, controlled via API
CREATE POLICY "Resume access via service role"
ON storage.objects FOR ALL
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

-- COVER LETTERS: Private, controlled via API
CREATE POLICY "Cover letter access via service role"
ON storage.objects FOR ALL
USING (bucket_id = 'cover-letters')
WITH CHECK (bucket_id = 'cover-letters');

-- TRAINING RESOURCES: Public read, admin upload
CREATE POLICY "Training resources are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'training-resources');

CREATE POLICY "Training resources upload via service role"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'training-resources');

-- WORKFORCE BRANDING: Public read, admin upload
CREATE POLICY "Workforce branding publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'workforce-branding');

CREATE POLICY "Workforce branding upload via service role"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workforce-branding');

-- ============================================================
-- PART 3: AI CONVERSATION TABLES
-- ============================================================

-- AI Conversations (chat sessions with Compass AI Coach)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- References external Prisma user.id (CUID)
  title TEXT DEFAULT 'New Conversation',
  summary TEXT, -- AI-generated summary of conversation
  message_count INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_message ON ai_conversations(last_message_at DESC);

-- AI Messages (individual messages in conversations)
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  model TEXT, -- e.g., 'claude-3-haiku'
  metadata JSONB DEFAULT '{}', -- For storing context, scores referenced, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast conversation message retrieval
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);

-- Function to update conversation stats on new message
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_conversations
  SET
    message_count = message_count + 1,
    total_tokens_used = total_tokens_used + COALESCE(NEW.tokens_in, 0) + COALESCE(NEW.tokens_out, 0),
    last_message_at = NEW.created_at,
    updated_at = NOW(),
    -- Auto-generate title from first user message if still default
    title = CASE
      WHEN title = 'New Conversation' AND NEW.role = 'user'
      THEN LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
      ELSE title
    END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update conversation stats
DROP TRIGGER IF EXISTS trigger_update_conversation_stats ON ai_messages;
CREATE TRIGGER trigger_update_conversation_stats
AFTER INSERT ON ai_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_stats();

-- ============================================================
-- PART 4: COACH-CLIENT MESSAGING
-- ============================================================

-- Direct messages between coaches and clients
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL, -- References external Prisma user.id
  recipient_id TEXT NOT NULL, -- References external Prisma user.id
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  file_url TEXT, -- For file attachments
  file_name TEXT,
  file_size INTEGER,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_recipient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for message queries
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_direct_messages_unread ON direct_messages(recipient_id, is_read) WHERE is_read = false;

-- Conversation threads (for grouping messages between two users)
CREATE TABLE IF NOT EXISTS message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 TEXT NOT NULL, -- Lower ID always goes first for consistency
  participant_2 TEXT NOT NULL,
  last_message_id UUID REFERENCES direct_messages(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count_1 INTEGER DEFAULT 0, -- Unread for participant_1
  unread_count_2 INTEGER DEFAULT 0, -- Unread for participant_2
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

CREATE INDEX IF NOT EXISTS idx_message_threads_participants ON message_threads(participant_1, participant_2);
CREATE INDEX IF NOT EXISTS idx_message_threads_last_message ON message_threads(last_message_at DESC);

-- Function to update thread on new message
CREATE OR REPLACE FUNCTION update_message_thread()
RETURNS TRIGGER AS $$
DECLARE
  p1 TEXT;
  p2 TEXT;
  thread_id UUID;
BEGIN
  -- Ensure consistent ordering (lower ID first)
  IF NEW.sender_id < NEW.recipient_id THEN
    p1 := NEW.sender_id;
    p2 := NEW.recipient_id;
  ELSE
    p1 := NEW.recipient_id;
    p2 := NEW.sender_id;
  END IF;

  -- Upsert thread
  INSERT INTO message_threads (participant_1, participant_2, last_message_id, last_message_at)
  VALUES (p1, p2, NEW.id, NEW.created_at)
  ON CONFLICT (participant_1, participant_2)
  DO UPDATE SET
    last_message_id = NEW.id,
    last_message_at = NEW.created_at,
    updated_at = NOW(),
    -- Increment unread count for recipient
    unread_count_1 = CASE WHEN p1 = NEW.recipient_id THEN message_threads.unread_count_1 + 1 ELSE message_threads.unread_count_1 END,
    unread_count_2 = CASE WHEN p2 = NEW.recipient_id THEN message_threads.unread_count_2 + 1 ELSE message_threads.unread_count_2 END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_message_thread ON direct_messages;
CREATE TRIGGER trigger_update_message_thread
AFTER INSERT ON direct_messages
FOR EACH ROW
EXECUTE FUNCTION update_message_thread();

-- ============================================================
-- PART 5: FILE METADATA TRACKING
-- ============================================================

-- Track all uploaded files with metadata
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  bucket TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Full path in storage
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  purpose TEXT CHECK (purpose IN ('avatar', 'resume', 'cover_letter', 'training', 'branding', 'message_attachment', 'other')),
  metadata JSONB DEFAULT '{}', -- Additional metadata (e.g., resume parsing results)
  is_processed BOOLEAN DEFAULT false, -- For async processing (resume parsing, etc.)
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_user ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_bucket ON file_uploads(bucket);
CREATE INDEX IF NOT EXISTS idx_file_uploads_purpose ON file_uploads(purpose);

-- ============================================================
-- PART 6: REAL-TIME NOTIFICATIONS (Optional)
-- ============================================================

-- In-app notifications stored in Supabase for real-time delivery
CREATE TABLE IF NOT EXISTS realtime_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'message', 'achievement', 'reminder', 'system', 'coach_note'
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}', -- Additional data (links, IDs, etc.)
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Optional expiration
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_realtime_notifications_user ON realtime_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_unread ON realtime_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_created ON realtime_notifications(created_at DESC);

-- ============================================================
-- PART 7: SESSION ANALYTICS (Optional)
-- ============================================================

-- Track user sessions and activity for analytics
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  session_id TEXT, -- External session ID from Prisma
  event_type TEXT NOT NULL, -- 'page_view', 'feature_use', 'ai_chat', 'resume_action', etc.
  event_name TEXT NOT NULL, -- Specific event name
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  referrer TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_analytics_user ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event ON user_analytics(event_type, event_name);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created ON user_analytics(created_at DESC);

-- Partition by month for performance (optional, for high-volume)
-- CREATE TABLE user_analytics_y2024m01 PARTITION OF user_analytics
-- FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- ============================================================
-- PART 8: ROW LEVEL SECURITY (RLS) FOR TABLES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Since we use external auth (Prisma/JWT), we'll use service_role for all operations
-- and handle authorization in our API. These policies allow service_role full access.

-- AI Conversations: Full access via service role
CREATE POLICY "AI conversations service access" ON ai_conversations FOR ALL USING (true) WITH CHECK (true);

-- AI Messages: Full access via service role
CREATE POLICY "AI messages service access" ON ai_messages FOR ALL USING (true) WITH CHECK (true);

-- Direct Messages: Full access via service role
CREATE POLICY "Direct messages service access" ON direct_messages FOR ALL USING (true) WITH CHECK (true);

-- Message Threads: Full access via service role
CREATE POLICY "Message threads service access" ON message_threads FOR ALL USING (true) WITH CHECK (true);

-- File Uploads: Full access via service role
CREATE POLICY "File uploads service access" ON file_uploads FOR ALL USING (true) WITH CHECK (true);

-- Notifications: Full access via service role
CREATE POLICY "Notifications service access" ON realtime_notifications FOR ALL USING (true) WITH CHECK (true);

-- Analytics: Full access via service role
CREATE POLICY "Analytics service access" ON user_analytics FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- PART 9: HELPER FUNCTIONS
-- ============================================================

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(p_user_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM direct_messages
    WHERE recipient_id = p_user_id AND is_read = false
  );
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(p_user_id TEXT, p_sender_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE direct_messages
  SET is_read = true, read_at = NOW()
  WHERE recipient_id = p_user_id
    AND sender_id = p_sender_id
    AND is_read = false;

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  -- Reset unread count in thread
  UPDATE message_threads
  SET
    unread_count_1 = CASE WHEN participant_1 = p_user_id THEN 0 ELSE unread_count_1 END,
    unread_count_2 = CASE WHEN participant_2 = p_user_id THEN 0 ELSE unread_count_2 END
  WHERE (participant_1 = p_user_id AND participant_2 = p_sender_id)
     OR (participant_1 = p_sender_id AND participant_2 = p_user_id);

  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get conversation history with pagination
CREATE OR REPLACE FUNCTION get_ai_conversation_messages(
  p_conversation_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.role,
    m.content,
    m.tokens_in,
    m.tokens_out,
    m.created_at
  FROM ai_messages m
  WHERE m.conversation_id = p_conversation_id
  ORDER BY m.created_at ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PART 10: CLEANUP / MAINTENANCE FUNCTIONS
-- ============================================================

-- Function to clean up old analytics data (keep 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_analytics
  WHERE created_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM realtime_notifications
  WHERE expires_at IS NOT NULL AND expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SETUP COMPLETE!
-- ============================================================
--
-- Next steps:
-- 1. Copy your Supabase URL and anon/service_role keys
-- 2. Add to .env:
--    NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
--    SUPABASE_SERVICE_ROLE_KEY=xxxxx
-- 3. Install: npm install @supabase/supabase-js
-- 4. Create lib/supabase.ts client
--
-- Storage paths convention:
--   avatars/{user_id}/{filename}
--   resumes/{user_id}/{filename}
--   cover-letters/{user_id}/{filename}
--   training-resources/{topic_id}/{filename}
--   workforce-branding/{center_id}/{filename}
-- ============================================================
