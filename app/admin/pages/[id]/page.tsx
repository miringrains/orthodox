import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { redirect, notFound } from 'next/navigation'
import { PageForm } from '@/components/admin/PageForm'

export const dynamic = 'force-dynamic'

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()

  const supabase = await createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (!page) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)

  if (!userParishIds.includes(page.parish_id)) {
    redirect('/admin/pages')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Page</h1>
        <p className="text-muted-foreground mt-2">Update page details</p>
      </div>
      <PageForm parishes={parishes} page={page} />
    </div>
  )
}

