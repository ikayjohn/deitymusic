import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateMockAdminUsers,
  usersResponseSchema,
  UserStatus,
  UserRole,
} from "@/lib/validations/admin"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    // TODO: Implement proper role checking
    // const { data: userData } = await supabase
    //   .from('users')
    //   .select('role')
    //   .eq('id', user.id)
    //   .single()
    //
    // if (userData?.role !== 'ADMIN') {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const search = searchParams.get("search")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const accountType = searchParams.get("accountType")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc"

    // TODO: Replace with actual database queries
    let users = generateMockAdminUsers(50)

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      users = users.filter(
        (u) =>
          u.email.toLowerCase().includes(searchLower) ||
          u.fullName.toLowerCase().includes(searchLower)
      )
    }

    if (role && Object.values(UserRole).includes(role as any)) {
      users = users.filter((u) => u.role === role)
    }

    if (status && Object.values(UserStatus).includes(status as any)) {
      users = users.filter((u) => u.status === status)
    }

    if (accountType) {
      users = users.filter((u) => u.accountType === accountType)
    }

    // Sort
    users.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a]
      let bVal: any = b[sortBy as keyof typeof b]

      if (sortBy === "createdAt" || sortBy === "lastLogin") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = users.slice(startIndex, endIndex)

    const response = {
      users: paginatedUsers,
      totalCount: users.length,
      page,
      pageSize,
      totalPages: Math.ceil(users.length / pageSize),
    }

    const validatedResponse = usersResponseSchema.parse(response)

    return NextResponse.json(validatedResponse)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, action, ...updates } = body

    // TODO: Replace with actual database update
    /*
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        action: 'USER_UPDATED',
        userId: user.id,
        targetType: 'USER',
        targetId: userId,
        details: `Updated user: ${action}`,
      })
    */

    return NextResponse.json({
      success: true,
      message: `User ${action} successfully`,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database deletion
    /*
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        action: 'USER_DELETED',
        userId: user.id,
        targetType: 'USER',
        targetId: userId,
        details: `Deleted user ${userId}`,
      })
    */

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
