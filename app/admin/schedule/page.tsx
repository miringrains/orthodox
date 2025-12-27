import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Clock, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
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

  const { data: schedules } = await supabase
    .from('service_schedules')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('day_of_week', { ascending: true })

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Service Schedule
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage recurring service times
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/schedule/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>

      {schedules && schedules.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <CardTitle>
                  {schedule.day_of_week !== null
                    ? daysOfWeek[schedule.day_of_week]
                    : 'Special Service'}
                </CardTitle>
                <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                  {(schedule.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-[15px] text-stone-900 dark:text-neutral-100 mb-2 tracking-tight">
                  {schedule.service_type}
                </p>
                {schedule.time && (
                  <div className="flex items-center gap-2 text-[13px] text-stone-500 dark:text-neutral-400 mb-4 tracking-wide">
                    <Clock className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
                    <span>
                      {new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
                {schedule.notes && (
                  <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4">{schedule.notes}</p>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/schedule/${schedule.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No service schedules yet. Add your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
