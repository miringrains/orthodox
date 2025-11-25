import { redirect } from 'next/navigation'
import { getUserParishes } from '@/lib/parish-context'
import { requireAuth } from '@/lib/auth'
import { CommunityNeedForm } from '@/components/admin/CommunityNeedForm'

export const dynamic = 'force-dynamic'

export default async function NewCommunityNeedPage() {
  await requireAuth()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    redirect('/admin/settings')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Community Need</h1>
        <p className="text-muted-foreground mt-2">Create a new internal fundraising campaign</p>
      </div>
      <CommunityNeedForm parishes={parishes} />
    </div>
  )
}

