import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { SermonForm } from '@/components/admin/SermonForm'

export const dynamic = 'force-dynamic'

export default async function EditSermonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()
  
  const supabase = await createClient()
  const { data: sermon } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .single()

  if (!sermon) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)
  
  if (!userParishIds.includes(sermon.parish_id)) {
    redirect('/admin/sermons')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Sermon</h1>
        <p className="text-muted-foreground mt-2">Update sermon details</p>
      </div>
      <SermonForm parishes={parishes} sermon={sermon} />
    </div>
  )
}

