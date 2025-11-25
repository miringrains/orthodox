import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { ScheduleForm } from '@/components/admin/ScheduleForm'

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()
  
  const supabase = await createClient()
  const { data: schedule } = await supabase
    .from('service_schedules')
    .select('*')
    .eq('id', id)
    .single()

  if (!schedule) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)
  
  if (!userParishIds.includes(schedule.parish_id)) {
    redirect('/admin/schedule')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground mt-2">Update service schedule</p>
      </div>
      <ScheduleForm parishes={parishes} schedule={schedule} />
    </div>
  )
}

