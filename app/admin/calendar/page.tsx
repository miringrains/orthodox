import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { CalendarClient } from './CalendarClient'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
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
  const parishId = parishIds[0] // Use first parish for now

  if (!parishId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-500 dark:text-neutral-400">
          No parish found. Please set up your parish first.
        </p>
      </div>
    )
  }

  // Fetch events for the current month (and a buffer for week view)
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0)

  const [eventsRes, schedulesRes] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('parish_id', parishId)
      .gte('start_at', startDate.toISOString())
      .lte('start_at', endDate.toISOString())
      .order('start_at', { ascending: true }),
    supabase
      .from('service_schedules')
      .select('*')
      .eq('parish_id', parishId)
  ])

  const events = eventsRes.data || []
  const schedules = schedulesRes.data || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
          Calendar
        </h1>
        <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
          Manage your church events and services
        </p>
      </div>

      <CalendarClient 
        initialEvents={events as any}
        schedules={schedules as any}
        parishId={parishId}
      />
    </div>
  )
}
