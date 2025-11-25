import { createClient } from '@/lib/supabase/server'
import { getParishIdFromSlug } from '@/lib/tenancy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CraftRenderer } from '@/components/craft/Renderer'
import Link from 'next/link'
import { Calendar, Megaphone, Headphones, DollarSign } from 'lucide-react'

export default async function ParishHomePage({
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

  // Check if home page has builder content
  const { data: homePage, error: homePageError } = await supabase
    .from('pages')
    .select('builder_schema, builder_enabled')
    .eq('parish_id', parishId)
    .eq('kind', 'HOME')
    .maybeSingle()

  // If builder is enabled and has content, render it
  if (homePage?.builder_enabled && homePage?.builder_schema) {
    const builderData = homePage.builder_schema as any
    
    return (
      <div className="container mx-auto px-4 py-12">
        <CraftRenderer content={builderData} />
      </div>
    )
  }

  // If there was an error (other than not found), log it but continue with default content
  if (homePageError && homePageError.code !== 'PGRST116') {
    console.error('Error fetching home page:', homePageError)
  }

  // Otherwise, render default content
  // Fetch recent content
  const [announcementsRes, eventsRes, sermonsRes] = await Promise.all([
    supabase
      .from('announcements')
      .select('id, title, content, created_at')
      .eq('parish_id', parishId)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('events')
      .select('id, title, start_at, description')
      .eq('parish_id', parishId)
      .gte('start_at', new Date().toISOString())
      .order('start_at', { ascending: true })
      .limit(3),
    supabase
      .from('sermons')
      .select('id, title, date_preached, description')
      .eq('parish_id', parishId)
      .order('date_preached', { ascending: false })
      .limit(3),
  ])

  const announcements = announcementsRes.data || []
  const events = eventsRes.data || []
  const sermons = sermonsRes.data || []

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Parish</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join us in worship, fellowship, and service to our community.
        </p>
      </section>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <Link href={`/p/${slug}/schedule`}>
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Service Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View our weekly services</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <Link href={`/p/${slug}/announcements`}>
            <CardHeader>
              <Megaphone className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Latest parish news</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <Link href={`/p/${slug}/sermons`}>
            <CardHeader>
              <Headphones className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Sermons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Listen to recent sermons</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <Link href={`/p/${slug}/giving`}>
            <CardHeader>
              <DollarSign className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Giving</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Support our parish</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Announcements */}
      {announcements.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Announcements</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {announcement.content}
                  </p>
                  <Link
                    href={`/p/${slug}/announcements/${announcement.id}`}
                    className="text-primary text-sm mt-2 inline-block hover:underline"
                  >
                    Read more →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href={`/p/${slug}/announcements`}>View All Announcements</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(event.start_at).toLocaleDateString()}
                  </p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href={`/p/${slug}/events`}>View All Events</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

