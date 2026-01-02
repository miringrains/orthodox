import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Calendar, Megaphone, Users, FileEdit, Plus, Eye, ArrowRight, ExternalLink, Palette } from 'lucide-react'
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
  const parishSlug = basicParishData?.slug

  // Fetch additional onboarding fields separately (not in generated types yet)
  let showWelcomeModal = false
  let selectedPlan = 'free'
  let homePageId: string | null = null
  
  if (parishId) {
    const { data: extendedData } = await (supabase as any)
      .from('parishes')
      .select('first_dashboard_visit, selected_plan')
      .eq('id', parishId)
      .single()
    
    showWelcomeModal = extendedData?.first_dashboard_visit ?? false
    selectedPlan = extendedData?.selected_plan || 'free'

    // Get or create home page
    const { data: homePage } = await supabase
      .from('pages')
      .select('id')
      .eq('parish_id', parishId)
      .eq('kind', 'HOME')
      .maybeSingle()
    
    if (homePage) {
      homePageId = homePage.id
    } else {
      // Auto-create home page if missing
      const { data: newPage } = await supabase
        .from('pages')
        .insert({
          parish_id: parishId,
          title: 'Home',
          slug: 'home',
          kind: 'HOME',
          builder_enabled: true,
          builder_schema: null,
          is_published: false,
        })
        .select('id')
        .single()
      
      homePageId = newPage?.id || null
    }
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
          <h1 className="font-display text-4xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Welcome, {parishName}
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Here&apos;s what&apos;s happening with your parish.
          </p>
        </div>
        
        {/* Plan badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-[13px] shadow-sm">
          <span className="text-stone-400 dark:text-neutral-500 tracking-wide">Plan:</span>
          <span className="font-semibold text-stone-700 dark:text-neutral-200">{planLabels[selectedPlan] || selectedPlan}</span>
        </div>
      </div>

      {/* Edit Website CTA */}
      {homePageId && (
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <Palette className="h-6 w-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Your Website</h2>
              <p className="text-stone-400 text-sm">Customize your parish website with the visual builder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {parishSlug && (
              <Button asChild variant="ghost" className="text-stone-300 hover:text-white hover:bg-stone-700">
                <Link href={`/p/${parishSlug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live
                </Link>
              </Button>
            )}
            <Button asChild className="bg-gold-500 hover:bg-gold-600 text-stone-900 font-semibold">
              <Link href={`/admin/pages/${homePageId}/builder`}>
                <FileEdit className="h-4 w-4 mr-2" />
                Edit Website
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Last 30 Days', value: `$${stats.totalDonations.toLocaleString()}`, sub: `${stats.donations} donations`, icon: DollarSign },
          { label: 'Upcoming Events', value: stats.upcomingEvents.toString(), sub: 'Next 5 events', icon: Calendar },
          { label: 'Recent Announcements', value: stats.recentAnnouncements.toString(), sub: 'Latest posts', icon: Megaphone },
          { label: 'Parishes', value: (parishes?.length || 0).toString(), sub: 'Active parishes', icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="bg-stone-900 dark:bg-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-stone-400 dark:text-neutral-400 tracking-wide">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-gold-400" />
            </div>
            <div className="text-3xl font-semibold text-white dark:text-neutral-100 tracking-tight">
              {stat.value}
            </div>
            <p className="text-[13px] text-stone-500 dark:text-neutral-500 mt-1 tracking-wide">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-2xl text-stone-900 dark:text-neutral-100 mb-4" style={{ letterSpacing: '-0.01em' }}>
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/admin/announcements/new', title: 'Post Announcement', desc: 'Share news with your parish', icon: Megaphone, iconBg: 'bg-blue-50 dark:bg-blue-500/10', iconColor: 'text-blue-600 dark:text-blue-400' },
            { href: '/admin/events/new', title: 'Add Event', desc: 'Schedule a service or gathering', icon: Plus, iconBg: 'bg-stone-100 dark:bg-neutral-800', iconColor: 'text-stone-600 dark:text-neutral-400' },
            { href: '/admin/giving', title: 'View Donations', desc: 'See recent giving activity', icon: Eye, iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="group">
              <Card className="h-full hover:shadow-md hover:border-stone-300 dark:hover:border-neutral-700">
                <div className="flex items-center gap-4 p-4">
                  <div className={`w-10 h-10 rounded-lg ${action.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold text-stone-900 dark:text-neutral-100 tracking-tight">
                      {action.title}
                    </div>
                    <div className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                      {action.desc}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300 dark:text-neutral-600 group-hover:text-stone-500 dark:group-hover:text-neutral-400 transition-colors flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
