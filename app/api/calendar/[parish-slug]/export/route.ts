import { createClient } from '@/lib/supabase/server'
import { createEvents, EventAttributes } from 'ics'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ 'parish-slug': string }> }
) {
  const { 'parish-slug': slug } = await params
  const supabase = await createClient()

  // Get parish by slug
  const { data: parish, error: parishError } = await supabase
    .from('parishes')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (parishError || !parish) {
    return new Response('Parish not found', { status: 404 })
  }

  // Fetch events for the next year
  const now = new Date()
  const oneYearFromNow = new Date(now)
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  const [eventsRes, schedulesRes] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('parish_id', parish.id)
      .eq('status', 'published')
      .gte('start_at', now.toISOString())
      .lte('start_at', oneYearFromNow.toISOString())
      .order('start_at', { ascending: true }),
    supabase
      .from('service_schedules')
      .select('*')
      .eq('parish_id', parish.id)
  ])

  const events = eventsRes.data || []
  const schedules = schedulesRes.data || []

  // Convert events to ICS format
  const icsEvents: EventAttributes[] = []

  // Add one-time events
  for (const event of events) {
    const startDate = new Date(event.start_at)
    const endDate = event.end_at ? new Date(event.end_at) : new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour default

    icsEvents.push({
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes()
      ],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes()
      ],
      title: event.title,
      description: event.description || undefined,
      location: event.location || undefined,
      uid: `event-${event.id}@projectorthodox.com`,
      categories: [event.event_type],
    })
  }

  // Add recurring services (generate instances for the next 12 weeks)
  for (const schedule of schedules) {
    if (schedule.day_of_week === null) continue

    // Generate instances for the next 12 weeks
    const startDate = new Date(now)
    // Find the next occurrence of this day of week
    const daysUntilTarget = (schedule.day_of_week - startDate.getDay() + 7) % 7
    startDate.setDate(startDate.getDate() + daysUntilTarget)

    for (let week = 0; week < 12; week++) {
      const instanceDate = new Date(startDate)
      instanceDate.setDate(startDate.getDate() + (week * 7))

      // Parse time
      let hours = 9, minutes = 0
      if (schedule.time) {
        const [h, m] = schedule.time.split(':').map(Number)
        hours = h
        minutes = m
      }

      const eventStart = new Date(instanceDate)
      eventStart.setHours(hours, minutes, 0, 0)

      const eventEnd = new Date(eventStart)
      eventEnd.setHours(eventEnd.getHours() + 2) // Assume 2 hour service

      icsEvents.push({
        start: [
          eventStart.getFullYear(),
          eventStart.getMonth() + 1,
          eventStart.getDate(),
          eventStart.getHours(),
          eventStart.getMinutes()
        ],
        end: [
          eventEnd.getFullYear(),
          eventEnd.getMonth() + 1,
          eventEnd.getDate(),
          eventEnd.getHours(),
          eventEnd.getMinutes()
        ],
        title: schedule.service_type,
        description: schedule.notes || undefined,
        uid: `schedule-${schedule.id}-week${week}@projectorthodox.com`,
        categories: ['service'],
      })
    }
  }

  // Generate ICS file
  const { error, value } = createEvents(icsEvents)

  if (error) {
    console.error('Error generating ICS:', error)
    return new Response('Error generating calendar', { status: 500 })
  }

  // Return the ICS file
  return new Response(value, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}-calendar.ics"`,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
