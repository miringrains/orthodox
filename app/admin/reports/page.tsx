import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportCSVButton } from '@/components/admin/ExportCSVButton'
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

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

  // Calculate totals
  const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
  const thisMonth = donations?.filter(d => {
    const date = new Date(d.created_at || '')
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).reduce((sum, d) => sum + Number(d.amount), 0) || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Reports
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-base">
            View and export donation reports
          </p>
        </div>
        <ExportCSVButton donations={donations || []} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-neutral-400">Total Donations</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-neutral-100">
                  ${totalDonations.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-neutral-400">This Month</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-neutral-100">
                  ${thisMonth.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-neutral-400">Total Donations</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-neutral-100">
                  {donations?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {donations && donations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 bg-stone-50 dark:bg-neutral-800/50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-lg text-stone-900 dark:text-neutral-100">
                      ${Number(donation.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-neutral-400 mt-0.5">
                      {(donation.donation_funds as any)?.name || 'General'} •{' '}
                      {(donation.parishes as any)?.name || 'Unknown Parish'}
                    </p>
                  </div>
                  <p className="text-sm text-stone-400 dark:text-neutral-500">
                    {new Date(donation.created_at || '').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-5">
              <FileText className="h-7 w-7 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-base">
              No donations to report.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
