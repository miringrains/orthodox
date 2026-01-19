'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ViewSwitcher } from './ViewSwitcher'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { ListView } from './ListView'
import { ViewMode, CalendarEvent, ServiceSchedule, MONTHS } from './types'

interface CalendarProps {
  events: CalendarEvent[]
  schedules: ServiceSchedule[]
  onAddEvent: (date?: Date) => void
  onEditEvent: (event: CalendarEvent) => void
}

export function Calendar({ events, schedules, onAddEvent, onEditEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')

  // Filter events for current view period
  const filteredEvents = useMemo(() => {
    const start = getViewStartDate(currentDate, viewMode)
    const end = getViewEndDate(currentDate, viewMode)
    
    return events.filter(event => {
      const eventDate = new Date(event.start_at)
      return eventDate >= start && eventDate <= end
    })
  }, [events, currentDate, viewMode])

  // Navigation handlers
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'week':
      case 'list':
        newDate.setDate(newDate.getDate() - 7)
        break
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'week':
      case 'list':
        newDate.setDate(newDate.getDate() + 7)
        break
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format the current period label
  const periodLabel = useMemo(() => {
    switch (viewMode) {
      case 'year':
        return currentDate.getFullYear().toString()
      case 'month':
        return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      case 'week':
      case 'list': {
        const start = getViewStartDate(currentDate, viewMode)
        const end = getViewEndDate(currentDate, viewMode)
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      }
    }
  }, [currentDate, viewMode])

  // Handle day click to open add event modal
  const handleDayClick = (date: Date) => {
    onAddEvent(date)
  }

  // Handle time slot click (for week view)
  const handleTimeSlotClick = (date: Date, hour: number) => {
    const newDate = new Date(date)
    newDate.setHours(hour, 0, 0, 0)
    onAddEvent(newDate)
  }

  return (
    <div className="space-y-4">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-semibold text-stone-900 dark:text-neutral-100 ml-4">
            {periodLabel}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <Button onClick={() => onAddEvent()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar views */}
      {viewMode === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={filteredEvents}
          schedules={schedules}
          onDayClick={handleDayClick}
          onEventClick={onEditEvent}
        />
      )}

      {viewMode === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          schedules={schedules}
          onTimeSlotClick={handleTimeSlotClick}
          onEventClick={onEditEvent}
        />
      )}

      {(viewMode === 'list' || viewMode === 'year') && (
        <ListView
          currentDate={currentDate}
          events={filteredEvents}
          schedules={schedules}
          onEventClick={onEditEvent}
        />
      )}
    </div>
  )
}

// Helper functions
function getViewStartDate(date: Date, viewMode: ViewMode): Date {
  const start = new Date(date)
  
  switch (viewMode) {
    case 'year':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      break
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
    case 'list':
      start.setDate(start.getDate() - start.getDay())
      start.setHours(0, 0, 0, 0)
      break
  }
  
  return start
}

function getViewEndDate(date: Date, viewMode: ViewMode): Date {
  const end = new Date(date)
  
  switch (viewMode) {
    case 'year':
      end.setMonth(11, 31)
      end.setHours(23, 59, 59, 999)
      break
    case 'month':
      end.setMonth(end.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'week':
    case 'list':
      end.setDate(end.getDate() - end.getDay() + 6)
      end.setHours(23, 59, 59, 999)
      break
  }
  
  return end
}

// Re-export types for convenience
export * from './types'
