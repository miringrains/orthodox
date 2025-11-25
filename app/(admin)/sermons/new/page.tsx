import { redirect } from 'next/navigation'
import { getUserParishes } from '@/lib/parish-context'
import { requireAuth } from '@/lib/auth'
import { SermonForm } from '@/components/admin/SermonForm'

export default async function NewSermonPage() {
  await requireAuth()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    redirect('/admin/settings')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Sermon</h1>
        <p className="text-muted-foreground mt-2">Add a new sermon or media</p>
      </div>
      <SermonForm parishes={parishes} />
    </div>
  )
}

