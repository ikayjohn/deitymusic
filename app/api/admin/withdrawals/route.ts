import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateMockWithdrawalRequests,
  withdrawalRequestAdminSchema,
  withdrawalActionSchema,
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
    const status = searchParams.get("status")

    // TODO: Replace with actual database queries
    let withdrawals = generateMockWithdrawalRequests()

    if (status) {
      withdrawals = withdrawals.filter((w) => w.status === status)
    }

    return NextResponse.json({ withdrawals })
  } catch (error) {
    console.error("Error fetching withdrawals:", error)
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    )
  }
}

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
    const { withdrawalId, ...actionData } = body
    const validatedAction = withdrawalActionSchema.parse(actionData)

    // TODO: Replace with actual database operations
    /*
    // Update withdrawal status
    const { data: withdrawal, error: updateError } = await supabase
      .from('withdrawal_requests')
      .update({
        status: validatedAction.action === 'APPROVE' ? 'PROCESSING' :
                validatedAction.action === 'REJECT' ? 'REJECTED' : 'COMPLETED',
        processedAt: new Date().toISOString(),
        processedBy: user.id,
        reference: validatedAction.reference,
      })
      .eq('id', withdrawalId)
      .select()
      .single()

    if (updateError) throw updateError

    // Create notification for user
    await supabase
      .from('notifications')
      .insert({
        userId: withdrawal.userId,
        type: validatedAction.action === 'REJECT' ? 'WITHDRAWAL_REJECTED' : 'WITHDRAWAL_APPROVED',
        title: `Withdrawal ${validatedAction.action === 'REJECT' ? 'rejected' : 'approved'}`,
        message: validatedAction.reason || `Your withdrawal request has been ${validatedAction.action.toLowerCase()}`,
        metadata: { withdrawalId },
      })

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        action: validatedAction.action === 'APPROVE' ? 'WITHDRAWAL_APPROVED' :
                validatedAction.action === 'REJECT' ? 'WITHDRAWAL_REJECTED' : 'WITHDRAWAL_COMPLETED',
        userId: user.id,
        targetType: 'WITHDRAWAL',
        targetId: withdrawalId,
        details: `${validatedAction.action} withdrawal: ${validatedAction.reason || ''}`,
      })

    // If approved and not just marking as processing, process payment
    if (validatedAction.action === 'PROCESS') {
      // Call payment service
      await processPayment(withdrawalId)
    }
    */

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${validatedAction.action.toLowerCase()} successfully`,
    })
  } catch (error) {
    console.error("Error processing withdrawal action:", error)
    return NextResponse.json(
      { error: "Failed to process withdrawal action" },
      { status: 500 }
    )
  }
}
