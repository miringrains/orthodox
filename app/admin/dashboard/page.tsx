import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, Megaphone, Users, FileEdit, Plus, Eye } from 'lucide-react'
import { DashboardClient } from '@/components/admin/DashboardClient'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Get user's parishes with additional fields
  const { data: parishes } = await supabase
    .from('parish_users')
    .select('parish_id, parishes(id, name, slug, first_dashboard_visit, selected_plan)')
    .eq('user_id', user.id)

  // Get first parish data
  const parishData = parishes?.[0]?.parishes as { 
    id: string
    name: string
    slug: string
    first_dashboard_visit: boolean
    selected_plan: string
  } | null
  
  const parishId = parishes?.[0]?.parish_id
  const parishName = parishData?.name || 'Your Parish'
  const showWelcomeModal = parishData?.first_dashboard_visit ?? false
  const selectedPlan = parishData?.selected_plan || 'free'

  let stats = {
    donations: 0,
    upcomingEvents: 0,
    recentAnnouncements: 0,
    totalDonations: 0,
  }

  if (parishId) {
    const [donationsRes, eventsRes, announcementsRes] = await Promise.all([
      supabase
        .from('donations')
        .select('amount, created_at')
        .eq('parish_id', parishId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase
        .from('events')
        .select('id')
        .eq('parish_id', parishId)
        .gte('start_at', new Date().toISOString())
        .limit(5),
      supabase
        .from('announcements')
        .select('id')
        .eq('parish_id', parishId)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    stats = {
      donations: donationsRes.data?.length || 0,
      totalDonations: donationsRes.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0,
      upcomingEvents: eventsRes.data?.length || 0,
      recentAnnouncements: announcementsRes.data?.length || 0,
    }
  }

  const planLabels: Record<string, string> = {
    free: 'Free',
    starter: 'Starter',
    growth: 'Growth',
    pro: 'Pro',
  }

  return (
    <div className="space-y-8">
      {/* Welcome Modal (client component) */}
      {parishId && (
        <DashboardClient
          parishId={parishId}
          parishName={parishName}
          showWelcomeModal={showWelcomeModal}
        />
      )}

      {/* Header with parish name */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B0B0B]">
            Welcome, {parishName}
          </h1>
          <p className="text-[#6A6761] mt-2">
            Here&apos;s what&apos;s happening with your parish.
          </p>
        </div>
        
        {/* Plan badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEECE6] text-sm">
          <span className="text-[#6A6761]">Plan:</span>
          <span className="font-medium text-[#0B0B0B]">{planLabels[selectedPlan] || selectedPlan}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalDonations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.donations} donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next 5 events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Latest posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parishes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parishes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active parishes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-[#0B0B0B] mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/pages">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F4EBD3] flex items-center justify-center">
                    <FileEdit className="h-5 w-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Edit Website</CardTitle>
                    <CardDescription>Customize your parish site</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/events/new">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7ECEF] flex items-center justify-center">
                    <Plus className="h-5 w-5 text-[#2F3A44]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Add Event</CardTitle>
                    <CardDescription>Schedule a service or gathering</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/giving">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E6F1EC] flex items-center justify-center">
                    <Eye className="h-5 w-5 text-[#1F4D3A]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">View Donations</CardTitle>
                    <CardDescription>See recent giving activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
