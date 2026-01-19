'use client'

import { useMemo } from 'react'
import { CalendarEvent, ServiceSchedule, DAYS_OF_WEEK_FULL } from './types'
import { EventChip } from './EventChip'

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  schedules: ServiceSchedule[]
  onTimeSlotClick: (date: Date, hour: number) => void
  onEventClick: (event: CalendarEvent) => void
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM to 9 PM

export function WeekView({ 
  currentDate, 
  events, 
  schedules, 
  onTimeSlotClick, 
  onEventClick 
}: WeekViewProps) {
  // Get the week's dates
  const weekDates = useMemo(() => {
    const dates: Date[] = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [currentDate])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="border border-stone-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-8 bg-stone-50 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700">
        <div className="w-16" /> {/* Time column header */}
        {weekDates.map((date, i) => {
          const isToday = date.getTime() === today.getTime()
          return (
            <div key={i} className="py-3 text-center border-l border-stone-200 dark:border-neutral-700">
              <div className="text-[11px] font-medium text-stone-400 dark:text-neutral-500 uppercase tracking-wider">
                {DAYS_OF_WEEK_FULL[i].slice(0, 3)}
              </div>
              <div className={`
                text-lg font-semibold mt-0.5
                ${isToday 
                  ? 'text-gold-600 dark:text-gold-400' 
                  : 'text-stone-900 dark:text-neutral-100'
                }
              `}>
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto max-h-[600px]">
        {HOURS.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-stone-100 dark:border-neutral-800">
            {/* Time label */}
            <div className="w-16 py-3 px-2 text-right text-[11px] text-stone-400 dark:text-neutral-500 border-r border-stone-200 dark:border-neutral-700">
              {formatHour(hour)}
            </div>
            
            {/* Day cells */}
            {weekDates.map((date, dayIndex) => {
              const dayEvents = getEventsForHour(date, hour, events)
              const dayServices = hour === 6 
                ? getServicesForDayOfWeek(date.getDay(), schedules) 
                : [] // Show recurring services at 6 AM row

              return (
                <div
                  key={dayIndex}
                  onClick={() => onTimeSlotClick(date, hour)}
                  className="min-h-[50px] p-1 border-l border-stone-100 dark:border-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {dayEvents.map(event => (
                    <EventChip
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                    />
                  ))}
                  {dayServices.map(service => (
                    <EventChip
                      key={service.id}
                      service={service}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour} ${period}`
}

function getEventsForHour(date: Date, hour: number, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = new Date(event.start_at)
    return (
      eventDate.toDateString() === date.toDateString() &&
      eventDate.getHours() === hour
    )
  })
}

function getServicesForDayOfWeek(dayOfWeek: number, schedules: ServiceSchedule[]): ServiceSchedule[] {
  return schedules.filter(s => s.day_of_week === dayOfWeek)
}
