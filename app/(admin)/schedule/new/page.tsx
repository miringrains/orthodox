import { redirect } from 'next/navigation'
import { getUserParishes } from '@/lib/parish-context'
import { requireAuth } from '@/lib/auth'
import { ScheduleForm } from '@/components/admin/ScheduleForm'

export default async function NewSchedulePage() {
  await requireAuth()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    redirect('/admin/settings')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Service</h1>
        <p className="text-muted-foreground mt-2">Add a recurring service time</p>
      </div>
      <ScheduleForm parishes={parishes} />
    </div>
  )
}

