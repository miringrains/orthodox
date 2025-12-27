import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, Megaphone, Users, FileEdit, Plus, Eye, ArrowRight } from 'lucide-react'
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
    .select('parish_id, parishes(id, name, slug)')
    .eq('user_id', user.id)

  // Get first parish data
  const parishId = parishes?.[0]?.parish_id
  const basicParishData = parishes?.[0]?.parishes as { id: string; name: string; slug: string } | null
  const parishName = basicParishData?.name || 'Your Parish'

  // Fetch additional onboarding fields separately (not in generated types yet)
  let showWelcomeModal = false
  let selectedPlan = 'free'
  
  if (parishId) {
    const { data: extendedData } = await (supabase as any)
      .from('parishes')
      .select('first_dashboard_visit, selected_plan')
      .eq('id', parishId)
      .single()
    
    showWelcomeModal = extendedData?.first_dashboard_visit ?? false
    selectedPlan = extendedData?.selected_plan || 'free'
  }

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
    <div className="space-y-10">
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
          <h1 className="font-display text-4xl text-neutral-900 dark:text-neutral-100">
            Welcome, {parishName}
          </h1>
          <p className="text-neutral-500 mt-2">
            Here&apos;s what&apos;s happening with your parish.
          </p>
        </div>
        
        {/* Plan badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm">
          <span className="text-neutral-500">Plan:</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{planLabels[selectedPlan] || selectedPlan}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Last 30 Days</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              ${stats.totalDonations.toLocaleString()}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {stats.donations} donations
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.upcomingEvents}</div>
            <p className="text-sm text-neutral-500 mt-1">Next 5 events</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Recent Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.recentAnnouncements}</div>
            <p className="text-sm text-neutral-500 mt-1">Latest posts</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Parishes</CardTitle>
            <Users className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{parishes?.length || 0}</div>
            <p className="text-sm text-neutral-500 mt-1">Active parishes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/pages" className="group">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center">
                      <FileEdit className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Edit Website</CardTitle>
                      <CardDescription className="text-sm">Customize your parish site</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/events/new" className="group">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Add Event</CardTitle>
                      <CardDescription className="text-sm">Schedule a service or gathering</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/giving" className="group">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">View Donations</CardTitle>
                      <CardDescription className="text-sm">See recent giving activity</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
