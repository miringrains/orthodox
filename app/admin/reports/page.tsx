import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportCSVButton } from '@/components/admin/ExportCSVButton'
import { FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  await requireAuth()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's parishes
  const { data: parishUsers } = await supabase
    .from('parish_users')
    .select('parish_id')
    .eq('user_id', user.id)

  const parishIds = parishUsers?.map((pu) => pu.parish_id) || []

  const { data: donations } = await supabase
    .from('donations')
    .select('*, donation_funds(name), parishes(name)')
    .in('parish_id', parishIds)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Reports
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            View and export donation reports
          </p>
        </div>
        <ExportCSVButton donations={donations || []} />
      </div>

      {donations && donations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 bg-stone-50 dark:bg-neutral-800/50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-[15px] text-stone-900 dark:text-neutral-100 tracking-tight">
                      ${Number(donation.amount).toLocaleString()}
                    </p>
                    <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                      {(donation.donation_funds as any)?.name || 'General'} •{' '}
                      {(donation.parishes as any)?.name || 'Unknown Parish'}
                    </p>
                  </div>
                  <p className="text-[13px] text-stone-400 dark:text-neutral-500 tracking-wide">
                    {new Date(donation.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No donations to report.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
