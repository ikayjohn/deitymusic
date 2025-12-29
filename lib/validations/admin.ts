import { z } from "zod"

// Enums
export const UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING",
  BANNED: "BANNED",
} as const

export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
  MODERATOR: "MODERATOR",
} as const

export const ModerationAction = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  NEEDS_CHANGES: "NEEDS_CHANGES",
} as const

export const ActivityLogAction = {
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  RELEASE_CREATED: "RELEASE_CREATED",
  RELEASE_UPDATED: "RELEASE_UPDATED",
  RELEASE_DELETED: "RELEASE_DELETED",
  RELEASE_APPROVED: "RELEASE_APPROVED",
  RELEASE_REJECTED: "RELEASE_REJECTED",
  WITHDRAWAL_REQUESTED: "WITHDRAWAL_REQUESTED",
  WITHDRAWAL_APPROVED: "WITHDRAWAL_APPROVED",
  WITHDRAWAL_REJECTED: "WITHDRAWAL_REJECTED",
  WITHDRAWAL_COMPLETED: "WITHDRAWAL_COMPLETED",
  SETTINGS_UPDATED: "SETTINGS_UPDATED",
} as const

// Schemas
export const adminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  accountType: z.string(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  createdAt: z.string(),
  lastLogin: z.string().nullable(),
  totalReleases: z.number(),
  totalEarnings: z.number(),
  currentBalance: z.number(),
})

export type AdminUser = z.infer<typeof adminUserSchema>

export const userManagementFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  accountType: z.string().optional(),
  sortBy: z.enum(["createdAt", "email", "lastLogin", "totalReleases", "totalEarnings"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type UserManagementFilters = z.infer<typeof userManagementFiltersSchema>

export const usersResponseSchema = z.object({
  users: z.array(adminUserSchema),
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export type UsersResponse = z.infer<typeof usersResponseSchema>

export const moderationItemSchema = z.object({
  id: z.string(),
  type: z.enum(["RELEASE", "USER", "TRACK"]),
  typeId: z.string(),
  title: z.string(),
  userId: z.string(),
  userEmail: z.string(),
  userName: z.string(),
  status: z.nativeEnum(ModerationAction),
  submittedAt: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  metadata: z.object({
    releaseType: z.string().optional(),
    genre: z.string().optional(),
    trackCount: z.number().optional(),
    explicitContent: z.boolean().optional(),
    artwork: z.string().optional(),
  }).optional(),
})

export type ModerationItem = z.infer<typeof moderationItemSchema>

export const moderationActionSchema = z.object({
  action: z.nativeEnum(ModerationAction),
  reason: z.string().optional(),
  internalNote: z.string().optional(),
  notifyUser: z.boolean().default(true),
})

export type ModerationActionInput = z.infer<typeof moderationActionSchema>

export const withdrawalRequestAdminSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userEmail: z.string(),
  userName: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
  paymentDetails: z.object({
    email: z.string().email().optional(),
    accountHolderName: z.string().optional(),
    last4Digits: z.string().optional(),
    bankName: z.string().optional(),
  }),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "REJECTED"]),
  requestedAt: z.string(),
  processedAt: z.string().nullable(),
  processedBy: z.string().nullable(),
  fee: z.number(),
  netAmount: z.number(),
})

export type WithdrawalRequestAdmin = z.infer<typeof withdrawalRequestAdminSchema>

export const withdrawalActionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "PROCESS"]),
  reason: z.string().optional(),
  internalNote: z.string().optional(),
  reference: z.string().optional(),
})

export type WithdrawalActionInput = z.infer<typeof withdrawalActionSchema>

export const adminStatsSchema = z.object({
  overview: z.object({
    totalUsers: z.number(),
    activeUsers: z.number(),
    totalReleases: z.number(),
    pendingReleases: z.number(),
    totalEarnings: z.number(),
    pendingWithdrawals: z.number(),
    totalPaidOut: z.number(),
    monthlyRevenue: z.number(),
  }),
  userGrowth: z.array(z.object({
    date: z.string(),
    users: z.number(),
    activeUsers: z.number(),
  })),
  releaseStats: z.object({
    byType: z.array(z.object({
      type: z.string(),
      count: z.number(),
      percentage: z.number(),
    })),
    byGenre: z.array(z.object({
      genre: z.string(),
      count: z.number(),
      percentage: z.number(),
    })),
  })),
  revenueChart: z.array(z.object({
    date: z.string(),
    revenue: z.number(),
    payouts: z.number(),
    netRevenue: z.number(),
  })),
  platformHealth: z.array(z.object({
    platform: z.string(),
    status: z.enum(["OPERATIONAL", "DEGRADED", "DOWN"]),
    deliveries: z.number(),
    successRate: z.number(),
    lastChecked: z.string(),
  })),
})

export type AdminStats = z.infer<typeof adminStatsSchema>

export const activityLogSchema = z.object({
  id: z.string(),
  action: z.nativeEnum(ActivityLogAction),
  userId: z.string().nullable(),
  userEmail: z.string().nullable(),
  targetType: z.string(),
  targetId: z.string(),
  details: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.string(),
})

export type ActivityLog = z.infer<typeof activityLogSchema>

export const activityLogsResponseSchema = z.object({
  logs: z.array(activityLogSchema),
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

export type ActivityLogsResponse = z.infer<typeof activityLogsResponseSchema>

export const systemSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
  type: z.enum(["STRING", "NUMBER", "BOOLEAN", "JSON"]),
  category: z.string(),
  description: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
})

export type SystemSetting = z.infer<typeof systemSettingSchema>

// Mock data generators
export function generateMockAdminUsers(count: number = 20): AdminUser[] {
  const users: AdminUser[] = []
  const statuses = Object.values(UserStatus)
  const roles = Object.values(UserRole)
  const accountTypes = ["ARTIST", "LABEL"]

  for (let i = 0; i < count; i++) {
    const isArtist = Math.random() > 0.3
    users.push({
      id: `user-${i + 1}`,
      email: isArtist ? `artist${i + 1}@example.com` : `label${i + 1}@example.com`,
      fullName: isArtist ? `Artist ${i + 1}` : `Label ${i + 1}`,
      accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      totalReleases: Math.floor(Math.random() * 50),
      totalEarnings: Math.random() * 23540,
      currentBalance: Math.random() * 11770,
    })
  }

  return users
}

export function generateMockModerationQueue(): ModerationItem[] {
  return [
    {
      id: "mod-1",
      type: "RELEASE",
      typeId: "rel-1",
      title: "Summer Hits 2025",
      userId: "user-1",
      userEmail: "artist1@example.com",
      userName: "Artist 1",
      status: ModerationAction.PENDING,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: "HIGH",
      metadata: {
        releaseType: "EP",
        genre: "Pop",
        trackCount: 6,
        explicitContent: false,
        artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      },
    },
    {
      id: "mod-2",
      type: "RELEASE",
      typeId: "rel-2",
      title: "Midnight Sessions",
      userId: "user-2",
      userEmail: "artist2@example.com",
      userName: "Artist 2",
      status: ModerationAction.PENDING,
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      priority: "MEDIUM",
      metadata: {
        releaseType: "ALBUM",
        genre: "Electronic",
        trackCount: 12,
        explicitContent: true,
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      },
    },
    {
      id: "mod-3",
      type: "RELEASE",
      typeId: "rel-3",
      title: "Acoustic Dreams",
      userId: "user-3",
      userEmail: "artist3@example.com",
      userName: "Artist 3",
      status: ModerationAction.NEEDS_CHANGES,
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: "LOW",
      metadata: {
        releaseType: "SINGLE",
        genre: "Folk",
        trackCount: 1,
        explicitContent: false,
        artwork: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
      },
    },
  ]
}

export function generateMockWithdrawalRequests(): WithdrawalRequestAdmin[] {
  return [
    {
      id: "wd-1",
      userId: "user-1",
      userEmail: "artist1@example.com",
      userName: "Artist 1",
      amount: 161.29,
      paymentMethod: "BANK_TRANSFER",
      paymentDetails: {
        accountHolderName: "Artist 1",
        last4Digits: "4532",
        bankName: "GTBank",
      },
      status: "PENDING",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: null,
      processedBy: null,
      fee: 0,
      netAmount: 161.29,
    },
    {
      id: "wd-2",
      userId: "user-2",
      userEmail: "artist2@example.com",
      userName: "Artist 2",
      amount: 322.58,
      paymentMethod: "BANK_TRANSFER",
      paymentDetails: {
        accountHolderName: "Artist 2",
        last4Digits: "4532",
        bankName: "Access Bank",
      },
      status: "PROCESSING",
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      processedBy: "admin-1",
      fee: 0,
      netAmount: 322.58,
    },
    {
      id: "wd-3",
      userId: "user-3",
      userEmail: "artist3@example.com",
      userName: "Artist 3",
      amount: 96.77,
      paymentMethod: "BANK_TRANSFER",
      paymentDetails: {
        accountHolderName: "Artist 3",
        last4Digits: "1234",
        bankName: "First Bank",
      },
      status: "COMPLETED",
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      processedBy: "admin-1",
      fee: 0,
      netAmount: 96.77,
    },
  ]
}

export function generateMockAdminStats(): AdminStats {
  const now = new Date()
  const userGrowth = []
  const revenueChart = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    userGrowth.push({
      date: date.toISOString(),
      users: Math.floor(100 + i * 5 + Math.random() * 20),
      activeUsers: Math.floor(50 + i * 3 + Math.random() * 15),
    })
  }

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    const revenue = 3871 + Math.random() * 2258
    revenueChart.push({
      date: date.toISOString(),
      revenue,
      payouts: revenue * 0.7,
      netRevenue: revenue * 0.3,
    })
  }

  return {
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalReleases: 3456,
      pendingReleases: 23,
      totalEarnings: 57677.85,
      pendingWithdrawals: 8,
      totalPaidOut: 37570.40,
      monthlyRevenue: 6746.30,
    },
    userGrowth,
    releaseStats: {
      byType: [
        { type: "SINGLE", count: 2134, percentage: 61.7 },
        { type: "EP", count: 876, percentage: 25.3 },
        { type: "ALBUM", count: 446, percentage: 12.9 },
      ],
      byGenre: [
        { genre: "Pop", count: 987, percentage: 28.5 },
        { genre: "Hip-Hop", count: 654, percentage: 18.9 },
        { genre: "Electronic", count: 543, percentage: 15.7 },
        { genre: "Rock", count: 432, percentage: 12.5 },
        { genre: "R&B", count: 387, percentage: 11.2 },
        { genre: "Other", count: 453, percentage: 13.1 },
      ],
    },
    revenueChart,
    platformHealth: [
      { platform: "Spotify", status: "OPERATIONAL", deliveries: 15432, successRate: 99.8, lastChecked: new Date().toISOString() },
      { platform: "Apple Music", status: "OPERATIONAL", deliveries: 12453, successRate: 99.6, lastChecked: new Date().toISOString() },
      { platform: "Amazon Music", status: "OPERATIONAL", deliveries: 8765, successRate: 99.4, lastChecked: new Date().toISOString() },
      { platform: "YouTube Music", status: "DEGRADED", deliveries: 6543, successRate: 97.2, lastChecked: new Date().toISOString() },
    ],
  }
}

export function generateMockActivityLogs(count: number = 50): ActivityLog[] {
  const logs: ActivityLog[] = []
  const actions = Object.values(ActivityLogAction)

  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    logs.push({
      id: `log-${i + 1}`,
      action,
      userId: Math.random() > 0.3 ? `user-${Math.floor(Math.random() * 20) + 1}` : null,
      userEmail: Math.random() > 0.3 ? `user${Math.floor(Math.random() * 20) + 1}@example.com` : null,
      targetType: action.includes("RELEASE") ? "RELEASE" : action.includes("USER") ? "USER" : "SYSTEM",
      targetId: `target-${i + 1}`,
      details: `Performed ${action.replace(/_/g, " ").toLowerCase()}`,
      ipAddress: Math.random() > 0.5 ? `192.168.1.${Math.floor(Math.random() * 255)}` : null,
      userAgent: null,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Helper functions
export function getUserStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-success/10 text-success",
    SUSPENDED: "bg-warning/10 text-warning",
    PENDING: "bg-info/10 text-info",
    BANNED: "bg-destructive/10 text-destructive",
  }
  return colors[status] || "bg-muted text-muted-foreground"
}

export function getModerationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    APPROVED: "bg-success/10 text-success",
    REJECTED: "bg-destructive/10 text-destructive",
    PENDING: "bg-warning/10 text-warning",
    NEEDS_CHANGES: "bg-info/10 text-info",
  }
  return colors[status] || "bg-muted text-muted-foreground"
}

export function getPlatformStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPERATIONAL: "bg-success/10 text-success",
    DEGRADED: "bg-warning/10 text-warning",
    DOWN: "bg-destructive/10 text-destructive",
  }
  return colors[status] || "bg-muted text-muted-foreground"
}

export function formatActivityAction(action: string): string {
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

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
