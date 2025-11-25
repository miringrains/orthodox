import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { AnnouncementForm } from '@/components/admin/AnnouncementForm'

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()
  
  const supabase = await createClient()
  const { data: announcement } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (!announcement) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)
  
  if (!userParishIds.includes(announcement.parish_id)) {
    redirect('/admin/announcements')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Announcement</h1>
        <p className="text-muted-foreground mt-2">Update announcement details</p>
      </div>
      <AnnouncementForm parishes={parishes} announcement={announcement} />
    </div>
  )
}

