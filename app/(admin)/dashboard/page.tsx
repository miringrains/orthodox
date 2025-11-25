import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, Megaphone, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Get user's parishes
  const { data: parishes } = await supabase
    .from('parish_users')
    .select('parish_id, parishes(name, slug)')
    .eq('user_id', user.id)

  // Get stats for first parish (for now)
  const parishId = parishes?.[0]?.parish_id

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your parish.
        </p>
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
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Create Announcement</CardTitle>
              <CardDescription>Share news with your parish</CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Add Event</CardTitle>
              <CardDescription>Schedule a service or gathering</CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">View Donations</CardTitle>
              <CardDescription>See recent giving activity</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

