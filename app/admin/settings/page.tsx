export default function AdminSettingsPage() {
 return (
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h1 className="text-3xl font-bold">System Settings</h1>
 <p className="text-muted-foreground">Configure platform-wide settings</p>
 </div>

 {/* Settings Sections */}
 <div className="grid gap-6">
 {/* Payout Settings */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="text-lg font-semibold mb-4">Payout Settings</h3>
 <div className="space-y-4">
 <SettingField
 label="Minimum Withdrawal Amount"
 description="Minimum amount users can withdraw"
 value="$50.00"
 />
 <SettingField
 label="Processing Time"
 description="Expected time for withdrawal processing"
 value="5-7 business days"
 />
 <SettingField
 label="Withdrawal Fee"
 description="Fee charged on withdrawals"
 value="0%"
 />
 </div>
 </div>

 {/* Release Settings */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="text-lg font-semibold mb-4">Release Settings</h3>
 <div className="space-y-4">
 <SettingField
 label="Artwork Requirements"
 description="Minimum dimensions for release artwork"
 value="3000x3000 pixels"
 />
 <SettingField
 label="Audio Formats"
 description="Accepted audio file formats"
 value="WAV, FLAC, MP3 (320kbps+)"
 />
 <SettingField
 label="Moderation Required"
 description="Require admin approval before distribution"
 value="Yes"
 />
 </div>
 </div>

 {/* Platform Settings */}
 <div className="border border-border bg-background p-6 shadow-sm">
 <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
 <div className="space-y-4">
 <SettingField
 label="Supported Platforms"
 description="Number of distribution platforms"
 value="12 platforms"
 />
 <SettingField
 label="Revenue Share"
 description="Platform commission on earnings"
 value="15%"
 />
 <SettingField
 label="Storage Limit"
 description="Maximum storage per user"
 value="100 GB"
 />
 </div>
 </div>

 {/* Coming Soon */}
 <div className="border border-dashed border-border bg-muted/30 p-12 text-center">
 <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <h3 className="mt-4 text-lg font-semibold">Editable Settings Coming Soon</h3>
 <p className="mt-2 text-sm text-muted-foreground">
 This section will allow you to modify system settings directly from the admin panel.
 </p>
 <p className="mt-2 text-xs text-muted-foreground">
 For now, please contact your development team to change these settings.
 </p>
 </div>
 </div>
 </div>
 )
}

function SettingField({
 label,
 description,
 value,
}: {
 label: string
 description: string
 value: string
}) {
 return (
 <div className="flex items-center justify-between border border-border bg-muted/30 p-4">
 <div>
 <p className="font-medium">{label}</p>
 <p className="text-sm text-muted-foreground">{description}</p>
 </div>
 <div className="text-sm font-medium text-muted-foreground">{value}</div>
 </div>
 )
}
