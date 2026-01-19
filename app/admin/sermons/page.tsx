import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Headphones, Calendar, Play, Mic, Video, BookOpen, Eye, MoreHorizontal, Settings, User } from 'lucide-react'

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

  // Get unique preachers for filter
  const preachers = [...new Set(sermons?.map(s => (s as any).preacher_name).filter(Boolean))]

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/sermons/podcast-settings">
              <Mic className="h-4 w-4 mr-2" />
              Podcast Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/sermons/new">
              <Plus className="h-4 w-4 mr-2" />
              New Sermon
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select className="h-9 px-3 pr-8 rounded-lg border border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[13px] text-stone-700 dark:text-neutral-200 appearance-none cursor-pointer">
            <option>All Preachers</option>
            {preachers.map(preacher => (
              <option key={preacher} value={preacher}>{preacher}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select className="h-9 px-3 pr-8 rounded-lg border border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[13px] text-stone-700 dark:text-neutral-200 appearance-none cursor-pointer">
            <option>All Series</option>
          </select>
        </div>
        <Input 
          placeholder="Search sermons..." 
          className="max-w-xs h-9 text-[13px]"
        />
      </div>

      {sermons && sermons.length > 0 ? (
        <div className="space-y-3">
          {sermons.map((sermon) => {
            const preacherName = (sermon as any).preacher_name
            const scriptureRef = (sermon as any).scripture_reference
            const duration = (sermon as any).duration_seconds

            return (
              <div 
                key={sermon.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl hover:border-stone-300 dark:hover:border-neutral-600 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex-shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center">
                      <Play className="h-4 w-4 text-stone-600 dark:text-neutral-300 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-stone-900 dark:text-neutral-100 mb-1">
                    {sermon.title}
                  </div>
                  
                  <div className="flex items-center gap-3 text-[12px] text-stone-500 dark:text-neutral-400">
                    {sermon.date_preached && (
                      <span>
                        {new Date(sermon.date_preached).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {preacherName && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {preacherName}
                      </span>
                    )}
                    {scriptureRef && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {scriptureRef}
                      </span>
                    )}
                  </div>

                  {/* Media indicators */}
                  <div className="flex items-center gap-2 mt-2">
                    {sermon.audio_url && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-neutral-400 bg-stone-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        <Mic className="h-3 w-3" />
                        Audio
                      </span>
                    )}
                    {sermon.video_url && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-neutral-400 bg-stone-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        <Video className="h-3 w-3" />
                        Video
                      </span>
                    )}
                    {duration && (
                      <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                        {formatDuration(duration)}
                      </span>
                    )}
                    {(sermon.view_count ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-neutral-500">
                        <Play className="h-3 w-3" />
                        {sermon.view_count} plays
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/sermons/${sermon.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
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
