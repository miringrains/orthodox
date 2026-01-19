'use client'

import { CalendarEvent, ServiceSchedule, EVENT_TYPE_COLORS, EventType } from './types'

interface EventChipProps {
  event?: CalendarEvent
  service?: ServiceSchedule
  compact?: boolean
  onClick?: () => void
}

export function EventChip({ event, service, compact = false, onClick }: EventChipProps) {
  if (service) {
    const time = service.time 
      ? new Date(`2000-01-01T${service.time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      : ''

    return (
      <button
        onClick={onClick}
        className={`
          w-full text-left rounded px-1.5 py-0.5 truncate
          bg-stone-100 dark:bg-neutral-700 text-stone-700 dark:text-neutral-200
          hover:bg-stone-200 dark:hover:bg-neutral-600 transition-colors
          ${compact ? 'text-[10px]' : 'text-[11px]'}
        `}
      >
        {time && <span className="font-medium">{time} </span>}
        {service.service_type}
      </button>
    )
  }

  if (event) {
    const colorClass = EVENT_TYPE_COLORS[event.event_type as EventType] || 'bg-gray-500'
    const time = new Date(event.start_at).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })

    return (
      <button
        onClick={onClick}
        className={`
          w-full text-left rounded px-1.5 py-0.5 truncate text-white
          ${colorClass} hover:opacity-80 transition-opacity
          ${compact ? 'text-[10px]' : 'text-[11px]'}
          ${event.status === 'cancelled' ? 'line-through opacity-50' : ''}
        `}
      >
        {!compact && <span className="font-medium">{time} </span>}
        {event.is_feast && event.feast_name ? event.feast_name : event.title}
      </button>
    )
  }

  return null
}
