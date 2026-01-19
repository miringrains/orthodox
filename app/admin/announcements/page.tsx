import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Megaphone, Pin, Star, GripVertical, MoreHorizontal, Pencil, Trash2, Archive, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORY_COLORS: Record<string, string> = {
  'Diocese News': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  'Fundraising': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  'Youth Ministry': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'Service Change': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  'General': 'bg-stone-100 dark:bg-neutral-700 text-stone-700 dark:text-neutral-300',
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  draft: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  archived: 'bg-stone-100 dark:bg-neutral-700 text-stone-600 dark:text-neutral-400',
  expired: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
}

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
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  // Group announcements by status (cast to any for new columns not yet in types)
  const activeAnnouncements = announcements?.filter(a => 
    !(a as any).status || (a as any).status === 'published'
  ) || []
  const draftAnnouncements = announcements?.filter(a => (a as any).status === 'draft') || []
  const archivedAnnouncements = announcements?.filter(a => 
    (a as any).status === 'archived' || (a as any).status === 'expired'
  ) || []

  const renderAnnouncementCard = (announcement: NonNullable<typeof announcements>[0]) => {
    const status = (announcement as any).status || 'published'
    const category = announcement.category || 'General'
    const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS['General']
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['draft']

    return (
      <div 
        key={announcement.id}
        className="flex items-start gap-5 p-5 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl hover:border-stone-300 dark:hover:border-neutral-600 transition-colors"
      >
        {/* Drag handle */}
        <button className="text-stone-300 dark:text-neutral-600 hover:text-stone-500 dark:hover:text-neutral-400 cursor-grab mt-1">
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Image or placeholder */}
        <div className="w-24 h-20 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex-shrink-0 overflow-hidden">
          {(announcement as any).image_url ? (
            <Image
              src={(announcement as any).image_url}
              alt={announcement.title}
              width={96}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-semibold text-stone-900 dark:text-neutral-100">
              {announcement.title}
            </span>
            {announcement.is_pinned && (
              <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-500 dark:text-neutral-400">
              {announcement.created_at && new Date(announcement.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className={`px-2 py-0.5 rounded font-medium text-xs ${categoryColor}`}>
              {category}
            </span>
            <span className={`px-2 py-0.5 rounded font-medium text-xs ${statusStyle}`}>
              ● {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {announcement.is_pinned && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gold-600 dark:text-gold-400">
              <Pin className="h-4 w-4" />
              Pinned to Homepage
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href={`/admin/announcements/${announcement.id}`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/admin/announcements/${announcement.id}`} className="flex items-center">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Announcement
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Announcements
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-base">
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-5">
          <TabsTrigger value="active" className="text-sm">
            Active ({activeAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="text-sm">
            Drafts ({draftAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="text-sm">
            Archived ({archivedAnnouncements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAnnouncements.length > 0 ? (
            activeAnnouncements.map(renderAnnouncementCard)
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-5">
                  <Megaphone className="h-7 w-7 text-stone-400 dark:text-neutral-500" />
                </div>
                <p className="text-stone-500 dark:text-neutral-400 text-base">
                  No active announcements. Create your first one!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftAnnouncements.length > 0 ? (
            draftAnnouncements.map(renderAnnouncementCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-base">
                  No draft announcements
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedAnnouncements.length > 0 ? (
            archivedAnnouncements.map(renderAnnouncementCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-base">
                  No archived announcements
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
