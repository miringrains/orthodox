import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

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

  const exportToCSV = () => {
    if (!donations || donations.length === 0) return

    const headers = ['Date', 'Amount', 'Currency', 'Fund', 'Parish', 'Status']
    const rows = donations.map((d) => [
      new Date(d.created_at || '').toLocaleDateString(),
      d.amount,
      d.currency || 'USD',
      (d.donation_funds as any)?.name || 'General',
      (d.parishes as any)?.name || 'Unknown',
      d.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">View and export donation reports</p>
        </div>
        {donations && donations.length > 0 && (
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
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
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">${Number(donation.amount).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {(donation.donation_funds as any)?.name || 'General'} •{' '}
                      {(donation.parishes as any)?.name || 'Unknown Parish'}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(donation.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No donations to report.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

