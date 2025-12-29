import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/dashboard"

  if (code) {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Update last login
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user profile exists, create if not (for OAuth signups)
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single()

        if (!existingUser) {
          // Create user profile for OAuth signup
          await supabase.from("users").insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email!.split("@")[0],
            account_type: user.user_metadata.account_type || "ARTIST",
          })
        }

        // Update last login
        await supabase
          .from("users")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", user.id)
      }

      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
