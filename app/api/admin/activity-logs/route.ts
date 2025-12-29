import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateMockActivityLogs,
  activityLogsResponseSchema,
  ActivityLogAction,
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

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const action = searchParams.get("action")
    const targetType = searchParams.get("targetType")
    const userId = searchParams.get("userId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // TODO: Replace with actual database queries
    let logs = generateMockActivityLogs(100)

    // Apply filters
    if (action && Object.values(ActivityLogAction).includes(action as any)) {
      logs = logs.filter((l) => l.action === action)
    }

    if (targetType) {
      logs = logs.filter((l) => l.targetType === targetType)
    }

    if (userId) {
      logs = logs.filter((l) => l.userId === userId)
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0)
      const end = endDate ? new Date(endDate) : new Date()

      logs = logs.filter((log) => {
        const logDate = new Date(log.createdAt)
        return logDate >= start && logDate <= end
      })
    }

    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedLogs = logs.slice(startIndex, endIndex)

    const response = {
      logs: paginatedLogs,
      totalCount: logs.length,
      page,
      pageSize,
      totalPages: Math.ceil(logs.length / pageSize),
    }

    const validatedResponse = activityLogsResponseSchema.parse(response)

    return NextResponse.json(validatedResponse)
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    )
  }
}
