import { createClient } from '@/lib/supabase/server'
import { getParishIdFromSlug } from '@/lib/tenancy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SchedulePage({
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
  const { data: schedules } = await supabase
    .from('service_schedules')
    .select('*')
    .eq('parish_id', parishId)
    .order('day_of_week', { ascending: true })

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Service Schedule</h1>

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
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">{schedule.service_type}</p>
                {schedule.time && (
                  <p className="text-muted-foreground">
                    {new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                {schedule.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{schedule.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No service schedule available.</p>
      )}
    </div>
  )
}

