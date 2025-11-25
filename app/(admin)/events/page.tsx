import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'

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
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-2">Manage parish events and services</p>
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {(event.parishes as any)?.name || 'Unknown Parish'}
                    </p>
                  </div>
                  {event.is_feast && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Feast
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
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
                  <p className="text-sm mb-4 line-clamp-2">{event.description}</p>
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
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No events yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

