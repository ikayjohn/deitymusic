import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ReleaseDetailsClient } from "./release-details-client"

export default async function ReleaseDetailsPage({
 params,
}: {
 params: { id: string }
}) {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 return null // Middleware handles redirect
 }

 // Fetch release with all related data
 const { data: release, error } = await supabase
 .from("releases")
 .select(`
 *,
 tracks(
 id,
 title,
 duration,
 explicit_content,
 isrc
 ),
 contributors(
 id,
 name,
 role,
 share_percentage
 ),
 platforms(
 id,
 name,
 status,
 platform_release_id,
 platform_url,
 live_at
 )
 `)
 .eq("id", params.id)
 .eq("user_id", user.id)
 .single()

 if (error || !release) {
 notFound()
 }

 return <ReleaseDetailsClient release={release} />
}
