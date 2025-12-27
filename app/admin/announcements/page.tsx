import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Megaphone, Pin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
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

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Announcements
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage parish announcements and news
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Link>
        </Button>
      </div>

      {announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{announcement.title}</CardTitle>
                    <p className="text-[13px] text-stone-500 dark:text-neutral-400 mt-1 tracking-wide">
                      {(announcement.parishes as any)?.name || 'Unknown Parish'}
                    </p>
                  </div>
                  {announcement.is_pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider bg-gold-100 dark:bg-gold-500/20 text-gold-700 dark:text-gold-400 px-2 py-1 rounded">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4 line-clamp-2">
                  {announcement.content.replace(/<[^>]*>/g, '')}
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/announcements/${announcement.id}`}>Edit</Link>
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
              <Megaphone className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No announcements yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
