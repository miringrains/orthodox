import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { EventForm } from '@/components/admin/EventForm'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()
  
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)
  
  if (!userParishIds.includes(event.parish_id)) {
    redirect('/admin/events')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground mt-2">Update event details</p>
      </div>
      <EventForm parishes={parishes} event={event} />
    </div>
  )
}

