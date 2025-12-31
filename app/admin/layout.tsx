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
  const { data: userData } = await (supabase
    .from('users') as any)
    .select('account_type')
    .eq('id', user.id)
    .single()

  if (!userData || userData.account_type !== 'ADMIN') {
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
