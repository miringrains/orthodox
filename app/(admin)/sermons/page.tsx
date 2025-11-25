import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SermonsPage() {
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

  const { data: sermons } = await supabase
    .from('sermons')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('date_preached', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sermons</h1>
          <p className="text-muted-foreground mt-2">Manage sermons and media</p>
        </div>
        <Button asChild>
          <Link href="/admin/sermons/new">
            <Plus className="h-4 w-4 mr-2" />
            New Sermon
          </Link>
        </Button>
      </div>

      {sermons && sermons.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <Card key={sermon.id}>
              <CardHeader>
                <CardTitle>{sermon.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {(sermon.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                {sermon.date_preached && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(sermon.date_preached).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
                {sermon.description && (
                  <p className="text-sm mb-4 line-clamp-2">{sermon.description}</p>
                )}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/sermons/${sermon.id}`}>Edit</Link>
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
              No sermons yet. Add your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

