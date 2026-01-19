import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Plus, Heart, Calendar, Repeat, GraduationCap, Users, Printer, MoreHorizontal, Clock, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const URGENCY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  urgent: { 
    bg: 'bg-red-100 dark:bg-red-500/20', 
    text: 'text-red-700 dark:text-red-400',
    label: 'Urgent'
  },
  high: { 
    bg: 'bg-orange-100 dark:bg-orange-500/20', 
    text: 'text-orange-700 dark:text-orange-400',
    label: 'High'
  },
  medium: { 
    bg: 'bg-amber-100 dark:bg-amber-500/20', 
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Medium'
  },
  low: { 
    bg: 'bg-emerald-100 dark:bg-emerald-500/20', 
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Healthy'
  },
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  open: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400' },
  filled: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400' },
  expired: { bg: 'bg-stone-100 dark:bg-neutral-700', text: 'text-stone-600 dark:text-neutral-400' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400' },
}

const CATEGORY_LABELS: Record<string, string> = {
  volunteer: 'Volunteer',
  supplies: 'Supplies',
  fundraising: 'Fundraising',
  skills: 'Skills',
  announcement: 'Announcement',
}

export default async function CommunityNeedsPage() {
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

  const { data: needs } = await supabase
    .from('community_needs')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('created_at', { ascending: false })

  // Group by need_type (cast to any for new columns not yet in types)
  const upcomingEvents = needs?.filter(n => 
    !(n as any).need_type || (n as any).need_type === 'event'
  ) || []
  const recurringRotas = needs?.filter(n => (n as any).need_type === 'rota') || []
  const parishSchool = needs?.filter(n => (n as any).need_type === 'school') || []

  const renderNeedRow = (need: NonNullable<typeof needs>[0]) => {
    const urgency = (need as any).urgency || 'medium'
    const status = (need as any).status || 'open'
    const category = (need as any).category || 'volunteer'
    const maxVolunteers = (need as any).max_volunteers || 0
    const currentVolunteers = (need as any).current_volunteers || 0
    const deadline = (need as any).deadline
    
    const urgencyStyle = URGENCY_STYLES[urgency] || URGENCY_STYLES['medium']
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['open']
    const volunteerProgress = maxVolunteers > 0 
      ? Math.min((currentVolunteers / maxVolunteers) * 100, 100)
      : 0

    return (
      <div 
        key={need.id}
        className="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
      >
        {/* Status indicator */}
        <span className={`px-2 py-1 rounded text-[11px] font-semibold ${urgencyStyle.bg} ${urgencyStyle.text}`}>
          {urgencyStyle.label}
        </span>

        {/* Need info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-stone-900 dark:text-neutral-100">
            {need.title}
          </div>
          <div className="text-[12px] text-stone-500 dark:text-neutral-400 mt-0.5">
            {CATEGORY_LABELS[category] || category}
          </div>
        </div>

        {/* Date */}
        {deadline && (
          <div className="flex items-center gap-1.5 text-[12px] text-stone-500 dark:text-neutral-400">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )}

        {/* Volunteers progress */}
        {maxVolunteers > 0 && (
          <div className="w-32">
            <div className="flex justify-between text-[11px] mb-1">
              <span className={`font-medium ${
                currentVolunteers >= maxVolunteers 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-stone-600 dark:text-neutral-300'
              }`}>
                {currentVolunteers}/{maxVolunteers} Filled
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-neutral-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  currentVolunteers >= maxVolunteers 
                    ? 'bg-emerald-500' 
                    : 'bg-gold-500'
                }`}
                style={{ width: `${volunteerProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-3.5 w-3.5 mr-1" />
            Print Sheet
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/community-needs/${need.id}`}>
              Manage
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Community Needs
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage volunteer opportunities and parish needs
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/community-needs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Need
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="events" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Upcoming Events ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="rotas" className="gap-1.5">
            <Repeat className="h-4 w-4" />
            Recurring Rotas ({recurringRotas.length})
          </TabsTrigger>
          <TabsTrigger value="school" className="gap-1.5">
            <GraduationCap className="h-4 w-4" />
            Parish School ({parishSchool.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          {upcomingEvents.length > 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700 text-[11px] font-medium text-stone-500 dark:text-neutral-400 uppercase tracking-wider">
                <div>Status</div>
                <div>Need</div>
                <div>Date</div>
                <div>Volunteers</div>
                <div>Actions</div>
              </div>
              {/* Rows */}
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {upcomingEvents.map(renderNeedRow)}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
                </div>
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No upcoming event needs. Create your first one!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rotas">
          {recurringRotas.length > 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {recurringRotas.map(renderNeedRow)}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[14px]">
                  No recurring rotas set up yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="school">
          {parishSchool.length > 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {parishSchool.map(renderNeedRow)}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[14px]">
                  No parish school needs yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
