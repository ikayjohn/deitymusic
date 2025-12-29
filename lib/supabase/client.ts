/**
 * Supabase Browser Client
 *
 * This client is used in client components for browser-side operations.
 * It uses cookies to persist the session (for SSR/middleware compatibility).
 */

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export const createBrowserClient = () => {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
