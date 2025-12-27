import { createClient } from '@/lib/supabase/server'
import { getParishIdFromSlug } from '@/lib/tenancy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AnnouncementsPage({
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
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('parish_id', parishId)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Announcements</h1>

      {announcements && announcements.length > 0 ? (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{announcement.title}</CardTitle>
                  {announcement.is_pinned && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(announcement.created_at || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No announcements available.</p>
      )}
    </div>
  )
}


