/**
 * Supabase Database Types
 *
 * These types are generated from the database schema.
 * They provide type safety for all database operations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          email_verified: string | null
          name: string | null
          password: string | null
          image: string | null
          account_type: 'ARTIST' | 'LABEL' | 'ADMIN'
          role: 'OWNER' | 'ADMIN' | 'MEMBER'
          artist_name: string | null
          label_name: string | null
          phone: string | null
          country: string | null
          currency: string
          paypal_email: string | null
          bank_account: string | null
          payout_threshold: number
          current_balance: number
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['users']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<
            Database['public']['Tables']['users']['Insert'],
            'id' | 'email'
          >
        >
      }
      releases: {
        Row: {
          id: string
          user_id: string
          title: string
          release_type: 'SINGLE' | 'EP' | 'ALBUM'
          status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'LIVE' | 'TAKEDOWN' | 'SCHEDULED'
          upc: string | null
          copyright_year: number
          copyright_holder: string
          artwork_url: string
          genre: string
          sub_genre: string | null
          explicit_content: boolean
          language: string
          original_release_date: string | null
          digital_release_date: string | null
          price_tier: string
          territories: string[]
          created_at: string
          updated_at: string
          submitted_at: string | null
          live_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['releases']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['releases']['Insert'], 'id'>
        >
      }
      tracks: {
        Row: {
          id: string
          release_id: string
          title: string
          track_number: number
          duration: number
          audio_file_url: string
          audio_file_size: number
          preview_start: number
          preview_duration: number
          isrc: string | null
          explicit_content: boolean
          lyrics: string | null
          language: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['tracks']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['tracks']['Insert'], 'id'>
        >
      }
      contributors: {
        Row: {
          id: string
          release_id: string | null
          track_id: string | null
          name: string
          role: 'PRIMARY_ARTIST' | 'FEATURED_ARTIST' | 'PRODUCER' | 'COMPOSER' | 'LYRICIST' | 'PUBLISHER' | 'REMIXER' | 'ENGINEER'
          share_percentage: number
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['contributors']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['contributors']['Insert'], 'id'>
        >
      }
      platforms: {
        Row: {
          id: string
          release_id: string
          name: 'SPOTIFY' | 'APPLE_MUSIC' | 'AMAZON_MUSIC' | 'YOUTUBE_MUSIC' | 'TIKTOK' | 'INSTAGRAM' | 'DEEZER' | 'TIDAL' | 'PANDORA' | 'NAPSTER' | 'AUDIOMACK' | 'BOOMPLAY'
          status: 'PENDING' | 'LIVE' | 'REMOVED' | 'ERROR'
          platform_release_id: string | null
          platform_url: string | null
          created_at: string
          updated_at: string
          live_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['platforms']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['platforms']['Insert'], 'id'>
        >
      }
      analytics: {
        Row: {
          id: string
          release_id: string
          track_id: string | null
          platform: 'SPOTIFY' | 'APPLE_MUSIC' | 'AMAZON_MUSIC' | 'YOUTUBE_MUSIC' | 'TIKTOK' | 'INSTAGRAM' | 'DEEZER' | 'TIDAL' | 'PANDORA' | 'NAPSTER' | 'AUDIOMACK' | 'BOOMPLAY' | null
          country: string | null
          streams: number
          downloads: number
          revenue: number
          date: string
          period: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['analytics']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['analytics']['Insert'], 'id'>
        >
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'EARNING' | 'WITHDRAWAL' | 'FEE' | 'ADJUSTMENT'
          status: 'PENDING' | 'COMPLETED' | 'FAILED'
          amount: number
          currency: string
          release_id: string | null
          description: string | null
          reference_id: string | null
          created_at: string
          updated_at: string
          processed_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['transactions']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['transactions']['Insert'], 'id'>
        >
      }
      withdrawal_requests: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          fee: number
          method: string
          payment_details: string
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
          processed_at: string | null
          processed_by: string | null
          notes: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['withdrawal_requests']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['withdrawal_requests']['Insert'], 'id'>
        >
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'RELEASE_LIVE' | 'RELEASE_APPROVED' | 'RELEASE_REJECTED' | 'PAYMENT_PROCESSED' | 'ANALYTICS_UPDATE' | 'SYSTEM_UPDATE'
          title: string
          message: string
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['notifications']['Row'],
          'id' | 'created_at'
        > & {
          id?: string
          created_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['notifications']['Insert'], 'id'>
        >
      }
      rejection_reasons: {
        Row: {
          id: string
          release_id: string
          reason: string
          category: string
          suggested_fixes: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['rejection_reasons']['Row'],
          'id' | 'created_at'
        > & {
          id?: string
          created_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['rejection_reasons']['Insert'], 'id'>
        >
      }
      takedown_history: {
        Row: {
          id: string
          release_id: string
          reason: string
          requested_by: string
          takedown_type: string
          restored_at: string | null
          restore_reason: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['takedown_history']['Row'],
          'id' | 'created_at'
        > & {
          id?: string
          created_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['takedown_history']['Insert'], 'id'>
        >
      }
      system_config: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['system_config']['Row'],
          'id' | 'updated_at'
        > & {
          id?: string
          updated_at?: string
        }
        Update: Partial<
          Omit<Database['public']['Tables']['system_config']['Insert'], 'id'>
        >
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: 'ARTIST' | 'LABEL' | 'ADMIN'
      user_role: 'OWNER' | 'ADMIN' | 'MEMBER'
      release_type: 'SINGLE' | 'EP' | 'ALBUM'
      release_status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'LIVE' | 'TAKEDOWN' | 'SCHEDULED'
      contributor_role: 'PRIMARY_ARTIST' | 'FEATURED_ARTIST' | 'PRODUCER' | 'COMPOSER' | 'LYRICIST' | 'PUBLISHER' | 'REMIXER' | 'ENGINEER'
      platform_name: 'SPOTIFY' | 'APPLE_MUSIC' | 'AMAZON_MUSIC' | 'YOUTUBE_MUSIC' | 'TIKTOK' | 'INSTAGRAM' | 'DEEZER' | 'TIDAL' | 'PANDORA' | 'NAPSTER' | 'AUDIOMACK' | 'BOOMPLAY'
      platform_status: 'PENDING' | 'LIVE' | 'REMOVED' | 'ERROR'
      transaction_type: 'EARNING' | 'WITHDRAWAL' | 'FEE' | 'ADJUSTMENT'
      transaction_status: 'PENDING' | 'COMPLETED' | 'FAILED'
      withdrawal_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
      notification_type: 'RELEASE_LIVE' | 'RELEASE_APPROVED' | 'RELEASE_REJECTED' | 'PAYMENT_PROCESSED' | 'ANALYTICS_UPDATE' | 'SYSTEM_UPDATE'
    }
  }
}

// Helper types for common operations
export type Tables = Database['public']['Tables']
export type Users = Tables['users']['Row']
export type Releases = Tables['releases']['Row']
export type Tracks = Tables['tracks']['Row']
export type Contributors = Tables['contributors']['Row']
export type Platforms = Tables['platforms']['Row']
export type Analytics = Tables['analytics']['Row']
export type Transactions = Tables['transactions']['Row']
export type WithdrawalRequests = Tables['withdrawal_requests']['Row']
export type Notifications = Tables['notifications']['Row']
