import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Headphones, Calendar } from 'lucide-react'

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
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Sermons
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage sermons and media
          </p>
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
                <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                  {(sermon.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                {sermon.date_preached && (
                  <div className="flex items-center gap-2 text-[13px] text-stone-500 dark:text-neutral-400 mb-4 tracking-wide">
                    <Calendar className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
                    <span>
                      {new Date(sermon.date_preached).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {sermon.description && (
                  <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4 line-clamp-2">
                    {sermon.description}
                  </p>
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
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No sermons yet. Add your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
