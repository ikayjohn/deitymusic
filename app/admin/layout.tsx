import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has admin role
  const { data: userData, error } = await (supabase
    .from('users') as any)
    .select('account_type')
    .eq('id', user.id)
    .single()

  // Log for debugging
  console.log('Admin check:', {
    userId: user.id,
    userEmail: user.email,
    userData,
    error: error?.message,
    accountType: userData?.account_type,
    accountTypeString: String(userData?.account_type),
  })

  // Check if user is admin (try both direct comparison and string conversion)
  const isAdmin = userData && (
    userData.account_type === 'ADMIN' ||
    String(userData.account_type) === 'ADMIN'
  )

  if (!userData || !isAdmin) {
    console.log('User is not admin, redirecting to dashboard')
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
