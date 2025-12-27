import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
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

  const { data: events } = await supabase
    .from('events')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('start_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Events
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage parish events and services
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Link>
        </Button>
      </div>

      {events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <p className="text-[13px] text-stone-500 dark:text-neutral-400 mt-1 tracking-wide">
                      {(event.parishes as any)?.name || 'Unknown Parish'}
                    </p>
                  </div>
                  {event.is_feast && (
                    <span className="text-[11px] font-medium uppercase tracking-wider bg-gold-100 dark:bg-gold-500/20 text-gold-700 dark:text-gold-400 px-2 py-1 rounded">
                      Feast
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-[13px] text-stone-500 dark:text-neutral-400 mb-4 tracking-wide">
                  <Calendar className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
                  <span>
                    {new Date(event.start_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {event.description && (
                  <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/events/${event.id}`}>Edit</Link>
                  </Button>
                </div>
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
              No events yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
