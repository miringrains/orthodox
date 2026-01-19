'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CalendarEvent, ServiceSchedule } from '@/components/admin/Calendar'
import { EventModal } from '@/components/admin/EventModal'

interface CalendarClientProps {
  initialEvents: CalendarEvent[]
  schedules: ServiceSchedule[]
  parishId: string
}

export function CalendarClient({ initialEvents, schedules, parishId }: CalendarClientProps) {
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleAddEvent = useCallback((date?: Date) => {
    setSelectedEvent(null)
    setSelectedDate(date || null)
    setModalOpen(true)
  }, [])

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback(() => {
    // Refresh the page to get updated data
    router.refresh()
  }, [router])

  return (
    <>
      <Calendar
        events={events}
        schedules={schedules}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
      />

      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selectedEvent}
        parishId={parishId}
        initialDate={selectedDate}
        onSave={handleSave}
      />
    </>
  )
}
