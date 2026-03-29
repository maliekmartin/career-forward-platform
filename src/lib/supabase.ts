import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create clients only if configured
let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  supabaseAdminClient = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : supabaseClient;
} else {
  console.warn('Supabase not configured - storage features will be disabled');
}

// Export clients (may be null if not configured)
export const supabase = supabaseClient;
export const supabaseAdmin = supabaseAdminClient;

// Helper to check if Supabase is ready
function requireSupabase(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }
  return supabaseAdmin;
}

// ============================================================
// STORAGE HELPERS
// ============================================================

export type StorageBucket = 'avatars' | 'resumes' | 'cover-letters' | 'training-resources' | 'workforce-branding';

export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  options?: { contentType?: string; upsert?: boolean }
): Promise<{ url: string; path: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Storage not configured' };

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { error: error.message };
  }

  const isPublicBucket = ['avatars', 'training-resources', 'workforce-branding'].includes(bucket);

  if (isPublicBucket) {
    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);
    return { url: urlData.publicUrl, path: data.path };
  } else {
    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(data.path, 3600);

    if (urlError) return { error: urlError.message };
    return { url: urlData.signedUrl, path: data.path };
  }
}

export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Storage not configured' };

  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Storage not configured' };

  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  if (!supabaseAdmin) return '';
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listFiles(
  bucket: StorageBucket,
  folder?: string
): Promise<{ files: { name: string; id: string | null; created_at: string | null }[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Storage not configured' };

  const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder);
  if (error) return { error: error.message };

  return {
    files: data.map((f) => ({
      name: f.name,
      id: f.id,
      created_at: f.created_at,
    })),
  };
}

// ============================================================
// AI CONVERSATION HELPERS
// ============================================================

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  summary?: string;
  message_count: number;
  total_tokens_used: number;
  is_archived: boolean;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_in: number;
  tokens_out: number;
  model?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export async function createAIConversation(
  userId: string,
  title?: string
): Promise<{ conversation: AIConversation } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin
    .from('ai_conversations')
    .insert({ user_id: userId, title: title || 'New Conversation' })
    .select()
    .single();

  if (error) return { error: error.message };
  return { conversation: data };
}

export async function getAIConversations(
  userId: string,
  options?: { limit?: number; includeArchived?: boolean }
): Promise<{ conversations: AIConversation[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  let query = supabaseAdmin
    .from('ai_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false });

  if (!options?.includeArchived) query = query.eq('is_archived', false);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { conversations: data };
}

export async function getAIMessages(
  conversationId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ messages: AIMessage[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  let query = supabaseAdmin
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 50) - 1);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { messages: data };
}

export async function addAIMessage(
  conversationId: string,
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokens_in?: number;
    tokens_out?: number;
    model?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{ message: AIMessage } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin
    .from('ai_messages')
    .insert({ conversation_id: conversationId, ...message })
    .select()
    .single();

  if (error) return { error: error.message };
  return { message: data };
}

export async function deleteAIConversation(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('ai_conversations')
    .delete()
    .eq('id', conversationId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleArchiveConversation(
  conversationId: string,
  archived: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('ai_conversations')
    .update({ is_archived: archived })
    .eq('id', conversationId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================================
// DIRECT MESSAGING HELPERS
// ============================================================

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface MessageThread {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_id?: string;
  last_message_at: string;
  unread_count_1: number;
  unread_count_2: number;
}

export async function sendDirectMessage(
  senderId: string,
  recipientId: string,
  content: string,
  options?: { messageType?: 'text' | 'file' | 'system'; fileUrl?: string; fileName?: string; fileSize?: number }
): Promise<{ message: DirectMessage } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin
    .from('direct_messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      message_type: options?.messageType || 'text',
      file_url: options?.fileUrl,
      file_name: options?.fileName,
      file_size: options?.fileSize,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { message: data };
}

export async function getDirectMessages(
  userId: string,
  otherUserId: string,
  options?: { limit?: number; before?: string }
): Promise<{ messages: DirectMessage[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  let query = supabaseAdmin
    .from('direct_messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: false });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.before) query = query.lt('created_at', options.before);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { messages: data.reverse() };
}

export async function getMessageThreads(
  userId: string
): Promise<{ threads: MessageThread[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin
    .from('message_threads')
    .select('*')
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) return { error: error.message };
  return { threads: data };
}

export async function markMessagesAsRead(
  userId: string,
  senderId: string
): Promise<{ count: number } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin.rpc('mark_messages_read', {
    p_user_id: userId,
    p_sender_id: senderId,
  });

  if (error) return { error: error.message };
  return { count: data };
}

export async function getUnreadMessageCount(
  userId: string
): Promise<{ count: number } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin.rpc('get_unread_message_count', {
    p_user_id: userId,
  });

  if (error) return { error: error.message };
  return { count: data };
}

// ============================================================
// FILE TRACKING HELPERS
// ============================================================

export interface FileUpload {
  id: string;
  user_id: string;
  bucket: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  purpose: string;
  metadata?: Record<string, unknown>;
  is_processed: boolean;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_error?: string;
  created_at: string;
}

export async function trackFileUpload(
  userId: string,
  file: {
    bucket: StorageBucket;
    filePath: string;
    fileName: string;
    fileSize?: number;
    mimeType?: string;
    purpose: 'avatar' | 'resume' | 'cover_letter' | 'training' | 'branding' | 'message_attachment' | 'other';
    metadata?: Record<string, unknown>;
  }
): Promise<{ upload: FileUpload } | { error: string }> {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured - skipping file tracking');
    return { error: 'Storage not configured' };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('file_uploads')
      .insert({
        user_id: userId,
        bucket: file.bucket,
        file_path: file.filePath,
        file_name: file.fileName,
        file_size: file.fileSize,
        mime_type: file.mimeType,
        purpose: file.purpose,
        metadata: file.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.warn('File tracking failed (non-fatal):', error.message);
      return { error: error.message };
    }

    return { upload: data };
  } catch (err) {
    console.warn('File tracking error (non-fatal):', err);
    return { error: 'Tracking failed' };
  }
}

export async function getUserFiles(
  userId: string,
  purpose?: string
): Promise<{ files: FileUpload[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  let query = supabaseAdmin
    .from('file_uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (purpose) query = query.eq('purpose', purpose);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { files: data };
}

// ============================================================
// NOTIFICATION HELPERS
// ============================================================

export interface RealtimeNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  expires_at?: string;
  created_at: string;
}

export async function createNotification(
  userId: string,
  notification: {
    type: 'message' | 'achievement' | 'reminder' | 'system' | 'coach_note';
    title: string;
    body?: string;
    data?: Record<string, unknown>;
    expiresAt?: string;
  }
): Promise<{ notification: RealtimeNotification } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  const { data, error } = await supabaseAdmin
    .from('realtime_notifications')
    .insert({
      user_id: userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      expires_at: notification.expiresAt,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { notification: data };
}

export async function getNotifications(
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number }
): Promise<{ notifications: RealtimeNotification[] } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase not configured' };

  let query = supabaseAdmin
    .from('realtime_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) query = query.eq('is_read', false);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { notifications: data };
}

export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('realtime_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================================
// ANALYTICS HELPERS
// ============================================================

export async function trackEvent(
  userId: string,
  event: {
    eventType: string;
    eventName: string;
    eventData?: Record<string, unknown>;
    pagePath?: string;
    sessionId?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin.from('user_analytics').insert({
    user_id: userId,
    session_id: event.sessionId,
    event_type: event.eventType,
    event_name: event.eventName,
    event_data: event.eventData || {},
    page_path: event.pagePath,
  });

  if (error) {
    console.error('Analytics tracking error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
