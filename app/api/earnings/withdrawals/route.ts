import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  withdrawalRequestSchema,
  WithdrawalStatus,
  TransactionType,
} from "@/lib/validations/earnings"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = withdrawalRequestSchema.parse(body)

    // Check if user has sufficient balance
    // TODO: Replace with actual database query
    // const { data: userData } = await supabase
    //   .from('users')
    //   .select('currentBalance')
    //   .eq('id', user.id)
    //   .single()

    // For now, use mock balance
    const currentBalance = 1647.50 // Mock balance in USD

    if ((validatedData as any).amount > currentBalance) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // Create withdrawal request
    // TODO: Replace with actual database insertion
    /*
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawal_requests')
      .insert({
        userId: user.id,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod,
        paymentDetails: validatedData.paymentDetails,
        status: WithdrawalStatus.PENDING,
      })
      .select()
      .single()

    if (withdrawalError) throw withdrawalError
    */

    // Create transaction record
    /*
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        userId: user.id,
        type: TransactionType.WITHDRAWAL,
        amount: -validatedData.amount,
        description: `Withdrawal to ${validatedData.paymentMethod}`,
        status: WithdrawalStatus.PENDING,
        metadata: {
          withdrawalId: withdrawal.id,
          reference: `WD-${Date.now()}`,
        },
      })

    if (transactionError) throw transactionError
    */

    // Mock response
    const withdrawal = {
      id: `wd-${Date.now()}`,
      amount: (validatedData as any).amount,
      paymentMethod: (validatedData as any).paymentMethod,
      status: WithdrawalStatus.PENDING,
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }

    return NextResponse.json({
      success: true,
      withdrawal,
      message:
        "Withdrawal request submitted successfully. You should receive your funds within 2-3 business days.",
    })
  } catch (error) {
    console.error("Error creating withdrawal request:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    )
  }
}

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
    const status = searchParams.get("status")

    // TODO: Replace with actual database query
    /*
    let query = supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: withdrawals, error } = await query

    if (error) throw error
    */

    // Mock response
    const withdrawals = [
      {
        id: "wd-1",
        amountUSD: 161.29,
        amountNGN: 250000,
        paymentMethod: "BANK_TRANSFER",
        status: WithdrawalStatus.COMPLETED,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "wd-2",
        amountUSD: 96.77,
        amountNGN: 150000,
        paymentMethod: "BANK_TRANSFER",
        status: WithdrawalStatus.PROCESSING,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    return NextResponse.json({ withdrawals })
  } catch (error) {
    console.error("Error fetching withdrawals:", error)
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    )
  }
}
