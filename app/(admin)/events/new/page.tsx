import { redirect } from 'next/navigation'
import { getUserParishes } from '@/lib/parish-context'
import { requireAuth } from '@/lib/auth'
import { EventForm } from '@/components/admin/EventForm'

export default async function NewEventPage() {
  await requireAuth()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    redirect('/admin/settings')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Event</h1>
        <p className="text-muted-foreground mt-2">Create a new parish event</p>
      </div>
      <EventForm parishes={parishes} />
    </div>
  )
}

