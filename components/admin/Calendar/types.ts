export type ViewMode = 'year' | 'month' | 'week' | 'list'

export type EventType = 
  | 'divine_liturgy' 
  | 'vespers' 
  | 'matins' 
  | 'feast_day' 
  | 'saint_day'
  | 'sacramental' 
  | 'parish_event' 
  | 'meeting' 
  | 'education' 
  | 'social' 
  | 'external' 
  | 'other'

export type EventStatus = 'draft' | 'published' | 'cancelled'

export interface CalendarEvent {
  id: string
  parish_id: string
  title: string
  description: string | null
  event_type: EventType
  service_type: string | null
  start_at: string
  end_at: string | null
  location: string | null
  is_feast: boolean | null
  feast_name: string | null
  status: EventStatus
  color: string | null
  recurrence_rule: string | null
}

export interface ServiceSchedule {
  id: string
  parish_id: string
  service_type: string
  day_of_week: number | null
  time: string | null
  is_recurring: boolean | null
  notes: string | null
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  services: ServiceSchedule[]
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  divine_liturgy: 'Divine Liturgy',
  vespers: 'Vespers',
  matins: 'Matins',
  feast_day: 'Feast Day',
  saint_day: 'Saint Day',
  sacramental: 'Sacramental Service',
  parish_event: 'Parish Event',
  meeting: 'Meeting',
  education: 'Education',
  social: 'Social',
  external: 'External',
  other: 'Other',
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  divine_liturgy: 'bg-gold-500',
  vespers: 'bg-indigo-500',
  matins: 'bg-sky-500',
  feast_day: 'bg-red-500',
  saint_day: 'bg-amber-500',
  sacramental: 'bg-purple-500',
  parish_event: 'bg-emerald-500',
  meeting: 'bg-slate-500',
  education: 'bg-blue-500',
  social: 'bg-pink-500',
  external: 'bg-orange-500',
  other: 'bg-gray-500',
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const DAYS_OF_WEEK_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
