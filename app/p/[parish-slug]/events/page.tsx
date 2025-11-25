import { createClient } from '@/lib/supabase/server'
import { getParishIdFromSlug } from '@/lib/tenancy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EventsPage({
  params,
}: {
  params: Promise<{ 'parish-slug': string }>
}) {
  const { 'parish-slug': slug } = await params
  const parishId = await getParishIdFromSlug(slug)

  if (!parishId) {
    return <div>Parish not found</div>
  }

  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('parish_id', parishId)
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>

      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                {event.is_feast && event.feast_name && (
                  <p className="text-sm text-primary font-medium">{event.feast_name}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(event.start_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(event.start_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                {event.location && (
                  <p className="text-sm text-muted-foreground mb-2">📍 {event.location}</p>
                )}
                {event.description && (
                  <p className="text-sm mt-4">{event.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No upcoming events scheduled.</p>
      )}
    </div>
  )
}

