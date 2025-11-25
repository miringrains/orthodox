import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { redirect } from 'next/navigation'
import { PageForm } from '@/components/admin/PageForm'

export const dynamic = 'force-dynamic'

export default async function NewPagePage() {
  await requireAuth()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    redirect('/admin/settings')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Page</h1>
        <p className="text-muted-foreground mt-2">Create a new page for your parish website</p>
      </div>
      <PageForm parishes={parishes} />
    </div>
  )
}

