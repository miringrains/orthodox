import { createClient } from '@/lib/supabase/server'
import { getParishIdFromSlug } from '@/lib/tenancy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, ExternalLink } from 'lucide-react'

export default async function SermonsPage({
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
  const { data: sermons } = await supabase
    .from('sermons')
    .select('*')
    .eq('parish_id', parishId)
    .order('date_preached', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Sermons</h1>

      {sermons && sermons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <Card key={sermon.id}>
              <CardHeader>
                <CardTitle>{sermon.title}</CardTitle>
                {sermon.date_preached && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(sermon.date_preached).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {sermon.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {sermon.description}
                  </p>
                )}
                <div className="flex gap-2">
                  {sermon.audio_url && (
                    <Button asChild size="sm" variant="outline">
                      <a href={sermon.audio_url} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Audio
                      </a>
                    </Button>
                  )}
                  {sermon.video_url && (
                    <Button asChild size="sm" variant="outline">
                      <a href={sermon.video_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Video
                      </a>
                    </Button>
                  )}
                  {sermon.text_content && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`/p/${slug}/sermons/${sermon.id}`}>
                        Read
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No sermons available.</p>
      )}
    </div>
  )
}

