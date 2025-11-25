import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
          <h1 className="text-3xl font-bold">Service Schedule</h1>
          <p className="text-muted-foreground mt-2">Manage recurring service times</p>
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
                <p className="text-sm text-muted-foreground">
                  {(schedule.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">{schedule.service_type}</p>
                {schedule.time && (
                  <p className="text-muted-foreground mb-4">
                    {new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                {schedule.notes && (
                  <p className="text-sm text-muted-foreground mb-4">{schedule.notes}</p>
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
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No service schedules yet. Add your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

