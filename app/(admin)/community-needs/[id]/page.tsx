import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { CommunityNeedForm } from '@/components/admin/CommunityNeedForm'

export default async function EditCommunityNeedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()
  
  const supabase = await createClient()
  const { data: need } = await supabase
    .from('community_needs')
    .select('*')
    .eq('id', id)
    .single()

  if (!need) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)
  
  if (!userParishIds.includes(need.parish_id)) {
    redirect('/admin/community-needs')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Community Need</h1>
        <p className="text-muted-foreground mt-2">Update community need details</p>
      </div>
      <CommunityNeedForm parishes={parishes} need={need} />
    </div>
  )
}

