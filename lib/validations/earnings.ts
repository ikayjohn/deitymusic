import { z } from "zod"

// Enums
export const TransactionType = {
  EARNING: "EARNING",
  WITHDRAWAL: "WITHDRAWAL",
  FEE: "FEE",
  ADJUSTMENT: "ADJUSTMENT",
} as const

export const WithdrawalStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const

export const PaymentMethod = {
  BANK_TRANSFER: "BANK_TRANSFER",
} as const

// Schemas
export const balanceOverviewSchema = z.object({
  currentBalance: z.number(),
  pendingBalance: z.number(),
  lifetimeEarnings: z.number(),
  availableForWithdrawal: z.number(),
  lastUpdated: z.string(),
})

export type BalanceOverview = z.infer<typeof balanceOverviewSchema>

export const revenueByReleaseSchema = z.object({
  releaseId: z.string(),
  releaseTitle: z.string(),
  artwork: z.string(),
  streams: z.number(),
  revenue: z.number(),
  share: z.number(),
})

export type RevenueByRelease = z.infer<typeof revenueByReleaseSchema>

export const revenueByPlatformSchema = z.object({
  platform: z.string(),
  platformName: z.string(),
  revenue: z.number(),
  streams: z.number(),
  share: z.number(),
})

export type RevenueByPlatform = z.infer<typeof revenueByPlatformSchema>

export const transactionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TransactionType),
  amount: z.number(),
  description: z.string(),
  status: z.string().optional(),
  createdAt: z.string(),
  metadata: z.object({
    releaseId: z.string().optional(),
    releaseTitle: z.string().optional(),
    platform: z.string().optional(),
    reference: z.string().optional(),
  }).optional(),
})

export type Transaction = z.infer<typeof transactionSchema>

export const transactionsResponseSchema = z.object({
  transactions: z.array(transactionSchema),
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

export type TransactionsResponse = z.infer<typeof transactionsResponseSchema>

export const withdrawalRequestSchema = z.object({
  amountUSD: z.number().min(100, "Minimum withdrawal amount is $100 USD"),
  amountNGN: z.number(),
  exchangeRate: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentDetails: z.object({
    accountHolderName: z.string().min(1, "Account holder name is required"),
    accountNumber: z.string().min(10, "Account number must be at least 10 digits"),
    bankName: z.string().min(1, "Bank name is required"),
    bankCode: z.string().optional(),
  }),
})

export type WithdrawalRequest = z.infer<typeof withdrawalRequestSchema>

export const paymentMethodConfigSchema = z.object({
  type: z.nativeEnum(PaymentMethod),
  isDefault: z.boolean().default(false),
  details: z.object({
    // Bank Transfer
    accountHolderName: z.string().optional(),
    last4Digits: z.string().optional(),
    bankName: z.string().optional(),

    // Mobile Money / Fintech
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
  }),
})

export type PaymentMethodConfig = z.infer<typeof paymentMethodConfigSchema>

export const payoutThresholdSchema = z.object({
  minimumWithdrawalUSD: z.number().default(100),
  minimumWithdrawalNGN: z.number().default(155000), // Will be updated based on live rate
  processingTime: z.string().default("2-3 business days"),
  fee: z.number().default(0),
  feePercentage: z.number().default(0),
})

export type PayoutThreshold = z.infer<typeof payoutThresholdSchema>

// Detailed earnings response
export const detailedEarningsSchema = z.object({
  overview: balanceOverviewSchema,
  byRelease: z.array(revenueByReleaseSchema),
  byPlatform: z.array(revenueByPlatformSchema),
  recentTransactions: z.array(transactionSchema),
  payoutThreshold: payoutThresholdSchema,
})

export type DetailedEarnings = z.infer<typeof detailedEarningsSchema>

// Helper functions
export function formatCurrencyUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrency(amount: number): string {
  return formatCurrencyUSD(amount)
}

export async function getExchangeRate(): Promise<number> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await response.json()
    return data.rates.NGN
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // Fallback to a fixed rate if API fails
    return 1550 // Approximate rate as of 2024
  }
}

export function convertUSDToNGN(usd: number, rate: number): number {
  return usd * rate
}

export function convertNGNToUSD(ngn: number, rate: number): number {
  return ngn / rate
}

export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    EARNING: "Earning",
    WITHDRAWAL: "Withdrawal",
    FEE: "Fee",
    ADJUSTMENT: "Adjustment",
  }
  return labels[type] || type
}

export function getWithdrawalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
  }
  return labels[status] || status
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    BANK_TRANSFER: "Bank Transfer",
    OPAY: "Opay",
    PALMPAY: "PalmPay",
    KUDA: "Kuda Bank",
    CARBON: "Carbon",
    PAGA: "Paga",
    USSD: "USSD",
  }
  return labels[method] || method
}

// Mock data generators
export function generateMockBalanceOverview(): BalanceOverview {
  return {
    currentBalance: 1647.50,
    pendingBalance: 589.20,
    lifetimeEarnings: 12350.75,
    availableForWithdrawal: 1647.50,
    lastUpdated: new Date().toISOString(),
  }
}

export function generateMockRevenueByRelease(): RevenueByRelease[] {
  return [
    {
      releaseId: "1",
      releaseTitle: "Midnight Dreams",
      artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      streams: 125430,
      revenue: 5923.50,
      share: 42.3,
    },
    {
      releaseId: "2",
      releaseTitle: "Electric Soul",
      artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      streams: 87542,
      revenue: 4138.20,
      share: 29.5,
    },
    {
      releaseId: "3",
      releaseTitle: "Summer Vibes",
      artwork: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
      streams: 54231,
      revenue: 2567.80,
      share: 18.3,
    },
    {
      releaseId: "4",
      releaseTitle: "Urban Nights",
      artwork: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
      streams: 32109,
      revenue: 1519.75,
      share: 10.8,
    },
  ]
}

export function generateMockRevenueByPlatform(): RevenueByPlatform[] {
  return [
    {
      platform: "SPOTIFY",
      platformName: "Spotify",
      revenue: 7489.25,
      streams: 215402,
      share: 53.5,
    },
    {
      platform: "APPLE_MUSIC",
      platformName: "Apple Music",
      revenue: 3477.80,
      streams: 62431,
      share: 24.8,
    },
    {
      platform: "AMAZON_MUSIC",
      platformName: "Amazon Music",
      revenue: 1559.30,
      streams: 18765,
      share: 11.1,
    },
    {
      platform: "YOUTUBE_MUSIC",
      platformName: "YouTube Music",
      revenue: 1185.60,
      streams: 12453,
      share: 8.4,
    },
    {
      platform: "DEEZER",
      platformName: "Deezer",
      revenue: 446.20,
      streams: 3661,
      share: 3.2,
    },
  ]
}

export function generateMockTransactions(count: number = 10): Transaction[] {
  const transactions: Transaction[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 3)

    const isEarning = i % 3 !== 0
    const isWithdrawal = i % 3 === 0 && i > 0

    if (isEarning) {
      transactions.push({
        id: `txn-${i}`,
        type: TransactionType.EARNING,
        amount: Math.random() * 200000 + 50000,
        description: "Streaming revenue",
        createdAt: date.toISOString(),
        metadata: {
          releaseId: `${(i % 4) + 1}`,
          releaseTitle: ["Midnight Dreams", "Electric Soul", "Summer Vibes", "Urban Nights"][i % 4],
          platform: ["SPOTIFY", "APPLE_MUSIC", "AMAZON_MUSIC"][i % 3],
        },
      })
    } else if (isWithdrawal) {
      transactions.push({
        id: `txn-${i}`,
        type: TransactionType.WITHDRAWAL,
        amount: -(Math.random() * 300000 + 100000),
        description: "Withdrawal to Bank Account",
        status: WithdrawalStatus.COMPLETED,
        createdAt: date.toISOString(),
        metadata: {
          reference: `WD-${Date.now()}-${i}`,
        },
      })
    }
  }

  return transactions
}

export function generateMockDetailedEarnings(): DetailedEarnings {
  return {
    overview: generateMockBalanceOverview(),
    byRelease: generateMockRevenueByRelease(),
    byPlatform: generateMockRevenueByPlatform(),
    recentTransactions: generateMockTransactions(8),
    payoutThreshold: {
      minimumWithdrawalUSD: 100,
      minimumWithdrawalNGN: 155000,
      processingTime: "2-3 business days",
      fee: 0,
      feePercentage: 0,
    },
  }
}
