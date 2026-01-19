'use client'

import { useMemo } from 'react'
import { CalendarEvent, ServiceSchedule, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, EventType, DAYS_OF_WEEK_FULL } from './types'
import { Calendar, Clock, MapPin, Star, Repeat } from 'lucide-react'

interface ListViewProps {
  currentDate: Date
  events: CalendarEvent[]
  schedules: ServiceSchedule[]
  onEventClick: (event: CalendarEvent) => void
}

export function ListView({ 
  currentDate, 
  events, 
  schedules, 
  onEventClick 
}: ListViewProps) {
  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {}
    
    // Sort events by start_at
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    )
    
    sortedEvents.forEach(event => {
      const dateKey = new Date(event.start_at).toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
    })
    
    return groups
  }, [events])

  const dateKeys = Object.keys(groupedEvents)

  return (
    <div className="space-y-6">
      {/* Recurring Services Section */}
      {schedules.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
              <span className="text-[13px] font-semibold text-stone-700 dark:text-neutral-200">
                Recurring Services
              </span>
            </div>
          </div>
          <div className="divide-y divide-stone-100 dark:divide-neutral-800">
            {schedules.map(service => (
              <div key={service.id} className="px-4 py-3 flex items-center gap-4">
                <div className="w-24 text-[13px] font-medium text-stone-600 dark:text-neutral-300">
                  {service.day_of_week !== null ? DAYS_OF_WEEK_FULL[service.day_of_week] : 'Various'}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-stone-500 dark:text-neutral-400">
                  <Clock className="h-3.5 w-3.5" />
                  {service.time 
                    ? new Date(`2000-01-01T${service.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })
                    : 'TBD'
                  }
                </div>
                <div className="flex-1 text-[14px] font-medium text-stone-900 dark:text-neutral-100">
                  {service.service_type}
                </div>
                {service.notes && (
                  <div className="text-[12px] text-stone-500 dark:text-neutral-400 max-w-[200px] truncate">
                    {service.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events by Date */}
      {dateKeys.length > 0 ? (
        dateKeys.map(dateKey => {
          const date = new Date(dateKey)
          const dayEvents = groupedEvents[dateKey]
          
          return (
            <div 
              key={dateKey}
              className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-lg overflow-hidden"
            >
              {/* Date Header */}
              <div className="px-4 py-3 bg-stone-50 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
                  <span className="text-[13px] font-semibold text-stone-700 dark:text-neutral-200">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Events */}
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {dayEvents.map(event => {
                  const colorClass = EVENT_TYPE_COLORS[event.event_type as EventType] || 'bg-gray-500'
                  
                  return (
                    <div 
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="px-4 py-3 flex items-start gap-4 hover:bg-stone-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                    >
                      {/* Color indicator */}
                      <div className={`w-1 h-12 rounded-full ${colorClass}`} />
                      
                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-medium text-stone-900 dark:text-neutral-100">
                            {event.title}
                          </span>
                          {event.is_feast && (
                            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                          )}
                          {event.status === 'draft' && (
                            <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                              Draft
                            </span>
                          )}
                          {event.status === 'cancelled' && (
                            <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400">
                              Cancelled
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5 text-[12px] text-stone-500 dark:text-neutral-400">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(event.start_at).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                            {event.end_at && (
                              <>
                                {' - '}
                                {new Date(event.end_at).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-1.5 text-[12px] text-stone-500 dark:text-neutral-400">
                              <MapPin className="h-3.5 w-3.5" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="mt-1.5 text-[13px] text-stone-600 dark:text-neutral-300 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Event type badge */}
                      <div className="text-[11px] font-medium text-stone-500 dark:text-neutral-400">
                        {EVENT_TYPE_LABELS[event.event_type as EventType] || event.event_type}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-lg py-12 text-center">
          <Calendar className="h-8 w-8 text-stone-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-[15px] text-stone-500 dark:text-neutral-400">
            No events scheduled for this period
          </p>
        </div>
      )}
    </div>
  )
}
