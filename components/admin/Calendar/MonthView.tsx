'use client'

import { useMemo } from 'react'
import { CalendarEvent, ServiceSchedule, DAYS_OF_WEEK, CalendarDay } from './types'
import { EventChip } from './EventChip'
import { Star } from 'lucide-react'

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  schedules: ServiceSchedule[]
  onDayClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function MonthView({ 
  currentDate, 
  events, 
  schedules, 
  onDayClick, 
  onEventClick 
}: MonthViewProps) {
  // Calculate calendar days for the current month
  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const startDayOfWeek = firstDayOfMonth.getDay()
    
    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        events: getEventsForDay(date, events),
        services: getServicesForDayOfWeek(date.getDay(), schedules),
      })
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        events: getEventsForDay(date, events),
        services: getServicesForDayOfWeek(date.getDay(), schedules),
      })
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        events: getEventsForDay(date, events),
        services: getServicesForDayOfWeek(date.getDay(), schedules),
      })
    }
    
    return days
  }, [currentDate, events, schedules])

  return (
    <div className="border border-stone-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-stone-50 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700">
        {DAYS_OF_WEEK.map(day => (
          <div 
            key={day} 
            className="py-3 text-center text-[13px] font-semibold text-stone-500 dark:text-neutral-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-stone-200 dark:divide-neutral-700">
        {calendarDays.map((day, index) => {
          const hasFeast = day.events.some(e => e.is_feast)
          const hasContent = day.events.length > 0 || day.services.length > 0
          const maxVisible = 3

          return (
            <div
              key={index}
              onClick={() => onDayClick(day.date)}
              className={`
                min-h-[100px] p-1.5 cursor-pointer transition-colors
                ${day.isCurrentMonth 
                  ? 'bg-white dark:bg-neutral-900' 
                  : 'bg-stone-50 dark:bg-neutral-950'
                }
                hover:bg-stone-50 dark:hover:bg-neutral-800
              `}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 text-[13px] font-medium rounded-full
                    ${day.isToday 
                      ? 'bg-stone-900 dark:bg-neutral-100 text-white dark:text-neutral-900' 
                      : day.isCurrentMonth 
                        ? 'text-stone-900 dark:text-neutral-100' 
                        : 'text-stone-400 dark:text-neutral-600'
                    }
                  `}
                >
                  {day.date.getDate()}
                </span>
                {hasFeast && (
                  <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                )}
              </div>

              {/* Events and services */}
              <div className="space-y-0.5">
                {day.events.slice(0, maxVisible).map(event => (
                  <EventChip
                    key={event.id}
                    event={event}
                    compact
                    onClick={() => {
                      event && onEventClick(event)
                    }}
                  />
                ))}
                {day.services.slice(0, maxVisible - day.events.length).map(service => (
                  <EventChip
                    key={service.id}
                    service={service}
                    compact
                  />
                ))}
                {hasContent && (day.events.length + day.services.length > maxVisible) && (
                  <div className="text-[10px] text-stone-500 dark:text-neutral-500 pl-1">
                    +{day.events.length + day.services.length - maxVisible} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper functions
function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = new Date(event.start_at)
    return eventDate.toDateString() === date.toDateString()
  })
}

function getServicesForDayOfWeek(dayOfWeek: number, schedules: ServiceSchedule[]): ServiceSchedule[] {
  return schedules.filter(s => s.day_of_week === dayOfWeek)
}
