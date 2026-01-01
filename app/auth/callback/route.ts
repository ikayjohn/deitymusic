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
          await (supabase.from("users") as any).insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email!.split("@")[0],
            account_type: user.user_metadata.account_type || "ARTIST",
          })
        }

        // Update last login
        await (supabase
          .from("users") as any)
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", user.id)

        // Check if user is admin for redirect
        let finalRedirect = redirect
        try {
          const { data: userData } = await supabase
            .from("users")
            .select("account_type")
            .eq("id", user.id)
            .single()

          const isAdmin = userData?.account_type === "ADMIN" || String(userData?.account_type) === "ADMIN"
          if (isAdmin && redirect === "/dashboard") {
            finalRedirect = "/admin"
          }
        } catch (e) {
          console.warn("Failed to check admin role:", e)
        }

        return NextResponse.redirect(`${origin}${finalRedirect}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
