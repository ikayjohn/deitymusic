import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateMockTransactions,
  transactionsResponseSchema,
  TransactionType,
} from "@/lib/validations/earnings"

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
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // TODO: Replace with actual database queries
    const allTransactions = generateMockTransactions(50)

    // Apply filters
    let filteredTransactions = allTransactions

    if (type && Object.values(TransactionType).includes(type as any)) {
      filteredTransactions = filteredTransactions.filter((t) => t.type === type)
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.status === status
      )
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0)
      const end = endDate ? new Date(endDate) : new Date()

      filteredTransactions = filteredTransactions.filter((txn) => {
        const txnDate = new Date(txn.createdAt)
        return txnDate >= start && txnDate <= end
      })
    }

    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedTransactions = filteredTransactions.slice(
      startIndex,
      endIndex
    )

    const response = {
      transactions: paginatedTransactions,
      totalCount: filteredTransactions.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredTransactions.length / pageSize),
    }

    const validatedResponse = transactionsResponseSchema.parse(response)

    return NextResponse.json(validatedResponse)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}
